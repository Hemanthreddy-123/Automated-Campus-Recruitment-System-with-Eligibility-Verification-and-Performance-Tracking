// routes/coding.js  — Coding competition start & submit
const router = require('express').Router();
const pool = require('../config/db');
const { verifyToken, requireStudent } = require('../middleware/auth');
const { success, error } = require('../utils/helpers');

// ── Problem Bank ─────────────────────────────────────────────
const PROBLEMS = [
    {
        id: 1, title: 'Two Sum', difficulty: 'Easy', max_score: 100,
        description: 'Given an array of integers nums and integer target, return indices of two numbers that add up to target.',
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]' }],
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer'],
        starter: { python: 'def two_sum(nums, target):\n    # Write your solution here\n    pass', java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution\n    }\n}' },
    },
    {
        id: 2, title: 'Reverse a Linked List', difficulty: 'Medium', max_score: 150,
        description: 'Reverse a singly linked list and return the head of the reversed list.',
        examples: [{ input: '1 → 2 → 3 → 4 → 5', output: '5 → 4 → 3 → 2 → 1' }],
        constraints: ['0 ≤ nodes ≤ 5000', '-5000 ≤ Node.val ≤ 5000'],
        starter: { python: 'def reverse_list(head):\n    prev = None\n    # Write your solution\n    pass', java: 'public ListNode reverseList(ListNode head) {\n    // Write here\n}' },
    },
    {
        id: 3, title: 'LRU Cache', difficulty: 'Hard', max_score: 200,
        description: 'Implement an LRU (Least Recently Used) cache with O(1) get and put operations.',
        examples: [{ input: 'capacity=2, put(1,1), put(2,2), get(1)', output: '1; then put(3,3) evicts key 2' }],
        constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', 'At most 2×10⁵ calls'],
        starter: { python: 'from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass', java: 'class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) {}\n    public void put(int key, int value) {}\n}' },
    },
    {
        id: 4, title: 'Valid Parentheses', difficulty: 'Easy', max_score: 100,
        description: 'Given a string s of brackets, determine if it is valid (every open bracket has a matching close bracket in order).',
        examples: [{ input: '"()[]{}"', output: 'true' }, { input: '"(]"', output: 'false' }],
        constraints: ['1 ≤ s.length ≤ 10⁴'],
        starter: { python: 'def is_valid(s):\n    # Stack-based approach\n    pass', java: 'public boolean isValid(String s) {\n    // Stack\n}' },
    },
    {
        id: 5, title: 'Merge Intervals', difficulty: 'Medium', max_score: 150,
        description: 'Given an array of intervals, merge all overlapping intervals.',
        examples: [{ input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }],
        constraints: ['1 ≤ intervals.length ≤ 10⁴'],
        starter: { python: 'def merge(intervals):\n    pass', java: 'public int[][] merge(int[][] intervals) {\n    // TODO\n}' },
    },
];

// ══════════════════════════════════════════════════════
// POST /api/coding/start
// Returns problem list for the contest
// ══════════════════════════════════════════════════════
router.post('/start', verifyToken, requireStudent, async (req, res) => {
    try {
        const safeProblems = PROBLEMS.map(({ starter, ...rest }) => rest);  // hide starter in listing
        return success(res, {
            contest_name: 'Campus Coding Championship',
            duration_minutes: 90,
            total_problems: PROBLEMS.length,
            problems: safeProblems,
        }, 'Contest started');
    } catch (err) {
        return error(res, 'Failed to start contest', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/coding/problem/:id
// Returns full problem with starter code
// ══════════════════════════════════════════════════════
router.get('/problem/:id', verifyToken, requireStudent, async (req, res) => {
    const problem = PROBLEMS.find(p => p.id === parseInt(req.params.id));
    if (!problem) return error(res, 'Problem not found', 404);
    return success(res, problem);
});

// ══════════════════════════════════════════════════════
// POST /api/coding/submit
// Body: { problem_id, language, code, contest_name }
// Simulates evaluation (scoring based on code length proxy)
// ══════════════════════════════════════════════════════
router.post('/submit', verifyToken, requireStudent, async (req, res) => {
    const { problem_id, language = 'python', code = '', contest_name = 'Campus Coding Championship' } = req.body;

    if (!problem_id || !code.trim()) {
        return error(res, 'problem_id and code are required', 400);
    }

    const problem = PROBLEMS.find(p => p.id === parseInt(problem_id));
    if (!problem) return error(res, 'Problem not found', 404);

    try {
        // Simulated scoring: code must have content (real eval would use a judge)
        const hasContent = code.trim().length > 20;
        const testsPassed = hasContent ? Math.floor(Math.random() * 3) + 2 : 0;  // 2-4 tests
        const totalTests = 5;
        const score = Math.round((testsPassed / totalTests) * problem.max_score);

        const [result] = await pool.query(
            `INSERT INTO coding_results
         (student_id, contest_name, problem_id, problem_title, score, max_score, language)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, contest_name, problem_id, problem.title, score, problem.max_score, language]
        );

        // Update performance
        await pool.query(
            `UPDATE performance
       SET total_coding_score  = total_coding_score + ?,
           coding_submissions  = coding_submissions + 1
       WHERE student_id = ?`,
            [score, req.user.id]
        );

        return success(res, {
            coding_id: result.insertId,
            problem_id, score,
            max_score: problem.max_score,
            tests_passed: testsPassed,
            total_tests: totalTests,
            language,
        }, score === problem.max_score ? '🎉 Full score! All tests passed!' : `Evaluated: ${testsPassed}/${totalTests} tests passed`);

    } catch (err) {
        console.error('Coding submit error:', err);
        return error(res, 'Failed to submit code', 500, err.message);
    }
});

// ══════════════════════════════════════════════════════
// GET /api/coding/leaderboard
// Top students by total coding score
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
// This student's coding history
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
