// database/migrate.js
// Run: node database/migrate.js
// Creates all tables and inserts seed data
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
    console.log('\n📦 Starting database migration...\n');

    // Connect WITHOUT selecting a database first (so we can CREATE DATABASE)
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true,
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await conn.query(sql);
        console.log('✅ All tables created and seed data inserted successfully!');
        console.log('\n📋 Tables created:');
        console.log('   • students');
        console.log('   • officers');
        console.log('   • job_drives');
        console.log('   • applications');
        console.log('   • quiz_results');
        console.log('   • coding_results');
        console.log('   • performance');
        console.log('   • refresh_tokens');
        console.log('\n🌱 Seed data inserted:');
        console.log('   • 2 officers  (email: officer@campus.edu / officer2@campus.edu)');
        console.log('   • 8 students  (e.g. rahul@campus.edu)');
        console.log('   • Password for all: Test@1234\n');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await conn.end();
    }
}

migrate();
