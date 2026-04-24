// routes/applications.js  — Apply for drives + Officer management
const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, requireStudent, requireOfficer } = require('../middleware/auth');
const { success, error, checkEligibility } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// POST /api/apply   (Student)
// Body: { drive_id }
// Auto-applies eligibility check before inserting
// ══════════════════════════════════════════════════════
router.post('/apply', verifyToken, requireStudent, async (req, res) => {
    const { drive_id } = req.body;
    if (!drive_id) return error(res, 'drive_id is required', 400);

    try {
        // 1. Get student & drive
        const [[student]] = await pool.query('SELECT * FROM students WHERE student_id = ?', [req.user.id]);
        const [[drive]] = await pool.query('SELECT * FROM job_drives WHERE drive_id = ? AND is_active = TRUE AND last_date >= CURDATE()', [drive_id]);

        if (!drive) return error(res, 'Drive not found or deadline passed', 404);
        if (!student) return error(res, 'Student not found', 404);

        // 2. Duplicate application check
        const [existing] = await pool.query(
            'SELECT application_id FROM applications WHERE student_id = ? AND drive_id = ?',
            [req.user.id, drive_id]
        );
        if (existing.length) return error(res, 'You have already applied for this drive', 409);

        // 3. Eligibility check
        const { eligible, reasons } = checkEligibility(student, drive);
        if (!eligible) {
            return error(res, 'You are not eligible for this drive', 403, reasons);
        }

        // 4. Insert application
        const [result] = await pool.query(
            `INSERT INTO applications (student_id, drive_id, eligibility_verified)
       VALUES (?, ?, TRUE)`,
            [req.user.id, drive_id]
        );

        return success(res, { application_id: result.insertId, drive_id, status: 'Pending' }, 'Application submitted successfully', 201);

    } catch (err) {
        console.error('Apply error:', err);
        return error(res, 'Failed to apply for drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/applications   (Officer)
// Query params: drive_id, status, search
// ══════════════════════════════════════════════════════
router.get('/applications', verifyToken, requireOfficer, async (req, res) => {
    try {
        const { drive_id, status, search } = req.query;

        let query = `
      SELECT a.application_id, a.application_status, a.applied_date, a.eligibility_verified,
             s.student_id, s.full_name, s.roll_number, s.email, s.branch, s.year, s.percentage, s.backlogs,
             d.drive_id, d.company_name, d.job_role, d.required_percentage, d.allowed_backlogs
      FROM applications a
      JOIN students s ON s.student_id = a.student_id
      JOIN job_drives d ON d.drive_id = a.drive_id
      WHERE d.created_by = ?
    `;
        const values = [req.user.id];

        if (drive_id) { query += ' AND a.drive_id = ?'; values.push(drive_id); }
        if (status) { query += ' AND a.application_status = ?'; values.push(status); }
        if (search) { query += ' AND (s.full_name LIKE ? OR s.roll_number LIKE ?)'; values.push(`%${search}%`, `%${search}%`); }

        query += ' ORDER BY a.applied_date DESC';

        const [rows] = await pool.query(query, values);
        return success(res, rows);
    } catch (err) {
        console.error('Applications fetch error:', err);
        return error(res, 'Failed to fetch applications', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// PUT /api/applications/:id/status   (Officer)
// Body: { status: 'Shortlisted' | 'Selected' | 'Rejected' }
// ══════════════════════════════════════════════════════
router.put('/applications/:id/status', verifyToken, requireOfficer, async (req, res) => {
    const { status, officer_notes } = req.body;
    const validStatuses = ['Pending', 'Shortlisted', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
        return error(res, `status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    try {
        const [result] = await pool.query(
            `UPDATE applications a
       JOIN job_drives d ON d.drive_id = a.drive_id
       SET a.application_status = ?, a.officer_notes = ?
       WHERE a.application_id = ? AND d.created_by = ?`,
            [status, officer_notes || null, req.params.id, req.user.id]
        );

        if (!result.affectedRows) return error(res, 'Application not found or not authorized', 404);

        return success(res, { application_id: parseInt(req.params.id), status }, 'Status updated successfully');
    } catch (err) {
        console.error('Status update error:', err);
        return error(res, 'Failed to update status', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/applications/all-students   (Officer)
// ══════════════════════════════════════════════════════
router.get('/applications/all-students', verifyToken, requireOfficer, async (req, res) => {
    try {
        const { branch, search, placed } = req.query;
        let query = `
      SELECT s.student_id, s.full_name, s.roll_number, s.email, s.mobile_number,
             s.branch, s.year, s.percentage, s.backlogs,
             p.overall_rank, p.avg_quiz_score, p.total_coding_score,
             MAX(CASE WHEN a.application_status = 'Selected' THEN 1 ELSE 0 END) AS is_placed
      FROM students s
      LEFT JOIN performance p ON p.student_id = s.student_id
      LEFT JOIN applications a ON a.student_id = s.student_id
    `;
        const conditions = [];
        const values = [];

        if (branch) { conditions.push('s.branch = ?'); values.push(branch); }
        if (search) { conditions.push('(s.full_name LIKE ? OR s.roll_number LIKE ?)'); values.push(`%${search}%`, `%${search}%`); }

        if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
        query += ' GROUP BY s.student_id';
        if (placed === 'true') query += ' HAVING is_placed = 1';
        if (placed === 'false') query += ' HAVING is_placed = 0';
        query += ' ORDER BY s.roll_number';

        const [rows] = await pool.query(query, values);
        return success(res, rows);
    } catch (err) {
        console.error('All students fetch error:', err);
        return error(res, 'Failed to fetch students', 500, err.message);
    }
});

module.exports = router;
