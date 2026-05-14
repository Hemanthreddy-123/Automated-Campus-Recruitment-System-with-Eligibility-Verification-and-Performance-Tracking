// routes/reports.js  — Analytics & Performance APIs
const router = require('express').Router();
const supabase = require('../config/db');
const { verifyToken, requireOfficer } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// GET /api/reports/analytics   (Officer)
// Overall placement analytics
// ══════════════════════════════════════════════════════
router.get('/analytics', verifyToken, requireOfficer, async (req, res) => {
    try {
        // Parallel fetches
        const [
            { count: total_students },
            { count: active_drives },
            { count: total_applications },
            { data: appStatuses },
            { data: students },
            { data: drives },
        ] = await Promise.all([
            supabase.from('students').select('*', { count: 'exact', head: true }),
            supabase.from('job_drives').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('applications').select('*', { count: 'exact', head: true }),
            supabase.from('applications').select('application_status, student_id'),
            supabase.from('students').select('student_id, branch, percentage, performance(total_coding_score, avg_quiz_score, overall_rank)'),
            supabase.from('job_drives').select('drive_id, company_name, job_role, package_lpa, drive_date, applications(application_status)').order('created_at', { ascending: false }),
        ]);

        const students_placed     = new Set((appStatuses || []).filter(a => a.application_status === 'Selected').map(a => a.student_id)).size;
        const students_shortlisted = (appStatuses || []).filter(a => a.application_status === 'Shortlisted').length;
        const pending_applications = (appStatuses || []).filter(a => a.application_status === 'Pending').length;

        // Branch stats
        const branchMap = {};
        (students || []).forEach(s => {
            if (!branchMap[s.branch]) branchMap[s.branch] = { total: 0, placed: 0 };
            branchMap[s.branch].total++;
        });
        (appStatuses || []).filter(a => a.application_status === 'Selected').forEach(a => {
            const st = (students || []).find(s => s.student_id === a.student_id);
            if (st && branchMap[st.branch]) branchMap[st.branch].placed++;
        });

        const branch_stats = Object.entries(branchMap).map(([branch, v]) => ({
            branch,
            total_students:       v.total,
            placed:               v.placed,
            placement_percentage: v.total ? +((v.placed / v.total) * 100).toFixed(1) : 0,
        })).sort((a, b) => b.placement_percentage - a.placement_percentage);

        // Drive stats
        const drive_stats = (drives || []).map(d => {
            const apps = d.applications || [];
            return {
                drive_id:           d.drive_id,
                company_name:       d.company_name,
                job_role:           d.job_role,
                package_lpa:        d.package_lpa,
                drive_date:         d.drive_date,
                total_applications: apps.length,
                shortlisted:        apps.filter(a => a.application_status === 'Shortlisted').length,
                selected:           apps.filter(a => a.application_status === 'Selected').length,
                rejected:           apps.filter(a => a.application_status === 'Rejected').length,
            };
        });

        // Top students by percentage
        const top_students = (students || [])
            .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
            .slice(0, 10)
            .map(s => ({
                student_id:         s.student_id,
                branch:             s.branch,
                percentage:         s.percentage,
                total_coding_score: s.performance?.[0]?.total_coding_score || 0,
                avg_quiz_score:     s.performance?.[0]?.avg_quiz_score     || 0,
                overall_rank:       s.performance?.[0]?.overall_rank       || null,
            }));

        return success(res, {
            summary: {
                total_students,
                active_drives,
                total_applications,
                students_placed,
                students_shortlisted,
                pending_applications,
            },
            branch_stats,
            drive_stats,
            top_students,
        });

    } catch (err) {
        console.error('Analytics error:', err);
        return error(res, 'Failed to fetch analytics', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/reports/performance   (Officer)
// All students performance overview
// ══════════════════════════════════════════════════════
router.get('/performance', verifyToken, requireOfficer, async (req, res) => {
    try {
        const { data: rows, error: qErr } = await supabase
            .from('students')
            .select(`
                student_id, full_name, roll_number, branch, year,
                percentage, backlogs,
                performance (
                    total_quiz_score, quiz_attempts, avg_quiz_score,
                    total_coding_score, coding_submissions, overall_rank
                ),
                applications (application_status)
            `);

        if (qErr) throw qErr;

        const scored = (rows || []).map(s => {
            const perf = s.performance?.[0] || {};
            const apps = s.applications || [];
            return {
                student_id:         s.student_id,
                full_name:          s.full_name,
                roll_number:        s.roll_number,
                branch:             s.branch,
                year:               s.year,
                percentage:         s.percentage,
                backlogs:           s.backlogs,
                total_quiz_score:   perf.total_quiz_score   || 0,
                quiz_attempts:      perf.quiz_attempts      || 0,
                avg_quiz_score:     perf.avg_quiz_score     || 0,
                total_coding_score: perf.total_coding_score || 0,
                coding_submissions: perf.coding_submissions || 0,
                overall_rank:       perf.overall_rank       || null,
                total_applications: apps.length,
                offers_received:    apps.filter(a => a.application_status === 'Selected').length,
                computed_score:
                    (perf.total_quiz_score   || 0) +
                    (perf.total_coding_score || 0) +
                    (parseFloat(s.percentage) * 10 || 0),
            };
        }).sort((a, b) => b.computed_score - a.computed_score);

        scored.forEach((r, i) => (r.computed_rank = i + 1));

        return success(res, scored);
    } catch (err) {
        console.error('Performance report error:', err);
        return error(res, 'Failed to fetch performance report', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/reports/my-performance   (Student)
// Personal performance report
// ══════════════════════════════════════════════════════
router.get('/my-performance', verifyToken, async (req, res) => {
    try {
        const { data: student, error: sErr } = await supabase
            .from('students')
            .select('*, performance(*)')
            .eq('student_id', req.user.id)
            .single();

        if (sErr || !student) return error(res, 'Student not found', 404);

        const [
            { data: quizHistory },
            { data: codingHistory },
            { data: applicationHistory },
        ] = await Promise.all([
            supabase.from('quiz_results').select('*').eq('student_id', req.user.id).order('attempt_date', { ascending: false }).limit(10),
            supabase.from('coding_results').select('*').eq('student_id', req.user.id).order('submission_time', { ascending: false }).limit(10),
            supabase.from('applications').select('*, job_drives(company_name, job_role, package_lpa)').eq('student_id', req.user.id).order('applied_date', { ascending: false }),
        ]);

        delete student.password;

        return success(res, {
            student,
            quiz_history:        quizHistory        || [],
            coding_history:      codingHistory      || [],
            application_history: (applicationHistory || []).map(a => ({
                ...a,
                ...a.job_drives,
                job_drives: undefined,
            })),
        });
    } catch (err) {
        console.error('My performance error:', err);
        return error(res, 'Failed to fetch performance', 500, err.message);
    }
});

module.exports = router;
