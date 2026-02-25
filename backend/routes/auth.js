// routes/auth.js  — POST /api/register  |  POST /api/login
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
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

            const [existing] = await pool.query(
                'SELECT student_id FROM students WHERE email = ? OR roll_number = ?', [email, roll_number]
            );
            if (existing.length) return error(res, 'Email or Roll Number already registered', 409);

            const [result] = await pool.query(
                `INSERT INTO students
           (full_name, roll_number, email, mobile_number, branch, year, percentage, backlogs, password)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, roll_number, email, mobile_number, branch, parseInt(year), parseFloat(percentage), parseInt(backlogs), hash]
            );

            // Create blank performance record
            await pool.query('INSERT IGNORE INTO performance (student_id) VALUES (?)', [result.insertId]);

            const token = generateToken({ id: result.insertId, role: 'student', email });
            return success(res, { token, role: 'student', user: { id: result.insertId, full_name, email, roll_number, branch, year, percentage } }, 'Student registered successfully', 201);

        } else {
            // Officer
            if (!employee_id) return error(res, 'employee_id is required for officers', 400);

            const [existing] = await pool.query(
                'SELECT officer_id FROM officers WHERE email = ? OR employee_id = ?', [email, employee_id]
            );
            if (existing.length) return error(res, 'Email or Employee ID already registered', 409);

            const [result] = await pool.query(
                `INSERT INTO officers (full_name, email, mobile_number, employee_id, department, password)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [full_name, email, mobile_number, employee_id, department, hash]
            );

            const token = generateToken({ id: result.insertId, role: 'officer', email });
            return success(res, { token, role: 'officer', user: { id: result.insertId, full_name, email, employee_id, department } }, 'Officer registered successfully', 201);
        }

    } catch (err) {
        console.error('Register error:', err);
        return error(res, 'Registration failed', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/login
// Body: { email, password, role }
//
// For students: 'email' field accepts EITHER:
//   • Regd.No directly   (e.g.  22G21A0575)
//   • Full email address (e.g.  22g21a0575@campus.edu)
// Password for class-seeded students = their Regd.No
// ══════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    // 'email' field is used as the login identifier (can be Regd.No for students)
    const loginId = (email || '').trim();

    if (!loginId || !password || !role) {
        return error(res, 'Login ID, password and role are required', 400);
    }

    try {
        let rows;

        if (role === 'student') {
            // Students can log in with Regd.No OR full email
            [rows] = await pool.query(
                `SELECT * FROM students
                 WHERE email = ? OR roll_number = ?
                 LIMIT 1`,
                [loginId, loginId.toUpperCase()]
            );
        } else if (role === 'officer') {
            // Officers log in with email or employee_id
            [rows] = await pool.query(
                `SELECT * FROM officers
                 WHERE email = ? OR employee_id = ?
                 LIMIT 1`,
                [loginId, loginId.toUpperCase()]
            );
        } else {
            return error(res, 'role must be "student" or "officer"', 400);
        }

        if (!rows.length) {
            return error(res, 'Invalid login ID or password', 401);
        }

        const user = rows[0];
        const idField = role === 'student' ? 'student_id' : 'officer_id';

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return error(res, 'Invalid login ID or password', 401);
        }

        const token = generateToken({ id: user[idField], role, email: user.email });

        // Strip password before sending
        delete user.password;

        return success(res, { token, role, user }, 'Login successful');

    } catch (err) {
        console.error('Login error:', err);
        return error(res, 'Login failed', 500, err.message);
    }
});

module.exports = router;
