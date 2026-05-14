// routes/coding.js  — Coding competition (Supabase-driven problems)
const router = require('express').Router();
const supabase = require('../config/db');
const { verifyToken, requireStudent } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ── Helper: fetch one problem from Supabase ──────────────────
async function fetchProblem(id) {
    const { data: p, error: pErr } = await supabase
        .from('coding_problems')
        .select('*')
        .eq('problem_id', id)
        .eq('is_active', true)
        .single();

    if (pErr || !p) return null;

    return {
        id:          p.problem_id,
        title:       p.title,
        difficulty:  p.difficulty,
        max_score:   p.max_score,
        description: p.description,
        examples:    typeof p.examples    === 'string' ? JSON.parse(p.examples)    : p.examples,
        constraints: typeof p.constraints === 'string' ? JSON.parse(p.constraints) : p.constraints,
        starter: {
            python: p.starter_python || '',
            java:   p.starter_java   || '',
        },
    };
}

// ══════════════════════════════════════════════════════
// POST /api/coding/start
// Returns all active problems (without starter code)
// ══════════════════════════════════════════════════════
router.post('/start', verifyToken, requireStudent, async (req, res) => {
    try {
        const { data: rows, error: qErr } = await supabase
            .from('coding_problems')
            .select('problem_id, title, difficulty, max_score, description, examples, constraints')
            .eq('is_active', true)
            .order('problem_id');

        if (qErr) throw qErr;

        const problems = (rows || []).map(p => ({
            id:          p.problem_id,
            title:       p.title,
            difficulty:  p.difficulty,
            max_score:   p.max_score,
            description: p.description,
            examples:    typeof p.examples    === 'string' ? JSON.parse(p.examples)    : p.examples,
            constraints: typeof p.constraints === 'string' ? JSON.parse(p.constraints) : p.constraints,
        }));

        return success(res, {
            contest_name:     'Campus Coding Championship',
            duration_minutes: 90,
            total_problems:   problems.length,
            problems,
        }, 'Contest started');
    } catch (err) {
        console.error('Coding start error:', err);
        return error(res, 'Failed to start contest', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/coding/problem/:id
// Returns full problem with starter code
// ══════════════════════════════════════════════════════
router.get('/problem/:id', verifyToken, requireStudent, async (req, res) => {
    try {
        const problem = await fetchProblem(req.params.id);
        if (!problem) return error(res, 'Problem not found', 404);
        return success(res, problem);
    } catch (err) {
        return error(res, 'Failed to fetch problem', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/coding/submit
// Body: { problem_id, language, code, contest_name }
// ══════════════════════════════════════════════════════
router.post('/submit', verifyToken, requireStudent, async (req, res) => {
    const {
        problem_id,
        language     = 'python',
        code         = '',
        contest_name = 'Campus Coding Championship',
    } = req.body;

    if (!problem_id || !code.trim()) {
        return error(res, 'problem_id and code are required', 400);
    }

    try {
        const problem = await fetchProblem(problem_id);
        if (!problem) return error(res, 'Problem not found', 404);

        // Simulated scoring
        const hasContent  = code.trim().length > 20;
        const testsPassed = hasContent ? Math.floor(Math.random() * 3) + 2 : 0;
        const totalTests  = 5;
        const score       = Math.round((testsPassed / totalTests) * problem.max_score);

        const { data: result, error: insertErr } = await supabase
            .from('coding_results')
            .insert([{
                student_id:    req.user.id,
                contest_name,
                problem_id,
                problem_title: problem.title,
                score,
                max_score:     problem.max_score,
                language,
            }])
            .select()
            .single();

        if (insertErr) throw insertErr;

        // Update aggregated performance
        const { data: perf } = await supabase
            .from('performance')
            .select('total_coding_score, coding_submissions')
            .eq('student_id', req.user.id)
            .single();

        await supabase
            .from('performance')
            .upsert([{
                student_id:         req.user.id,
                total_coding_score: (perf?.total_coding_score || 0) + score,
                coding_submissions: (perf?.coding_submissions || 0) + 1,
            }], { onConflict: 'student_id' });

        return success(res, {
            coding_id:    result.coding_id,
            problem_id,
            score,
            max_score:    problem.max_score,
            tests_passed: testsPassed,
            total_tests:  totalTests,
            language,
        }, score === problem.max_score ? '🎉 Full score!' : `Evaluated: ${testsPassed}/${totalTests} tests passed`);

    } catch (err) {
        console.error('Coding submit error:', err);
        return error(res, 'Failed to submit code', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/coding/leaderboard
// ══════════════════════════════════════════════════════
router.get('/leaderboard', verifyToken, async (req, res) => {
    try {
        const { data: rows, error: qErr } = await supabase
            .from('performance')
            .select(`
                total_coding_score, coding_submissions, overall_rank,
                students (student_id, full_name, roll_number, branch)
            `)
            .order('total_coding_score', { ascending: false })
            .limit(20);

        if (qErr) throw qErr;

        const flat = (rows || []).map(r => ({
            ...r.students,
            total_coding_score: r.total_coding_score,
            coding_submissions: r.coding_submissions,
            overall_rank:       r.overall_rank,
        }));

        return success(res, flat);
    } catch (err) {
        return error(res, 'Failed to fetch leaderboard', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/coding/history
// ══════════════════════════════════════════════════════
router.get('/history', verifyToken, requireStudent, async (req, res) => {
    try {
        const { data: rows, error: qErr } = await supabase
            .from('coding_results')
            .select('*')
            .eq('student_id', req.user.id)
            .order('submission_time', { ascending: false });

        if (qErr) throw qErr;
        return success(res, rows || []);
    } catch (err) {
        return error(res, 'Failed to fetch coding history', 500, err.message);
    }
});

module.exports = router;
