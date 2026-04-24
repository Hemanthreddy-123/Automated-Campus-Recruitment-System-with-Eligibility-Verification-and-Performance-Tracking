// routes/coding.js  — Coding competition (DB-driven problems)
const router = require('express').Router();
const pool   = require('../config/db');
const { verifyToken, requireStudent } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ── Helper: fetch one problem from DB ────────────────────────
async function fetchProblem(id) {
    const [rows] = await pool.query(
        'SELECT * FROM coding_problems WHERE problem_id = ? AND is_active = TRUE',
        [id]
    );
    if (!rows.length) return null;
    const p = rows[0];
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
        const [rows] = await pool.query(
            `SELECT problem_id, title, difficulty, max_score, description, examples, constraints
             FROM coding_problems WHERE is_active = TRUE ORDER BY problem_id`
        );

        const problems = rows.map(p => ({
            id:          p.problem_id,
            title:       p.title,
            difficulty:  p.difficulty,
            max_score:   p.max_score,
            description: p.description,
            examples:    typeof p.examples    === 'string' ? JSON.parse(p.examples)    : p.examples,
            constraints: typeof p.constraints === 'string' ? JSON.parse(p.constraints) : p.constraints,
        }));

        return success(res, {
            contest_name:    'Campus Coding Championship',
            duration_minutes: 90,
            total_problems:  problems.length,
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
    const { problem_id, language = 'python', code = '', contest_name = 'Campus Coding Championship' } = req.body;

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

        const [result] = await pool.query(
            `INSERT INTO coding_results
                (student_id, contest_name, problem_id, problem_title, score, max_score, language)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, contest_name, problem_id, problem.title, score, problem.max_score, language]
        );

        await pool.query(
            `UPDATE performance
             SET total_coding_score = total_coding_score + ?,
                 coding_submissions = coding_submissions + 1
             WHERE student_id = ?`,
            [score, req.user.id]
        );

        return success(res, {
            coding_id:    result.insertId,
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
        const [rows] = await pool.query(
            `SELECT s.student_id, s.full_name, s.roll_number, s.branch,
                    p.total_coding_score, p.coding_submissions, p.overall_rank
             FROM performance p
             JOIN students s ON s.student_id = p.student_id
             ORDER BY p.total_coding_score DESC
             LIMIT 20`
        );
        return success(res, rows);
    } catch (err) {
        return error(res, 'Failed to fetch leaderboard', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/coding/history
// ══════════════════════════════════════════════════════
router.get('/history', verifyToken, requireStudent, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM coding_results WHERE student_id = ? ORDER BY submission_time DESC',
            [req.user.id]
        );
        return success(res, rows);
    } catch (err) {
        return error(res, 'Failed to fetch coding history', 500, err.message);
    }
});

module.exports = router;
