require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ── Route imports ────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const drivesRoutes = require('./routes/drives');
const applicationsRoutes = require('./routes/applications');
const quizRoutes = require('./routes/quiz');
const codingRoutes = require('./routes/coding');
const reportsRoutes = require('./routes/reports');

// ── DB connection (auto-tests on import) ─────────────────────
require('./config/db');

// ── App setup ────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ────────────────────────────────────────
app.use(cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, _res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// ── API Routes ───────────────────────────────────────────────
app.use('/api', authRoutes);          // POST /api/register | POST /api/login
app.use('/api/student', studentRoutes);        // GET  /api/student/profile | PUT /api/student/update
app.use('/api/drives', drivesRoutes);         // GET  /api/drives  | POST /api/drives/create
app.use('/api', applicationsRoutes);   // POST /api/apply   | GET /api/applications
app.use('/api/quiz', quizRoutes);           // POST /api/quiz/start | POST /api/quiz/submit
app.use('/api/coding', codingRoutes);         // POST /api/coding/start | POST /api/coding/submit
app.use('/api/reports', reportsRoutes);        // GET  /api/reports/analytics | GET /api/reports/performance

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: '✅ Campus Recruitment API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error', details: err.message });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API docs: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
