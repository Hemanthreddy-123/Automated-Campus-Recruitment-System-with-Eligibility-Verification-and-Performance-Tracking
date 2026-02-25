const jwt = require('jsonwebtoken');

// ── Generate access token ────────────────────────────────────
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// ── Verify token middleware ─────────────────────────────────
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { id, role, email }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

// ── Role-guard middleware factories ─────────────────────────
const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ success: false, message: `Access denied. Requires role: ${roles.join(' or ')}.` });
    }
    next();
};

const requireStudent = requireRole('student');
const requireOfficer = requireRole('officer');
const requireAnyRole = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    next();
};

module.exports = { generateToken, verifyToken, requireStudent, requireOfficer, requireAnyRole };
