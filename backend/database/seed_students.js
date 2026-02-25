// database/seed_students.js
// Inserts all 64 students from the provided class list
// Email = RegnNo@campus.edu  |  Password = Regd.No (bcrypt hashed)
// Run: node database/seed_students.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// ── Full student list ─────────────────────────────────────────
const STUDENTS = [
    { roll: '22G21A0575', name: 'KANKANALA SUSHMITHA' },
    { roll: '22G21A0576', name: 'KANNELURI HARISH' },
    { roll: '22G21A0578', name: 'KARANAM LAHITHA' },
    { roll: '22G21A0579', name: 'KASETTY MUNI SAI' },
    { roll: '22G21A0580', name: 'KATAM NAGA VISHNU VARDHAN' },
    { roll: '22G21A0581', name: 'KATE MAHESH' },
    { roll: '22G21A0583', name: 'KATTINA BHANU PRAKASH' },
    { roll: '22G21A0586', name: 'KONAPURAM HEMANTH' },
    { roll: '22G21A0587', name: 'KONETI NANDINI' },
    { roll: '22G21A0588', name: 'KONUMKULA DEEPTHI' },
    { roll: '22G21A0589', name: 'KOSURU SOWMYA' },
    { roll: '22G21A0590', name: 'KOTHALURU GAYATHRI' },
    { roll: '22G21A0591', name: 'KOTHALURU SIVA SATWIKA' },
    { roll: '22G21A0593', name: 'KUMMATHI MANJUNATHAREDDY' },
    { roll: '22G21A0594', name: 'KUPPANI PAVANI' },
    { roll: '22G21A0595', name: 'KURUVA SAI KUMAR' },
    { roll: '22G21A0596', name: 'LEBURU AVINASH' },
    { roll: '22G21A0598', name: 'LEKKALA SRAVYA' },
    { roll: '22G21A0599', name: 'MADDURI VINOD' },
    { roll: '22G21A05A0', name: 'MAMIDI LAKSHMI REDDY' },
    { roll: '22G21A05A1', name: 'MANIKALA SWARNALATHA' },
    { roll: '22G21A05A2', name: 'MARTHALA AJAY KUMAR' },
    { roll: '22G21A05A3', name: 'MD ABDURRAHMAN' },
    { roll: '22G21A05A4', name: 'MEENIGA BHANU PRASAD' },
    { roll: '22G21A05A6', name: 'MENATI MAHESH' },
    { roll: '22G21A05A8', name: 'MONDEM MASTHANAMMA' },
    { roll: '22G21A05A9', name: 'MUDIGETI MEGHANA' },
    { roll: '22G21A05B0', name: 'MUKKAMALLA HEMANTH REDDY' },
    { roll: '22G21A05B1', name: 'MUPPURI VAMSI' },
    { roll: '22G21A05B3', name: 'NALABAI VENKATESH' },
    { roll: '22G21A05B4', name: 'NALLABAYI PRAVEEN KUMAR' },
    { roll: '22G21A05B5', name: 'NALLAGORLA VAMSI' },
    { roll: '22G21A05B6', name: 'NANUBALA SUDESHNA' },
    { roll: '22G21A05B7', name: 'NEERUKATTU NARASIMHA RAO' },
    { roll: '22G21A05B9', name: 'NERASALA MOHAN' },
    { roll: '22G21A05C0', name: 'NOOKALA HEMANTH KUMAR' },
    { roll: '22G21A05C1', name: 'ONTERU BHARGAV' },
    { roll: '22G21A05C2', name: 'ONTERU LOKESH' },
    { roll: '22G21A05C3', name: 'OTTURU MAHENDRA' },
    { roll: '22G21A05C4', name: 'P MANVITHA' },
    { roll: '22G21A05C5', name: 'PADIRI MANOJ KUMAR' },
    { roll: '22G21A05C6', name: 'PALAKISTA LAKSHMI NARASIMHA RAO' },
    { roll: '22G21A05C7', name: 'PALNATI VENKATA NAVYA' },
    { roll: '22G21A05C8', name: 'PANDETIPALLI HAREESHA' },
    { roll: '22G21A05C9', name: 'PANDI UDAY KIRAN REDDY' },
    { roll: '22G21A05D0', name: 'PARUSU AKSHAYA' },
    { roll: '22G21A05D1', name: 'PARVATHALA CHARANSAI' },
    { roll: '22G21A05D2', name: 'PERUMALLA BHANUPRASANNA' },
    { roll: '22G21A05D3', name: 'PIDUGU SUKANYA' },
    { roll: '22G21A05D4', name: 'POLEPALLI LAKSHMAN' },
    { roll: '22G21A05D5', name: 'POLEPALLI RAMCHARAN' },
    { roll: '22G21A05D6', name: 'POLINENI SANTHOSH KUMAR' },
    { roll: '22G21A05D7', name: 'PONNAGANTI MOHAN SAI' },
    { roll: '22G21A05D8', name: 'POOLA LIKITHA' },
    { roll: '22G21A05D9', name: 'POTTELLA DEVI SATHVIKA' },
    { roll: '22G21A05E0', name: 'PRALAYAKAVERI THRINESH' },
    { roll: '22G21A05E1', name: 'PREGADA VENKATASUBBAMMA' },
    { roll: '22G21A05E3', name: 'PULIGOTI CHANDU' },
    { roll: '22G21A05E4', name: 'PUNUGOTI KEERTHANA' },
    { roll: '22G21A05E5', name: 'PUTHETI SUNDAR KUMAR' },
    { roll: '22G21A05E6', name: 'PUVVADI SWATHI' },
    { roll: '22G21A05E7', name: 'RAGIPINDI JAGADEESHWAR REDDY' },
    { roll: '22G21A05E8', name: 'RAMIREDDY AMULYA' },
    { roll: '22G21A05E9', name: 'RAMISETTY NAGA SURYA AVINASH' },
];

