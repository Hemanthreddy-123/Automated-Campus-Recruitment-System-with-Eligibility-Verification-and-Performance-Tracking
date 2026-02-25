// routes/student.js  — Student profile APIs
const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, requireStudent } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// All routes here require a valid Student JWT
router.use(verifyToken, requireStudent);

// ══════════════════════════════════════════════════════
// GET /api/student/profile
// Returns the logged-in student's complete profile + performance
// ══════════════════════════════════════════════════════
router.get('/profile', async (req, res) => {
    try {
        // 1. Student record (no password)
        const [studentRows] = await pool.query(
            `SELECT student_id, full_name, roll_number, email,
                    mobile_number, branch, year, percentage,
                    backlogs, profile_complete, created_at
             FROM students
             WHERE student_id = ?`,
            [req.user.id]
        );
        if (!studentRows.length) return error(res, 'Student not found', 404);

        // 2. Performance record
        const [perfRows] = await pool.query(
            `SELECT total_quiz_score, quiz_attempts, avg_quiz_score,
                    total_coding_score, coding_submissions, overall_rank
             FROM performance WHERE student_id = ?`,
            [req.user.id]
        );

        // 3. Application counts
        const [appCounts] = await pool.query(
            `SELECT
               COUNT(*) AS total_applications,
               SUM(CASE WHEN application_status = 'Selected'   THEN 1 ELSE 0 END) AS selected,
               SUM(CASE WHEN application_status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted,
               SUM(CASE WHEN application_status = 'Pending'    THEN 1 ELSE 0 END) AS pending,
               SUM(CASE WHEN application_status = 'Rejected'   THEN 1 ELSE 0 END) AS rejected
             FROM applications WHERE student_id = ?`,
            [req.user.id]
        );

        return success(res, {
            student: studentRows[0],
            performance: perfRows[0] || { total_quiz_score: 0, quiz_attempts: 0, avg_quiz_score: 0, total_coding_score: 0, coding_submissions: 0, overall_rank: null },
            app_summary: appCounts[0],
        });

    } catch (err) {
        console.error('Profile fetch error:', err);
        return error(res, 'Failed to fetch profile', 500, err.message);
    }
});


// ══════════════════════════════════════════════════════
// PUT /api/student/update
// Body: { full_name, mobile_number, branch, year, percentage, backlogs }
// ══════════════════════════════════════════════════════
router.put('/update', async (req, res) => {
    const { full_name, mobile_number, branch, year, percentage, backlogs } = req.body;

    try {
        const fields = [];
        const values = [];

        if (full_name) { fields.push('full_name = ?'); values.push(full_name); }
        if (mobile_number) { fields.push('mobile_number = ?'); values.push(mobile_number); }
        if (branch) { fields.push('branch = ?'); values.push(branch); }
        if (year !== undefined) { fields.push('year = ?'); values.push(parseInt(year)); }
        if (percentage !== undefined) { fields.push('percentage = ?'); values.push(parseFloat(percentage)); }
        if (backlogs !== undefined) { fields.push('backlogs = ?'); values.push(parseInt(backlogs)); }

        if (!fields.length) return error(res, 'No fields to update', 400);

        fields.push('profile_complete = TRUE');
        values.push(req.user.id);

        await pool.query(
            `UPDATE students SET ${fields.join(', ')} WHERE student_id = ?`, values
        );

        const [updated] = await pool.query(
            'SELECT student_id, full_name, roll_number, email, mobile_number, branch, year, percentage, backlogs FROM students WHERE student_id = ?',
            [req.user.id]
        );

        return success(res, updated[0], 'Profile updated successfully');
    } catch (err) {
        console.error('Profile update error:', err);
        return error(res, 'Failed to update profile', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/student/applications
// Returns all drives this student has applied for
// ══════════════════════════════════════════════════════
router.get('/applications', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.application_id, a.application_status, a.applied_date,
              d.drive_id, d.company_name, d.job_role, d.package_lpa,
              d.location, d.drive_date, d.last_date
       FROM applications a
       JOIN job_drives d ON d.drive_id = a.drive_id
       WHERE a.student_id = ?
       ORDER BY a.applied_date DESC`,
            [req.user.id]
        );
        return success(res, rows);
    } catch (err) {
        console.error('Applications fetch error:', err);
        return error(res, 'Failed to fetch applications', 500, err.message);
    }
});

module.exports = router;
