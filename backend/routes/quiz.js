// routes/quiz.js  — Quiz session start & submit
const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, requireStudent } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ── Static quiz question bank (10 questions) ─────────────────
const QUESTION_BANK = [
    { id: 1, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1, explanation: 'Binary search halves the search space each step → O(log n).' },
    { id: 2, question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Heap', 'Tree'], answer: 1, explanation: 'Stack follows Last-In-First-Out.' },
    { id: 3, question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Layer'], answer: 0, explanation: 'SQL = Structured Query Language.' },
    { id: 4, question: 'In OOP, what is encapsulation?', options: ['Hiding implementation details', 'Multi-level inheritance', 'Method overloading', 'Static binding'], answer: 0, explanation: 'Encapsulation bundles data and hides internals.' },
    { id: 5, question: 'Which HTTP method is used to update a resource (partial)?', options: ['PUT', 'DELETE', 'PATCH', 'POST'], answer: 2, explanation: 'PATCH is for partial updates; PUT replaces the whole resource.' },
    { id: 6, question: 'Which sorting algorithm has the best average-case complexity?', options: ['Bubble Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'], answer: 1, explanation: 'Merge Sort → O(n log n) average case.' },
    { id: 7, question: 'What is a foreign key?', options: ['Primary identifier', 'Reference to another table primary key', 'Index on a column', 'Duplicate key'], answer: 1, explanation: 'A foreign key references the primary key of another table.' },
    { id: 8, question: 'Which layer of OSI model handles routing?', options: ['Data Link', 'Transport', 'Network', 'Session'], answer: 2, explanation: 'Layer 3 (Network) handles routing via IP.' },
    { id: 9, question: 'What does "polymorphism" mean in OOP?', options: ['Same interface, many forms', 'Single inheritance only', 'Compile-time errors only', 'None of the above'], answer: 0, explanation: 'Polymorphism = one interface, multiple behaviours.' },
    { id: 10, question: 'What is the default port of MySQL?', options: ['5432', '27017', '3306', '1521'], answer: 2, explanation: 'MySQL runs on port 3306 by default.' },
];

// ══════════════════════════════════════════════════════
// POST /api/quiz/start
// Returns quiz questions WITHOUT answers (for active quiz)
// ══════════════════════════════════════════════════════
router.post('/start', verifyToken, requireStudent, async (req, res) => {
    try {
        // Remove correct answer from questions sent to client
        const safeQuestions = QUESTION_BANK.map(({ id, question, options }) => ({ id, question, options }));
        return success(res, {
            quiz_name: 'General Aptitude & Technical Quiz',
            total_questions: safeQuestions.length,
            total_marks: 100,
            time_limit_seconds: 900,   // 15 minutes
            questions: safeQuestions,
        }, 'Quiz started');
    } catch (err) {
        return error(res, 'Failed to start quiz', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// POST /api/quiz/submit
// Body: { answers: [{ question_id, selected_option }], time_taken }
// Returns: score, pass/fail, detailed review
// ══════════════════════════════════════════════════════
router.post('/submit', verifyToken, requireStudent, async (req, res) => {
    const { answers = [], time_taken = 0, quiz_name = 'General Aptitude & Technical Quiz' } = req.body;

    try {
        let score = 0;
        const marksPerQuestion = 10;
        const review = [];

        answers.forEach(({ question_id, selected_option }) => {
            const q = QUESTION_BANK.find(x => x.id === parseInt(question_id));
            if (!q) return;

            const is_correct = parseInt(selected_option) === q.answer;
            if (is_correct) score += marksPerQuestion;

            review.push({
                question_id: q.id,
                question: q.question,
                selected_option,
                correct_option: q.answer,
                is_correct,
                explanation: q.explanation,
            });
        });

        const total_marks = 100;
        const passed = score >= 50;   // Pass mark: 50%

        // Save to DB
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
            score, total_marks, passed,
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
// Returns quiz history for logged-in student
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
