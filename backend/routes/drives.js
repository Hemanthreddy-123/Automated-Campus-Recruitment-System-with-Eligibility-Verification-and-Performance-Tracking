// routes/drives.js  — Job Drive APIs
const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, requireOfficer, requireStudent } = require('../middleware/auth');
const { success, error, checkEligibility } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// GET /api/drives
// Public — returns all active drives
// If student token is present, adds eligibility info
// ══════════════════════════════════════════════════════
router.get('/', verifyToken, async (req, res) => {
    try {
        const [drives] = await pool.query(
            `SELECT d.*, o.full_name AS officer_name
       FROM job_drives d
       JOIN officers o ON o.officer_id = d.created_by
       WHERE d.is_active = TRUE AND d.last_date >= CURDATE()
       ORDER BY d.created_at DESC`
        );

        // If logged-in student, attach eligibility + applied status
        if (req.user?.role === 'student') {
            const [studentRows] = await pool.query(
                'SELECT * FROM students WHERE student_id = ?', [req.user.id]
            );
            const student = studentRows[0];

            const [appliedRows] = await pool.query(
                'SELECT drive_id, application_status FROM applications WHERE student_id = ?', [req.user.id]
            );
            const appliedMap = {};
            appliedRows.forEach(r => (appliedMap[r.drive_id] = r.application_status));

            const enriched = drives.map(drive => {
                const { eligible, reasons } = checkEligibility(student, drive);
                return {
                    ...drive,
                    is_eligible: eligible,
                    ineligibility_reason: reasons.length > 0 ? reasons[0] : null,
                    applied: !!appliedMap[drive.drive_id],
                    application_status: appliedMap[drive.drive_id] || null,
                };
            });

            return success(res, enriched);
        }

        return success(res, drives);
    } catch (err) {
        console.error('Drives fetch error:', err);
        return error(res, 'Failed to fetch drives', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/drives/:id
// Get single drive detail
// ══════════════════════════════════════════════════════
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT d.*, o.full_name AS officer_name
       FROM job_drives d
       JOIN officers o ON o.officer_id = d.created_by
       WHERE d.drive_id = ?`,
            [req.params.id]
        );
        if (!rows.length) return error(res, 'Drive not found', 404);
        return success(res, rows[0]);
    } catch (err) {
        return error(res, 'Failed to fetch drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/drives/create  (Officer only)
// Body: { company_name, job_role, description, package_lpa, location,
//         required_percentage, allowed_backlogs, required_branch,
//         required_year, available_seats, number_of_rounds,
//         drive_date, last_date }
// ══════════════════════════════════════════════════════
router.post('/create', verifyToken, requireOfficer, async (req, res) => {
    const {
        company_name, job_role, description, package_lpa,
        location, required_percentage, allowed_backlogs,
        required_branch, required_year, available_seats,
        number_of_rounds, drive_date, last_date,
    } = req.body;

    if (!company_name || !job_role || !package_lpa || !location ||
        !required_percentage || !required_branch || !required_year ||
        !drive_date || !last_date) {
        return error(res, 'Missing required fields', 400);
    }

    try {
        // required_branch can be an array or comma string
        const branchStr = Array.isArray(required_branch)
            ? required_branch.join(',')
            : required_branch;

        const yearStr = Array.isArray(required_year)
            ? required_year.join(',')
            : required_year;

        const [result] = await pool.query(
            `INSERT INTO job_drives
         (company_name, job_role, description, package_lpa, location,
          required_percentage, allowed_backlogs, required_branch,
          required_year, available_seats, number_of_rounds,
          drive_date, last_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                company_name, job_role, description || null, parseFloat(package_lpa),
                location, parseFloat(required_percentage), parseInt(allowed_backlogs) || 0,
                branchStr, yearStr,
                available_seats ? parseInt(available_seats) : null,
                number_of_rounds ? parseInt(number_of_rounds) : null,
                drive_date, last_date, req.user.id,
            ]
        );

        return success(res, { drive_id: result.insertId, company_name, job_role }, 'Drive created successfully', 201);
    } catch (err) {
        console.error('Create drive error:', err);
        return error(res, 'Failed to create drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// PUT /api/drives/:id  (Officer only — update drive)
// ══════════════════════════════════════════════════════
router.put('/:id', verifyToken, requireOfficer, async (req, res) => {
    try {
        const allowed = ['company_name', 'job_role', 'description', 'package_lpa', 'location',
            'required_percentage', 'allowed_backlogs', 'required_branch',
            'required_year', 'available_seats', 'number_of_rounds', 'drive_date',
            'last_date', 'is_active'];
        const fields = [];
        const values = [];

        allowed.forEach(key => {
            if (req.body[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(req.body[key]);
            }
        });

        if (!fields.length) return error(res, 'No fields to update', 400);
        values.push(req.params.id, req.user.id);

        await pool.query(
            `UPDATE job_drives SET ${fields.join(', ')} WHERE drive_id = ? AND created_by = ?`,
            values
        );
        return success(res, {}, 'Drive updated successfully');
    } catch (err) {
        return error(res, 'Failed to update drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// DELETE /api/drives/:id  (Officer only)
// ══════════════════════════════════════════════════════
router.delete('/:id', verifyToken, requireOfficer, async (req, res) => {
    try {
        await pool.query(
            'UPDATE job_drives SET is_active = FALSE WHERE drive_id = ? AND created_by = ?',
            [req.params.id, req.user.id]
        );
        return success(res, {}, 'Drive deactivated successfully');
    } catch (err) {
        return error(res, 'Failed to deactivate drive', 500, err.message);
    }
});

module.exports = router;
