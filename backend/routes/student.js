// routes/student.js  — Student profile APIs
const router = require('express').Router();
const supabase = require('../config/db');
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
        // 1. Student record
        const { data: student, error: sErr } = await supabase
            .from('students')
            .select('student_id, full_name, roll_number, email, mobile_number, branch, year, percentage, backlogs, profile_complete, created_at')
            .eq('student_id', req.user.id)
            .single();

        if (sErr || !student) return error(res, 'Student not found', 404);

        // 2. Performance record
        const { data: perf } = await supabase
            .from('performance')
            .select('total_quiz_score, quiz_attempts, avg_quiz_score, total_coding_score, coding_submissions, overall_rank')
            .eq('student_id', req.user.id)
            .single();

        // 3. Application counts
        const { data: apps } = await supabase
            .from('applications')
            .select('application_status')
            .eq('student_id', req.user.id);

        const app_summary = {
            total_applications: apps ? apps.length : 0,
            selected:    apps ? apps.filter(a => a.application_status === 'Selected').length   : 0,
            shortlisted: apps ? apps.filter(a => a.application_status === 'Shortlisted').length : 0,
            pending:     apps ? apps.filter(a => a.application_status === 'Pending').length    : 0,
            rejected:    apps ? apps.filter(a => a.application_status === 'Rejected').length   : 0,
        };

        return success(res, {
            student,
            performance: perf || {
                total_quiz_score: 0, quiz_attempts: 0, avg_quiz_score: 0,
                total_coding_score: 0, coding_submissions: 0, overall_rank: null,
            },
            app_summary,
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
        const updates = { profile_complete: true };

        if (full_name)              updates.full_name     = full_name;
        if (mobile_number)          updates.mobile_number = mobile_number;
        if (branch)                 updates.branch        = branch;
        if (year !== undefined)     updates.year          = parseInt(year);
        if (percentage !== undefined) updates.percentage  = parseFloat(percentage);
        if (backlogs !== undefined) updates.backlogs      = parseInt(backlogs);

        if (Object.keys(updates).length === 1) {
            return error(res, 'No fields to update', 400);
        }

        const { data: updated, error: updateErr } = await supabase
            .from('students')
            .update(updates)
            .eq('student_id', req.user.id)
            .select('student_id, full_name, roll_number, email, mobile_number, branch, year, percentage, backlogs')
            .single();

        if (updateErr) throw updateErr;

        return success(res, updated, 'Profile updated successfully');
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
        const { data: rows, error: qErr } = await supabase
            .from('applications')
            .select(`
                application_id, application_status, applied_date,
                job_drives (
                    drive_id, company_name, job_role, package_lpa,
                    location, drive_date, last_date
                )
            `)
            .eq('student_id', req.user.id)
            .order('applied_date', { ascending: false });

        if (qErr) throw qErr;

        // Flatten nested join
        const flat = (rows || []).map(r => ({
            application_id:     r.application_id,
            application_status: r.application_status,
            applied_date:       r.applied_date,
            ...r.job_drives,
        }));

        return success(res, flat);
    } catch (err) {
        console.error('Applications fetch error:', err);
        return error(res, 'Failed to fetch applications', 500, err.message);
    }
});

module.exports = router;
