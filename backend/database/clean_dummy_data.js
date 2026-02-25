// database/clean_dummy_data.js
// REMOVES all 8 old dummy/seed students (Rahul, Priya, etc.)
// KEEPS the 64 real class students (22G21A05xx series)
// KEEPS the 2 officers (officer@campus.edu, officer2@campus.edu)
// Run: node database/clean_dummy_data.js

require('dotenv').config();
const mysql = require('mysql2/promise');

const DUMMY_ROLLS = [
    '21CS047', '21CS012', '21IT023', '21CS047B',
    '21IT045', '21ECE012', '21CS088', '21ME033',
];

async function cleanDummyData() {
    console.log('\n🧹 Cleaning dummy/fake student data from campus_recruitment...\n');

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // ── 1. First show what will be deleted ──────────────────
        const [toDelete] = await conn.query(
            'SELECT student_id, roll_number, full_name FROM students WHERE roll_number IN (?)',
            [DUMMY_ROLLS]
        );

        if (toDelete.length === 0) {
            console.log('✅ No dummy students found — database is already clean!\n');
            await conn.end();
            return;
        }

        console.log(`Found ${toDelete.length} dummy student(s) to remove:`);
        toDelete.forEach(s => console.log(`   🗑  ${s.roll_number}  ${s.full_name}`));
        console.log('');

        // ── 2. Delete performance records first (FK constraint) ─
        const ids = toDelete.map(s => s.student_id);
        await conn.query('DELETE FROM performance   WHERE student_id IN (?)', [ids]);
        await conn.query('DELETE FROM applications  WHERE student_id IN (?)', [ids]);
        await conn.query('DELETE FROM quiz_results  WHERE student_id IN (?)', [ids]);
        await conn.query('DELETE FROM coding_results WHERE student_id IN (?)', [ids]);

        // ── 3. Delete the dummy students ────────────────────────
        const [delResult] = await conn.query(
            'DELETE FROM students WHERE roll_number IN (?)',
            [DUMMY_ROLLS]
        );

        console.log(`✅ Removed ${delResult.affectedRows} dummy student(s) and all their related data.\n`);

        // ── 4. Verify remaining students ─────────────────────────
        const [remaining] = await conn.query(
            'SELECT COUNT(*) AS total FROM students'
        );
        console.log(`📊 Remaining students in DB: ${remaining[0].total}`);

        // ── 5. Show first 5 real students ────────────────────────
        const [sample] = await conn.query(
            'SELECT roll_number, full_name, branch, year FROM students ORDER BY roll_number LIMIT 5'
        );
        console.log('\nSample of remaining students:');
        sample.forEach(s => console.log(`   ✅ ${s.roll_number}  ${s.full_name}  (${s.branch}, Year ${s.year})`));

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('✅ Database cleaned. Only real class students remain.');
        console.log('🔑 Each student logs in with: Regd.No as ID and Password');
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (err) {
        console.error('❌ Error cleaning dummy data:', err.message);
        process.exit(1);
    } finally {
        await conn.end();
    }
}

cleanDummyData();
