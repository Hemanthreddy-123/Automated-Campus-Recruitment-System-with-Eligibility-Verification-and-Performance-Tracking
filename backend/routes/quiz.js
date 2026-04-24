// routes/quiz.js  — Quiz (DB-driven questions)
const router = require('express').Router();
const pool   = require('../config/db');
const { verifyToken, requireStudent } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

const QUIZ_NAME      = 'General Aptitude & Technical Quiz';
const MARKS_PER_Q    = 10;
const PASS_MARK      = 50;
const TIME_LIMIT_SEC = 900; // 15 min

// ══════════════════════════════════════════════════════
// POST /api/quiz/start
// Returns questions WITHOUT correct_index
// ══════════════════════════════════════════════════════
router.post('/start', verifyToken, requireStudent, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT question_id, question, options
             FROM quiz_questions
             WHERE is_active = TRUE AND quiz_name = ?
             ORDER BY question_id`,
            [QUIZ_NAME]
        );

        if (!rows.length) {
            return error(res, 'No questions found. Run migrate_questions.js first.', 404);
        }

        const questions = rows.map(q => ({
            id:       q.question_id,
            question: q.question,
            options:  typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }));

        return success(res, {
            quiz_name:          QUIZ_NAME,
            total_questions:    questions.length,
            total_marks:        questions.length * MARKS_PER_Q,
            time_limit_seconds: TIME_LIMIT_SEC,
            questions,
        }, 'Quiz started');
    } catch (err) {
        console.error('Quiz start error:', err);
        return error(res, 'Failed to start quiz', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/quiz/submit
// Body: { answers: [{ question_id, selected_option }], time_taken, quiz_name }
// ══════════════════════════════════════════════════════
router.post('/submit', verifyToken, requireStudent, async (req, res) => {
    const { answers = [], time_taken = 0, quiz_name = QUIZ_NAME } = req.body;

    try {
        // Fetch all active questions with answers
        const [rows] = await pool.query(
            `SELECT question_id, question, options, correct_index, explanation
             FROM quiz_questions WHERE is_active = TRUE AND quiz_name = ?`,
            [quiz_name]
        );

        const questionMap = {};
        rows.forEach(q => {
            questionMap[q.question_id] = {
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            };
        });

        let score = 0;
        const review = [];

        answers.forEach(({ question_id, selected_option }) => {
            const q = questionMap[parseInt(question_id)];
            if (!q) return;

            const is_correct = parseInt(selected_option) === q.correct_index;
            if (is_correct) score += MARKS_PER_Q;

            review.push({
                question_id:    q.question_id,
                question:       q.question,
                options:        q.options,
                selected_option: parseInt(selected_option),
                correct_option: q.correct_index,
                is_correct,
                explanation:    q.explanation,
            });
        });

        const total_marks = rows.length * MARKS_PER_Q;
        const passed      = score >= PASS_MARK;

        // Save result to quiz_results
        const [result] = await pool.query(
            `INSERT INTO quiz_results (student_id, quiz_name, score, total_marks, passed, time_taken)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, quiz_name, score, total_marks, passed, parseInt(time_taken)]
        );

        // Update aggregated performance
        await pool.query(
            `UPDATE performance
             SET total_quiz_score = total_quiz_score + ?,
                 quiz_attempts    = quiz_attempts + 1,
                 avg_quiz_score   = (total_quiz_score + ?) / (quiz_attempts + 1)
             WHERE student_id = ?`,
            [score, score, req.user.id]
        );

        return success(res, {
            quiz_id: result.insertId,
            score,
            total_marks,
            passed,
            percentage: ((score / total_marks) * 100).toFixed(1),
            review,
        }, passed ? '🎉 Quiz passed!' : 'Quiz submitted. Better luck next time!');

    } catch (err) {
        console.error('Quiz submit error:', err);
        return error(res, 'Failed to submit quiz', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/quiz/history
// ══════════════════════════════════════════════════════
router.get('/history', verifyToken, requireStudent, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM quiz_results WHERE student_id = ? ORDER BY attempt_date DESC',
            [req.user.id]
        );
        return success(res, rows);
    } catch (err) {
        return error(res, 'Failed to fetch quiz history', 500, err.message);
    }
});

module.exports = router;
