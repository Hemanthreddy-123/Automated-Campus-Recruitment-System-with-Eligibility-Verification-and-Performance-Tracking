const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ── Create Supabase Client ──────────────────────────────────────────────────
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ── Test connection on startup ──────────────────────────────────────────────
async function testConnection() {
    try {
        const { error } = await supabase.from('students').select('student_id').limit(1);
        if (error) throw error;
        console.log(`✅ Supabase connected  →  ${process.env.SUPABASE_URL}`);
    } catch (err) {
        console.error('❌ Supabase connection failed:', err.message);
        // Don't exit — table may not exist yet, but client is valid
    }
}

testConnection();

module.exports = supabase;
