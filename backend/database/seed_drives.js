// database/seed_drives.js
// Insert sample job drives for testing
require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedDrives() {
    console.log('\n🌱 Seeding sample job drives...\n');

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Get first officer ID
        const [officers] = await conn.query('SELECT officer_id FROM officers LIMIT 1');
        if (!officers.length) {
            console.log('❌ No officers found. Please seed officers first.');
            return;
        }
        
        const officerId = officers[0].officer_id;

        const drives = [
            {
                company_name: 'Microsoft',
                job_role: 'Software Engineer',
                description: 'Looking for talented software engineers to join our team.',
                package_lpa: 45.0,
                location: 'Hyderabad',
                required_percentage: 7.5,
                allowed_backlogs: 0,
                required_branch: 'Computer Science',
                required_year: '4',
                available_seats: 10,
                number_of_rounds: 4,
                drive_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                last_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
            },
            {
                company_name: 'Google',
                job_role: 'Product Manager',
                description: 'Join our product management team and shape the future.',
                package_lpa: 52.0,
                location: 'Bangalore',
                required_percentage: 8.0,
                allowed_backlogs: 0,
                required_branch: 'Computer Science',
                required_year: '4',
                available_seats: 5,
                number_of_rounds: 5,
                drive_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                last_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            },
            {
                company_name: 'Amazon',
                job_role: 'Cloud Engineer',
                description: 'Help us build the cloud infrastructure of tomorrow.',
                package_lpa: 38.0,
                location: 'Pune',
                required_percentage: 7.0,
                allowed_backlogs: 1,
                required_branch: 'Computer Science,Information Technology',
                required_year: '3,4',
                available_seats: 15,
                number_of_rounds: 3,
                drive_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
                last_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            }
        ];

        for (const drive of drives) {
            const [existing] = await conn.query(
                'SELECT drive_id FROM job_drives WHERE company_name = ? AND job_role = ?',
                [drive.company_name, drive.job_role]
            );

            if (existing.length > 0) {
                console.log(`   ⏭  SKIP  ${drive.company_name} - ${drive.job_role} (already exists)`);
                continue;
            }

            const [result] = await conn.query(`
                INSERT INTO job_drives (
                    company_name, job_role, description, package_lpa, location,
                    required_percentage, allowed_backlogs, required_branch, required_year,
                    available_seats, number_of_rounds, drive_date, last_date, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                drive.company_name, drive.job_role, drive.description, drive.package_lpa, drive.location,
                drive.required_percentage, drive.allowed_backlogs, drive.required_branch, drive.required_year,
                drive.available_seats, drive.number_of_rounds, drive.drive_date, drive.last_date, officerId
            ]);

            console.log(`   ✅  ${drive.company_name} - ${drive.job_role} (ID: ${result.insertId})`);
        }

        console.log('\n✅ Sample drives seeded successfully!');

    } catch (err) {
        console.error('❌ Error seeding drives:', err.message);
    } finally {
        await conn.end();
    }
}

seedDrives();