// ── Helper: generate a mobile number placeholder ──────────────
const fakeMobile = (i) => `9${String(876540000 + i).padStart(9, '0')}`;

async function seedStudents() {
    console.log('\n🌱 Seeding 64 students into campus_recruitment database...\n');

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < STUDENTS.length; i++) {
        const { roll, name } = STUDENTS[i];

        try {
            // Password = Regd.No (e.g. 22G21A0575)
            const hash = await bcrypt.hash(roll, 10);

            // Email = RegnNo@campus.edu  (used for login via roll_number field too)
            const email = `${roll.toLowerCase()}@campus.edu`;
            const mobile = fakeMobile(i + 100);

            // Check if already exists
            const [existing] = await conn.query(
                'SELECT student_id FROM students WHERE roll_number = ? OR email = ?',
                [roll, email]
            );

            if (existing.length > 0) {
                console.log(`   ⏭  SKIP  ${roll}  ${name}  (already exists)`);
                skipped++;
                continue;
            }

            // Insert student
            const [result] = await conn.query(
                `INSERT INTO students
           (full_name, roll_number, email, mobile_number, branch, year, percentage, backlogs, password, profile_complete)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    roll,
                    email,
                    mobile,
                    'Computer Science',   // Branch — 22G21A05xx series = CSE
                    4,                    // Year  — 2022 batch → 4th year in 2025-26
                    7.50,                 // Default CGPA (can be updated via profile)
                    0,                    // Default backlogs
                    hash,
                    false,                // profile_complete = false until updated
                ]
            );

            // Create blank performance record
            await conn.query(
                'INSERT IGNORE INTO performance (student_id) VALUES (?)',
                [result.insertId]
            );

            console.log(`   ✅  ${String(i + 1).padStart(2, '0')}. ${roll}  ${name}`);
            inserted++;

        } catch (err) {
            console.error(`   ❌  FAIL  ${roll}  ${name} — ${err.message}`);
            errors.push({ roll, name, error: err.message });
        }
    }

    await conn.end();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`✅  Inserted : ${inserted} students`);
    console.log(`⏭  Skipped  : ${skipped} (already existed)`);
    console.log(`❌  Errors   : ${errors.length}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🔑  HOW TO LOGIN:');
    console.log('   Role     : Student');
    console.log('   Login ID : Regd.No   (e.g. 22G21A0575)');
    console.log('   Password : Regd.No   (e.g. 22G21A0575)');
    console.log('\n   Students can change their password after first login.');
    console.log('═══════════════════════════════════════════════════════\n');

    if (errors.length > 0) {
        console.log('Failed entries:');
        errors.forEach(e => console.log(`  - ${e.roll}: ${e.error}`));
    }
}

seedStudents().catch(err => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});
