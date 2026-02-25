const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDrives() {
    const config = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'campus_recruitment'
    };

    const c = await mysql.createConnection(config);
    try {
        // Ensure at least one officer exists for foreign key
        const [officers] = await c.query('SELECT officer_id FROM officers LIMIT 1');
        if (officers.length === 0) {
            console.log('No officer found. Creating a default one...');
            await c.execute('INSERT INTO officers (full_name, email, password, employee_id) VALUES (?,?,?,?)',
                ['Placement Officer', 'officer@campus.edu', '$2b$10$YourHashedPasswordHere', 'PO-001']);
        }
        const officerId = (await c.query('SELECT officer_id FROM officers LIMIT 1'))[0][0].officer_id;

        const drives = [
            ['Google', 'Software Engineer', 'Work on core search engine.', 45.0, 'Bangalore', 7.5, 0, 'Computer Science', '4', 10, 3, '2025-06-15', '2025-04-10'],
            ['Microsoft', 'SDE Intern', 'Summer internship.', 15.0, 'Hyderabad', 7.0, 0, 'Computer Science,IT', '3,4', 20, 2, '2025-05-20', '2025-04-15'],
            ['Amazon', 'SDE-I', 'Join the retail giant.', 32.0, 'Chennai', 6.5, 1, 'Computer Science,IT,ECE', '4', 15, 3, '2025-07-01', '2025-05-10'],
            ['TCS', 'Ninja Developer', 'Mass recruitment.', 4.5, 'Pune', 6.0, 2, 'Computer Science,IT,ECE,EE,ME,CE', '4', 200, 2, '2025-08-10', '2025-06-30']
        ];

        for (const d of drives) {
            await c.execute(
                `INSERT IGNORE INTO job_drives 
                (company_name, job_role, description, package_lpa, location, required_percentage, allowed_backlogs, required_branch, required_year, available_seats, number_of_rounds, drive_date, last_date, created_by) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [...d, officerId]
            );
        }
        console.log('✅ 4 Job Drives seeded into database.');
    } catch (err) {
        console.error('Error seeding drives:', err);
    } finally {
        await c.end();
    }
}

seedDrives();
