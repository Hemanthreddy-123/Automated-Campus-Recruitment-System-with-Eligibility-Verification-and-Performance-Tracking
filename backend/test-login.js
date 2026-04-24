require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        
        console.log('Testing login...');
        
        // Test student login
        const [students] = await conn.query(
            'SELECT * FROM students WHERE roll_number = ? OR email = ? LIMIT 1',
            ['22G21A0575', '22G21A0575']
        );
        
        if (students.length > 0) {
            const student = students[0];
            console.log('👤 Found student:', student.roll_number, student.email);
            
            // Test password comparison
            const passwordMatch = await bcrypt.compare('22G21A0575', student.password);
            console.log('🔑 Password match for "22G21A0575":', passwordMatch);
            
            // Test with email
            const emailMatch = await bcrypt.compare('22G21A0575', student.password);
            console.log('🔑 Password match with same password:', emailMatch);
        }
        
        // Test officer login
        const [officers] = await conn.query(
            'SELECT * FROM officers WHERE email = ? OR employee_id = ? LIMIT 1',
            ['officer@campus.edu', 'officer@campus.edu']
        );
        
        if (officers.length > 0) {
            const officer = officers[0];
            console.log('👮 Found officer:', officer.email, officer.employee_id);
            
            // Test password comparison
            const passwordMatch = await bcrypt.compare('Test@1234', officer.password);
            console.log('🔑 Password match for "Test@1234":', passwordMatch);
        }
        
        await conn.end();
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testLogin();
