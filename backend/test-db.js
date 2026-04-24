require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        
        console.log('✅ Connected successfully!');
        
        // Check if students table exists and has data
        const [students] = await conn.query('SELECT COUNT(*) as count FROM students');
        console.log('📊 Students count:', students[0].count);
        
        const [officers] = await conn.query('SELECT COUNT(*) as count FROM officers');
        console.log('👮 Officers count:', officers[0].count);
        
        // Show sample student with password info
        if (students[0].count > 0) {
            const [sample] = await conn.query('SELECT roll_number, full_name, email, password FROM students LIMIT 1');
            console.log('👤 Sample student:', {
                roll_number: sample[0].roll_number,
                full_name: sample[0].full_name,
                email: sample[0].email,
                password_length: sample[0].password.length,
                password_start: sample[0].password.substring(0, 20) + '...'
            });
        }
        
        // Show sample officer with password info
        if (officers[0].count > 0) {
            const [sample] = await conn.query('SELECT email, employee_id, password FROM officers LIMIT 1');
            console.log('👮 Sample officer:', {
                email: sample[0].email,
                employee_id: sample[0].employee_id,
                password_length: sample[0].password.length,
                password_start: sample[0].password.substring(0, 20) + '...'
            });
        }
        
        await conn.end();
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();
