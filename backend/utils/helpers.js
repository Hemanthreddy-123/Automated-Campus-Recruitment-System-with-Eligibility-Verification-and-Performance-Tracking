// ── Standardised API response helpers ──────────────────────────
const success = (res, data = {}, message = 'Success', status = 200) => {
    return res.status(status).json({ success: true, message, data });
};

const error = (res, message = 'Something went wrong', status = 500, details = null) => {
    const body = { success: false, message };
    if (details) body.details = details;
    return res.status(status).json(body);
};

// ── Eligibility check ───────────────────────────────────────
/**
 * Check if a student is eligible for a job drive.
 * @param {Object} student  - Row from students table
 * @param {Object} drive    - Row from job_drives table
 * @returns {{ eligible: boolean, reasons: string[] }}
 */
const checkEligibility = (student, drive) => {
    const reasons = [];

    // 1. Percentage / CGPA check
    if (parseFloat(student.percentage) < parseFloat(drive.required_percentage)) {
        reasons.push(`CGPA/% ${student.percentage} < required ${drive.required_percentage}`);
    }

    // 2. Backlogs check
    if (parseInt(student.backlogs) > parseInt(drive.allowed_backlogs)) {
        reasons.push(`Backlogs ${student.backlogs} > allowed ${drive.allowed_backlogs}`);
    }

    // 3. Branch check  (comma-separated stored value)
    const allowedBranches = drive.required_branch.split(',').map(b => b.trim().toLowerCase());
    if (!allowedBranches.includes(student.branch.toLowerCase())) {
        reasons.push(`Branch "${student.branch}" not in eligible list`);
    }

    // 4. Year check
    const allowedYears = drive.required_year.split(',').map(y => parseInt(y.trim()));
    if (!allowedYears.includes(parseInt(student.year))) {
        reasons.push(`Year ${student.year} not in eligible years [${drive.required_year}]`);
    }

    return { eligible: reasons.length === 0, reasons };
};

module.exports = { success, error, checkEligibility };
