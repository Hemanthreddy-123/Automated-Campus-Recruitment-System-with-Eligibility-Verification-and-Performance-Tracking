// routes/drives.js  — Job Drive APIs
const router = require('express').Router();
const supabase = require('../config/db');
const { verifyToken, requireOfficer } = require('../middleware/auth');
const { success, error, checkEligibility } = require('../utils/helpers');

// ══════════════════════════════════════════════════════
// GET /api/drives
// Returns all active drives (with eligibility info if student)
// ══════════════════════════════════════════════════════
router.get('/', verifyToken, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const { data: drives, error: dErr } = await supabase
            .from('job_drives')
            .select('*, officers(full_name)')
            .eq('is_active', true)
            .gte('last_date', today)
            .order('created_at', { ascending: false });

        if (dErr) throw dErr;

        // Flatten officer name
        const flatDrives = (drives || []).map(d => ({
            ...d,
            officer_name: d.officers?.full_name || null,
            officers: undefined,
        }));

        // If logged-in student, attach eligibility + applied status
        if (req.user?.role === 'student') {
            const { data: studentRows } = await supabase
                .from('students')
                .select('*')
                .eq('student_id', req.user.id)
                .single();

            const { data: appliedRows } = await supabase
                .from('applications')
                .select('drive_id, application_status')
                .eq('student_id', req.user.id);

            const appliedMap = {};
            (appliedRows || []).forEach(r => (appliedMap[r.drive_id] = r.application_status));

            const enriched = flatDrives.map(drive => {
                const { eligible, reasons } = checkEligibility(studentRows, drive);
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

        return success(res, flatDrives);
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
        const { data: drive, error: dErr } = await supabase
            .from('job_drives')
            .select('*, officers(full_name)')
            .eq('drive_id', req.params.id)
            .single();

        if (dErr || !drive) return error(res, 'Drive not found', 404);

        return success(res, {
            ...drive,
            officer_name: drive.officers?.full_name || null,
            officers: undefined,
        });
    } catch (err) {
        return error(res, 'Failed to fetch drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/drives/create  (Officer only)
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
        const branchStr = Array.isArray(required_branch) ? required_branch.join(',') : required_branch;
        const yearStr   = Array.isArray(required_year)   ? required_year.join(',')   : required_year;

        const { data: inserted, error: insertErr } = await supabase
            .from('job_drives')
            .insert([{
                company_name, job_role,
                description: description || null,
                package_lpa: parseFloat(package_lpa),
                location,
                required_percentage: parseFloat(required_percentage),
                allowed_backlogs: parseInt(allowed_backlogs) || 0,
                required_branch: branchStr,
                required_year: yearStr,
                available_seats: available_seats ? parseInt(available_seats) : null,
                number_of_rounds: number_of_rounds ? parseInt(number_of_rounds) : null,
                drive_date, last_date,
                created_by: req.user.id,
            }])
            .select()
            .single();

        if (insertErr) throw insertErr;

        return success(res, {
            drive_id: inserted.drive_id, company_name, job_role,
        }, 'Drive created successfully', 201);
    } catch (err) {
        console.error('Create drive error:', err);
        return error(res, 'Failed to create drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// PUT /api/drives/:id  (Officer only)
// ══════════════════════════════════════════════════════
router.put('/:id', verifyToken, requireOfficer, async (req, res) => {
    try {
        const allowed = [
            'company_name', 'job_role', 'description', 'package_lpa', 'location',
            'required_percentage', 'allowed_backlogs', 'required_branch',
            'required_year', 'available_seats', 'number_of_rounds',
            'drive_date', 'last_date', 'is_active',
        ];

        const updates = {};
        allowed.forEach(key => {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        });

        if (!Object.keys(updates).length) return error(res, 'No fields to update', 400);

        const { error: updateErr } = await supabase
            .from('job_drives')
            .update(updates)
            .eq('drive_id', req.params.id)
            .eq('created_by', req.user.id);

        if (updateErr) throw updateErr;

        return success(res, {}, 'Drive updated successfully');
    } catch (err) {
        return error(res, 'Failed to update drive', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// DELETE /api/drives/:id  (Officer only — soft delete)
// ══════════════════════════════════════════════════════
router.delete('/:id', verifyToken, requireOfficer, async (req, res) => {
    try {
        const { error: updateErr } = await supabase
            .from('job_drives')
            .update({ is_active: false })
            .eq('drive_id', req.params.id)
            .eq('created_by', req.user.id);

        if (updateErr) throw updateErr;

        return success(res, {}, 'Drive deactivated successfully');
    } catch (err) {
        return error(res, 'Failed to deactivate drive', 500, err.message);
    }
});

module.exports = router;
