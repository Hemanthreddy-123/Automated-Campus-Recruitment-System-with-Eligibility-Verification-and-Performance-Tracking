// reseed.js — Regenerate passwords with correct bcrypt hashes
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function reseed() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER, password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const hash = await bcrypt.hash('Test@1234', 10);
    console.log('Generated hash:', hash);

    await conn.query('UPDATE students SET password = ?', [hash]);
    await conn.query('UPDATE officers SET password = ?', [hash]);

    console.log('✅ All student and officer passwords reset to: Test@1234');
    await conn.end();
}

reseed().catch(console.error);
