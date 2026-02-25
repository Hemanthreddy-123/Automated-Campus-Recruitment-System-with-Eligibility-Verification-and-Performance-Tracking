const mysql = require('mysql2/promise');
require('dotenv').config();

// ── Create Connection Pool ──────────────────────────────────────────────────
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+05:30',         // IST
    charset: 'utf8mb4',
});

// ── Test connection on startup ──────────────────────────────────────────────
async function testConnection() {
    try {
        const conn = await pool.getConnection();
        console.log(`✅ MySQL connected  →  ${process.env.DB_HOST}:${process.env.DB_PORT} / ${process.env.DB_NAME}`);
        conn.release();
    } catch (err) {
        console.error('❌ MySQL connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();

module.exports = pool;
