// database/supabase_seed_drives.js
// Seeds 15 realistic job drives into Supabase
// Run: node database/supabase_seed_drives.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const DRIVES = [
    { company_name: 'Google', job_role: 'Software Engineer', description: 'Join Google as a Software Engineer. Work on large-scale distributed systems, search infrastructure, and cutting-edge products used by billions.', package_lpa: 45.00, location: 'Hyderabad', required_percentage: 70.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering', required_year: '4', available_seats: 20, number_of_rounds: 5, drive_date: '2026-06-10', last_date: '2026-12-30' },
    { company_name: 'Microsoft', job_role: 'Software Development Engineer', description: 'Microsoft is hiring SDEs to build next-generation cloud services on Azure.', package_lpa: 40.00, location: 'Hyderabad', required_percentage: 65.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology', required_year: '4', available_seats: 15, number_of_rounds: 4, drive_date: '2026-06-15', last_date: '2026-12-30' },
    { company_name: 'Amazon', job_role: 'SDE-1', description: 'Amazon is looking for passionate engineers to join AWS and e-commerce teams.', package_lpa: 32.00, location: 'Bangalore', required_percentage: 65.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering', required_year: '4', available_seats: 25, number_of_rounds: 4, drive_date: '2026-06-20', last_date: '2026-12-30' },
    { company_name: 'TCS', job_role: 'Systems Engineer', description: 'TCS is hiring Systems Engineers for its digital transformation projects.', package_lpa: 7.00, location: 'Multiple Locations', required_percentage: 60.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering,Mechanical Engineering', required_year: '4', available_seats: 100, number_of_rounds: 3, drive_date: '2026-05-20', last_date: '2026-12-30' },
    { company_name: 'Infosys', job_role: 'Systems Engineer', description: 'Infosys is recruiting fresh graduates for its Systems Engineer role.', package_lpa: 6.50, location: 'Pune', required_percentage: 60.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering', required_year: '4', available_seats: 80, number_of_rounds: 3, drive_date: '2026-05-25', last_date: '2026-12-30' },
    { company_name: 'Wipro', job_role: 'Project Engineer', description: 'Wipro is hiring Project Engineers for its WILP program.', package_lpa: 6.00, location: 'Bangalore', required_percentage: 60.00, allowed_backlogs: 1, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering,Mechanical Engineering', required_year: '4', available_seats: 60, number_of_rounds: 2, drive_date: '2026-05-28', last_date: '2026-12-30' },
    { company_name: 'Cognizant', job_role: 'Programmer Analyst Trainee', description: 'Cognizant is hiring Programmer Analyst Trainees.', package_lpa: 5.00, location: 'Chennai', required_percentage: 60.00, allowed_backlogs: 1, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering', required_year: '4', available_seats: 50, number_of_rounds: 2, drive_date: '2026-06-02', last_date: '2026-12-30' },
    { company_name: 'Accenture', job_role: 'Associate Software Engineer', description: 'Accenture is looking for Associate Software Engineers to join its Technology division.', package_lpa: 8.00, location: 'Hyderabad', required_percentage: 60.00, allowed_backlogs: 2, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering', required_year: '4', available_seats: 40, number_of_rounds: 3, drive_date: '2026-06-05', last_date: '2026-12-30' },
    { company_name: 'Capgemini', job_role: 'Analyst', description: 'Capgemini is hiring Analysts for its technology and consulting practice.', package_lpa: 7.50, location: 'Mumbai', required_percentage: 60.00, allowed_backlogs: 2, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering,Mechanical Engineering', required_year: '4', available_seats: 45, number_of_rounds: 2, drive_date: '2026-06-08', last_date: '2026-12-30' },
    { company_name: 'HCL Technologies', job_role: 'Graduate Engineer Trainee', description: 'HCL Technologies is hiring Graduate Engineer Trainees.', package_lpa: 6.00, location: 'Noida', required_percentage: 60.00, allowed_backlogs: 1, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering', required_year: '4', available_seats: 35, number_of_rounds: 2, drive_date: '2026-06-12', last_date: '2026-12-30' },
    { company_name: 'Deloitte', job_role: 'Analyst - Technology', description: 'Deloitte is hiring Technology Analysts for its consulting and advisory practice.', package_lpa: 12.00, location: 'Hyderabad', required_percentage: 65.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology', required_year: '4', available_seats: 20, number_of_rounds: 3, drive_date: '2026-06-18', last_date: '2026-12-30' },
    { company_name: 'IBM', job_role: 'Application Developer', description: 'IBM is hiring Application Developers for its cloud and AI division.', package_lpa: 10.00, location: 'Bangalore', required_percentage: 65.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering', required_year: '4', available_seats: 30, number_of_rounds: 3, drive_date: '2026-06-22', last_date: '2026-12-30' },
    { company_name: 'Oracle', job_role: 'Applications Engineer', description: 'Oracle is hiring Applications Engineers to work on Oracle Cloud ERP, HCM, and SCM products.', package_lpa: 18.00, location: 'Hyderabad', required_percentage: 70.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology', required_year: '4', available_seats: 15, number_of_rounds: 4, drive_date: '2026-07-01', last_date: '2026-12-30' },
    { company_name: 'Zoho', job_role: 'Member Technical Staff', description: 'Zoho is hiring for its product engineering team.', package_lpa: 14.00, location: 'Chennai', required_percentage: 65.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology', required_year: '4', available_seats: 25, number_of_rounds: 3, drive_date: '2026-07-05', last_date: '2026-12-30' },
    { company_name: 'Flipkart', job_role: 'Software Development Engineer', description: "Flipkart is hiring SDEs for its supply chain, payments, and platform teams.", package_lpa: 28.00, location: 'Bangalore', required_percentage: 70.00, allowed_backlogs: 0, required_branch: 'Computer Science Engineering,Information Technology', required_year: '4', available_seats: 10, number_of_rounds: 4, drive_date: '2026-07-10', last_date: '2026-12-30' },
];

async function seedDrives() {
    console.log('\n🌱 Seeding 15 job drives into Supabase...\n');

    // Get first officer
    const { data: officers, error: oErr } = await supabase
        .from('officers')
        .select('officer_id')
        .limit(1);

    if (oErr || !officers || !officers.length) {
        console.error('❌ No officers found. Run supabase_seed_officer.js first.');
        process.exit(1);
    }

    const officerId = officers[0].officer_id;
    let inserted = 0, skipped = 0;

    for (const d of DRIVES) {
        try {
            // Check duplicate
            const { data: existing } = await supabase
                .from('job_drives')
                .select('drive_id')
                .eq('company_name', d.company_name)
                .eq('job_role', d.job_role)
                .limit(1);

            if (existing && existing.length > 0) {
                console.log(`   ⏭  SKIP  ${d.company_name} — ${d.job_role}`);
                skipped++;
                continue;
            }

            const { error } = await supabase
                .from('job_drives')
                .insert([{ ...d, created_by: officerId }]);

            if (error) throw error;

            console.log(`   ✅  ${d.company_name} — ${d.job_role} (${d.package_lpa} LPA)`);
            inserted++;
        } catch (err) {
            console.error(`   ❌  FAIL  ${d.company_name} — ${err.message}`);
        }
    }

    console.log(`\n✅ Done! ${inserted} drives inserted, ${skipped} skipped.\n`);
}

seedDrives().catch(err => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});
