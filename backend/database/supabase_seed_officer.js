// database/supabase_seed_officer.js
// Seeds the demo officer account into Supabase
// Run: node database/supabase_seed_officer.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function seedOfficer() {
    console.log('\n🌱 Seeding demo officer into Supabase...\n');

    const officers = [
        {
            full_name:     'Dr. S. Krishnan',
            email:         'officer@campus.edu',
            mobile_number: '9876500001',
            employee_id:   'PO-001',
            department:    'Training & Placement',
            password:      'Test@1234',
        },
        {
            full_name:     'Prof. R. Sharma',
            email:         'officer2@campus.edu',
            mobile_number: '9876500002',
            employee_id:   'PO-002',
            department:    'Training & Placement',
            password:      'Test@1234',
        },
    ];

    for (const o of officers) {
        try {
            // Check duplicate
            const { data: existing } = await supabase
                .from('officers')
                .select('officer_id')
                .or(`email.eq.${o.email},employee_id.eq.${o.employee_id}`)
                .limit(1);

            if (existing && existing.length > 0) {
                console.log(`   ⏭  SKIP  ${o.email} (already exists)`);
                continue;
            }

            const hash = await bcrypt.hash(o.password, 10);

            const { error } = await supabase
                .from('officers')
                .insert([{ ...o, password: hash }]);

            if (error) throw error;

            console.log(`   ✅  ${o.full_name}  (${o.email})`);
        } catch (err) {
            console.error(`   ❌  FAIL  ${o.email} — ${err.message}`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🔑  Officer Login:');
    console.log('   Email    : officer@campus.edu');
    console.log('   Password : Test@1234');
    console.log('═══════════════════════════════════════════════════════\n');
}

seedOfficer().catch(err => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});
