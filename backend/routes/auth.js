// routes/auth.js  — POST /api/register  |  POST /api/login
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const { generateToken } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// POST /api/register
// Body: { role, full_name, email, password, mobile_number,
//         roll_number|employee_id, branch, year, percentage, backlogs, department }
// ══════════════════════════════════════════════════════
router.post('/register', async (req, res) => {
    const {
        role, full_name, email, password, mobile_number,
        roll_number, employee_id, branch, year, percentage,
        backlogs = 0, department = 'Training & Placement',
    } = req.body;

    // ── Basic validation ──────────────────────────────
    if (!role || !['student', 'officer'].includes(role)) {
        return error(res, 'role must be "student" or "officer"', 400);
    }
    if (!full_name || !email || !password || !mobile_number) {
        return error(res, 'full_name, email, password and mobile_number are required', 400);
    }
    if (password.length < 6) {
        return error(res, 'Password must be at least 6 characters', 400);
    }

    try {
        const hash = await bcrypt.hash(password, 10);

        if (role === 'student') {
            if (!roll_number || !branch || !year || percentage === undefined) {
                return error(res, 'For students: roll_number, branch, year and percentage are required', 400);
            }

            // Check duplicate
            const { data: existing } = await supabase
                .from('students')
                .select('student_id')
                .or(`email.eq.${email},roll_number.eq.${roll_number}`)
                .limit(1);

            if (existing && existing.length) {
                return error(res, 'Email or Roll Number already registered', 409);
            }

            const { data: inserted, error: insertErr } = await supabase
                .from('students')
                .insert([{
                    full_name,
                    roll_number,
                    email,
                    mobile_number,
                    branch,
                    year: parseInt(year),
                    percentage: parseFloat(percentage),
                    backlogs: parseInt(backlogs),
                    password: hash,
                }])
                .select()
                .single();

            if (insertErr) throw insertErr;

            // Create blank performance record
            await supabase
                .from('performance')
                .upsert([{ student_id: inserted.student_id }], { onConflict: 'student_id' });

            const token = generateToken({ id: inserted.student_id, role: 'student', email });
            return success(res, {
                token, role: 'student',
                user: {
                    id: inserted.student_id, full_name, email,
                    roll_number, branch, year, percentage,
                },
            }, 'Student registered successfully', 201);

        } else {
            // Officer
            if (!employee_id) return error(res, 'employee_id is required for officers', 400);

            const { data: existing } = await supabase
                .from('officers')
                .select('officer_id')
                .or(`email.eq.${email},employee_id.eq.${employee_id}`)
                .limit(1);

            if (existing && existing.length) {
                return error(res, 'Email or Employee ID already registered', 409);
            }

            const { data: inserted, error: insertErr } = await supabase
                .from('officers')
                .insert([{ full_name, email, mobile_number, employee_id, department, password: hash }])
                .select()
                .single();

            if (insertErr) throw insertErr;

            const token = generateToken({ id: inserted.officer_id, role: 'officer', email });
            return success(res, {
                token, role: 'officer',
                user: { id: inserted.officer_id, full_name, email, employee_id, department },
            }, 'Officer registered successfully', 201);
        }

    } catch (err) {
        console.error('Register error:', err);
        return error(res, 'Registration failed', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/login
// Body: { email, password, role }
// For students: 'email' field accepts Regd.No OR full email
// ══════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    const loginId = (email || '').trim();

    if (!loginId || !password || !role) {
        return error(res, 'Login ID, password and role are required', 400);
    }

    try {
        let query;

        if (role === 'student') {
            query = supabase
                .from('students')
                .select('*')
                .or(`email.eq.${loginId},roll_number.eq.${loginId.toUpperCase()}`)
                .limit(1);
        } else if (role === 'officer') {
            query = supabase
                .from('officers')
                .select('*')
                .or(`email.eq.${loginId},employee_id.eq.${loginId.toUpperCase()}`)
                .limit(1);
        } else {
            return error(res, 'role must be "student" or "officer"', 400);
        }

        const { data: rows, error: queryErr } = await query;
        if (queryErr) throw queryErr;

        if (!rows || !rows.length) {
            return error(res, 'Invalid login ID or password', 401);
        }

        const user = rows[0];
        const idField = role === 'student' ? 'student_id' : 'officer_id';

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return error(res, 'Invalid login ID or password', 401);
        }

        const token = generateToken({ id: user[idField], role, email: user.email });
        delete user.password;

        return success(res, { token, role, user }, 'Login successful');

    } catch (err) {
        console.error('Login error:', err);
        return error(res, 'Login failed', 500, err.message);
    }
});

module.exports = router;
