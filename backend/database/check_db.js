// database/check_db.js  — Run: node database/check_db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDB() {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST, port: 3306,
        user: process.env.DB_USER, password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const [total] = await c.query('SELECT COUNT(*) AS cnt FROM students');
    const [dummies] = await c.query("SELECT roll_number, full_name FROM students WHERE roll_number NOT LIKE '22G21A%'");
    const [real] = await c.query("SELECT roll_number, full_name FROM students WHERE roll_number LIKE '22G21A%' ORDER BY roll_number");
    const [officers] = await c.query('SELECT employee_id, full_name, email FROM officers');

    console.log('\n══════════════════════════════════════════════');
    console.log(' DATABASE STATUS — campus_recruitment');
    console.log('══════════════════════════════════════════════');
    console.log(`Total students  : ${total[0].cnt}`);
    console.log(`Real (22G21A%)  : ${real.length}`);
    console.log(`Dummy/Other     : ${dummies.length}`);

    if (dummies.length > 0) {
        console.log('\n⚠  Non-class students (will be deleted):');
        dummies.forEach(s => console.log(`   - ${s.roll_number}  |  ${s.full_name}`));
    } else {
        console.log('\n✅ No dummy students — only real class students exist!');
    }

    console.log('\n📋 First 10 real students:');
    real.slice(0, 10).forEach(s => console.log(`   ${s.roll_number}  |  ${s.full_name}`));
    console.log(`   ... and ${real.length - 10} more`);

    console.log('\n👮 Officers:');
    officers.forEach(o => console.log(`   ${o.employee_id}  |  ${o.full_name}  |  ${o.email}`));
    console.log('══════════════════════════════════════════════\n');

    await c.end();
}

checkDB().catch(console.error);
