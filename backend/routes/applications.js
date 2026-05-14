// routes/applications.js  — Apply for drives + Officer management
const router = require('express').Router();
const supabase = require('../config/db');
const { verifyToken, requireStudent, requireOfficer } = require('../middleware/auth');
const { success, error, checkEligibility } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// POST /api/apply   (Student)
// Body: { drive_id }
// ══════════════════════════════════════════════════════
router.post('/apply', verifyToken, requireStudent, async (req, res) => {
    const { drive_id } = req.body;
    if (!drive_id) return error(res, 'drive_id is required', 400);

    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get student
        const { data: student, error: sErr } = await supabase
            .from('students')
            .select('*')
            .eq('student_id', req.user.id)
            .single();
        if (sErr || !student) return error(res, 'Student not found', 404);

        // 2. Get drive
        const { data: drive, error: dErr } = await supabase
            .from('job_drives')
            .select('*')
            .eq('drive_id', drive_id)
            .eq('is_active', true)
            .gte('last_date', today)
            .single();
        if (dErr || !drive) return error(res, 'Drive not found or deadline passed', 404);

        // 3. Duplicate check
        const { data: existing } = await supabase
            .from('applications')
            .select('application_id')
            .eq('student_id', req.user.id)
            .eq('drive_id', drive_id)
            .limit(1);
        if (existing && existing.length) {
            return error(res, 'You have already applied for this drive', 409);
        }

        // 4. Eligibility check
        const { eligible, reasons } = checkEligibility(student, drive);
        if (!eligible) {
            return error(res, 'You are not eligible for this drive', 403, reasons);
        }

        // 5. Insert application
        const { data: inserted, error: insertErr } = await supabase
            .from('applications')
            .insert([{
                student_id: req.user.id,
                drive_id,
                eligibility_verified: true,
            }])
            .select()
            .single();

        if (insertErr) throw insertErr;

        return success(res, {
            application_id: inserted.application_id,
            drive_id,
            status: 'Pending',
        }, 'Application submitted successfully', 201);

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

        // Get all drives owned by this officer
        const { data: officerDrives } = await supabase
            .from('job_drives')
            .select('drive_id')
            .eq('created_by', req.user.id);

        const driveIds = (officerDrives || []).map(d => d.drive_id);
        if (!driveIds.length) return success(res, []);

        let query = supabase
            .from('applications')
            .select(`
                application_id, application_status, applied_date, eligibility_verified,
                students (
                    student_id, full_name, roll_number, email,
                    branch, year, percentage, backlogs
                ),
                job_drives (
                    drive_id, company_name, job_role,
                    required_percentage, allowed_backlogs
                )
            `)
            .in('drive_id', driveIds)
            .order('applied_date', { ascending: false });

        if (drive_id) query = query.eq('drive_id', drive_id);
        if (status)   query = query.eq('application_status', status);

        const { data: rows, error: qErr } = await query;
        if (qErr) throw qErr;

        // Flatten + optional search filter
        let flat = (rows || []).map(r => ({
            application_id:     r.application_id,
            application_status: r.application_status,
            applied_date:       r.applied_date,
            eligibility_verified: r.eligibility_verified,
            ...r.students,
            ...r.job_drives,
        }));

        if (search) {
            const s = search.toLowerCase();
            flat = flat.filter(r =>
                (r.full_name   || '').toLowerCase().includes(s) ||
                (r.roll_number || '').toLowerCase().includes(s)
            );
        }

        return success(res, flat);
    } catch (err) {
        console.error('Applications fetch error:', err);
        return error(res, 'Failed to fetch applications', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// PUT /api/applications/:id/status   (Officer)
// Body: { status, officer_notes }
// ══════════════════════════════════════════════════════
router.put('/applications/:id/status', verifyToken, requireOfficer, async (req, res) => {
    const { status, officer_notes } = req.body;
    const validStatuses = ['Pending', 'Shortlisted', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
        return error(res, `status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    try {
        // Verify the application belongs to a drive owned by this officer
        const { data: app } = await supabase
            .from('applications')
            .select('application_id, job_drives(created_by)')
            .eq('application_id', req.params.id)
            .single();

        if (!app || app.job_drives?.created_by !== req.user.id) {
            return error(res, 'Application not found or not authorized', 404);
        }

        const { error: updateErr } = await supabase
            .from('applications')
            .update({ application_status: status, officer_notes: officer_notes || null })
            .eq('application_id', req.params.id);

        if (updateErr) throw updateErr;

        return success(res, {
            application_id: parseInt(req.params.id), status,
        }, 'Status updated successfully');
    } catch (err) {
        console.error('Status update error:', err);
        return error(res, 'Failed to update status', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/applications/all-students   (Officer)
// Query params: branch, search, placed
// ══════════════════════════════════════════════════════
router.get('/applications/all-students', verifyToken, requireOfficer, async (req, res) => {
    try {
        const { branch, search, placed } = req.query;

        let query = supabase
            .from('students')
            .select(`
                student_id, full_name, roll_number, email, mobile_number,
                branch, year, percentage, backlogs,
                performance (overall_rank, avg_quiz_score, total_coding_score),
                applications (application_status)
            `)
            .order('roll_number');

        if (branch) query = query.eq('branch', branch);

        const { data: rows, error: qErr } = await query;
        if (qErr) throw qErr;

        let result = (rows || []).map(s => {
            const isPlaced = (s.applications || []).some(a => a.application_status === 'Selected') ? 1 : 0;
            return {
                student_id:         s.student_id,
                full_name:          s.full_name,
                roll_number:        s.roll_number,
                email:              s.email,
                mobile_number:      s.mobile_number,
                branch:             s.branch,
                year:               s.year,
                percentage:         s.percentage,
                backlogs:           s.backlogs,
                overall_rank:       s.performance?.[0]?.overall_rank    || null,
                avg_quiz_score:     s.performance?.[0]?.avg_quiz_score  || 0,
                total_coding_score: s.performance?.[0]?.total_coding_score || 0,
                is_placed:          isPlaced,
            };
        });

        if (search) {
            const s = search.toLowerCase();
            result = result.filter(r =>
                (r.full_name   || '').toLowerCase().includes(s) ||
                (r.roll_number || '').toLowerCase().includes(s)
            );
        }

        if (placed === 'true')  result = result.filter(r => r.is_placed === 1);
        if (placed === 'false') result = result.filter(r => r.is_placed === 0);

        return success(res, result);
    } catch (err) {
        console.error('All students fetch error:', err);
        return error(res, 'Failed to fetch students', 500, err.message);
    }
});

module.exports = router;
