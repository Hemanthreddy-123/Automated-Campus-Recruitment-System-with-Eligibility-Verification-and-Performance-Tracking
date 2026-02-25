// routes/reports.js  — Analytics & Performance APIs (Officer)
const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, requireOfficer, requireAnyRole } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// GET /api/reports/analytics
// Overall placement analytics (Officer)
// ══════════════════════════════════════════════════════
router.get('/analytics', verifyToken, requireOfficer, async (req, res) => {
    try {
        const [summary] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students) AS total_students,
        (SELECT COUNT(*) FROM job_drives WHERE is_active = TRUE) AS active_drives,
        (SELECT COUNT(*) FROM applications) AS total_applications,
        (SELECT COUNT(DISTINCT student_id) FROM applications WHERE application_status = 'Selected') AS students_placed,
        (SELECT COUNT(*) FROM applications WHERE application_status = 'Shortlisted') AS students_shortlisted,
        (SELECT COUNT(*) FROM applications WHERE application_status = 'Pending') AS pending_applications
    `);

        const [branchStats] = await pool.query(`
      SELECT
        s.branch,
        COUNT(DISTINCT s.student_id) AS total_students,
        COUNT(DISTINCT CASE WHEN a.application_status = 'Selected' THEN s.student_id END) AS placed,
        ROUND(
          COUNT(DISTINCT CASE WHEN a.application_status = 'Selected' THEN s.student_id END)
          / COUNT(DISTINCT s.student_id) * 100, 1
        ) AS placement_percentage
      FROM students s
      LEFT JOIN applications a ON a.student_id = s.student_id
      GROUP BY s.branch
      ORDER BY placement_percentage DESC
    `);

        const [driveStats] = await pool.query(`
      SELECT
        d.drive_id, d.company_name, d.job_role, d.package_lpa, d.drive_date,
        COUNT(a.application_id) AS total_applications,
        SUM(CASE WHEN a.application_status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted,
        SUM(CASE WHEN a.application_status = 'Selected'    THEN 1 ELSE 0 END) AS selected,
        SUM(CASE WHEN a.application_status = 'Rejected'    THEN 1 ELSE 0 END) AS rejected
      FROM job_drives d
      LEFT JOIN applications a ON a.drive_id = d.drive_id
      GROUP BY d.drive_id
      ORDER BY d.created_at DESC
    `);

        const [topStudents] = await pool.query(`
      SELECT s.full_name, s.roll_number, s.branch, s.percentage,
             p.total_coding_score, p.avg_quiz_score, p.overall_rank
      FROM students s
      LEFT JOIN performance p ON p.student_id = s.student_id
      ORDER BY s.percentage DESC
      LIMIT 10
    `);

        return success(res, {
            summary: summary[0],
            branch_stats: branchStats,
            drive_stats: driveStats,
            top_students: topStudents,
        });

    } catch (err) {
        console.error('Analytics error:', err);
        return error(res, 'Failed to fetch analytics', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/reports/performance
// All students performance overview (Officer)
// ══════════════════════════════════════════════════════
router.get('/performance', verifyToken, requireOfficer, async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT
        s.student_id, s.full_name, s.roll_number, s.branch, s.year,
        s.percentage, s.backlogs,
        p.total_quiz_score, p.quiz_attempts, p.avg_quiz_score,
        p.total_coding_score, p.coding_submissions, p.overall_rank,
        (SELECT COUNT(*) FROM applications a WHERE a.student_id = s.student_id) AS total_applications,
        (SELECT COUNT(*) FROM applications a WHERE a.student_id = s.student_id AND a.application_status = 'Selected') AS offers_received
      FROM students s
      LEFT JOIN performance p ON p.student_id = s.student_id
      ORDER BY p.overall_rank ASC, s.percentage DESC
    `);

        // Re-calculate ranks by overall score
        const scored = rows.map(r => ({
            ...r,
            computed_score: (r.total_quiz_score || 0) + (r.total_coding_score || 0) + (parseFloat(r.percentage) * 10 || 0),
        })).sort((a, b) => b.computed_score - a.computed_score);

        scored.forEach((r, i) => (r.computed_rank = i + 1));

        return success(res, scored);
    } catch (err) {
        console.error('Performance report error:', err);
        return error(res, 'Failed to fetch performance report', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/reports/my-performance   (Student)
// Personal performance report for logged-in student
// ══════════════════════════════════════════════════════
router.get('/my-performance', verifyToken, async (req, res) => {
    try {
        const [studentRows] = await pool.query(
            `SELECT s.*, p.* FROM students s
       LEFT JOIN performance p ON p.student_id = s.student_id
       WHERE s.student_id = ?`,
            [req.user.id]
        );
        if (!studentRows.length) return error(res, 'Student not found', 404);

        const [quizHistory] = await pool.query(
            'SELECT * FROM quiz_results WHERE student_id = ? ORDER BY attempt_date DESC LIMIT 10',
            [req.user.id]
        );

        const [codingHistory] = await pool.query(
            'SELECT * FROM coding_results WHERE student_id = ? ORDER BY submission_time DESC LIMIT 10',
            [req.user.id]
        );

        const [applicationHistory] = await pool.query(
            `SELECT a.*, d.company_name, d.job_role, d.package_lpa
       FROM applications a
       JOIN job_drives d ON d.drive_id = a.drive_id
       WHERE a.student_id = ?
       ORDER BY a.applied_date DESC`,
            [req.user.id]
        );

        const student = { ...studentRows[0] };
        delete student.password;

        return success(res, { student, quiz_history: quizHistory, coding_history: codingHistory, application_history: applicationHistory });
    } catch (err) {
        console.error('My performance error:', err);
        return error(res, 'Failed to fetch performance', 500, err.message);
    }
});

module.exports = router;
