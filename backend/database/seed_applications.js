// database/seed_applications.js
// Insert sample applications for testing
require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedApplications() {
    console.log('\n🌱 Seeding sample applications...\n');

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Get sample students and drives
        const [students] = await conn.query('SELECT student_id, full_name, roll_number FROM students LIMIT 5');
        const [drives] = await conn.query('SELECT drive_id, company_name FROM job_drives');

        if (students.length === 0 || drives.length === 0) {
            console.log('❌ No students or drives found. Please seed them first.');
            return;
        }

        const statuses = ['Pending', 'Shortlisted', 'Selected', 'Rejected'];
        let inserted = 0;

        for (const student of students) {
            for (const drive of drives) {
                // Check if application already exists
                const [existing] = await conn.query(
                    'SELECT application_id FROM applications WHERE student_id = ? AND drive_id = ?',
                    [student.student_id, drive.drive_id]
                );

                if (existing.length > 0) {
                    console.log(`   ⏭  SKIP  ${student.full_name} → ${drive.company_name} (already applied)`);
                    continue;
                }

                // Random status for demo
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                const [result] = await conn.query(`
                    INSERT INTO applications (student_id, drive_id, application_status, eligibility_verified, applied_date)
                    VALUES (?, ?, ?, TRUE, NOW())
                `, [student.student_id, drive.drive_id, status]);

                console.log(`   ✅  ${student.full_name} → ${drive.company_name} (${status})`);
                inserted++;
            }
        }

        console.log(`\n✅ ${inserted} sample applications seeded successfully!`);

    } catch (err) {
        console.error('❌ Error seeding applications:', err.message);
    } finally {
        await conn.end();
    }
}

seedApplications();
