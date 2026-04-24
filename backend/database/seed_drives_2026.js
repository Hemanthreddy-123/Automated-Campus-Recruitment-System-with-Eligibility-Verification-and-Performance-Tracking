// database/seed_drives_2026.js
// Inserts 15 realistic job drives with future dates (2026)
// Safe: only INSERTs, does NOT touch existing rows

require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

const OFFICER_ID = 1; // Dr. S. Krishnan

const DRIVES = [
  {
    company_name: 'Google',
    job_role: 'Software Engineer',
    description: 'Join Google as a Software Engineer. Work on large-scale distributed systems, search infrastructure, and cutting-edge products used by billions.',
    package_lpa: 45.00,
    location: 'Hyderabad',
    required_percentage: 70.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering',
    required_year: '4',
    available_seats: 20,
    number_of_rounds: 5,
    drive_date: '2026-06-10',
    last_date: '2026-05-30',
  },
  {
    company_name: 'Microsoft',
    job_role: 'Software Development Engineer',
    description: 'Microsoft is hiring SDEs to build next-generation cloud services on Azure. Work with world-class engineers on products like Office 365, Teams, and Azure.',
    package_lpa: 40.00,
    location: 'Hyderabad',
    required_percentage: 65.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology',
    required_year: '4',
    available_seats: 15,
    number_of_rounds: 4,
    drive_date: '2026-06-15',
    last_date: '2026-06-05',
  },
  {
    company_name: 'Amazon',
    job_role: 'SDE-1',
    description: 'Amazon is looking for passionate engineers to join AWS and e-commerce teams. You will design, build, and maintain scalable backend services.',
    package_lpa: 32.00,
    location: 'Bangalore',
    required_percentage: 65.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering',
    required_year: '4',
    available_seats: 25,
    number_of_rounds: 4,
    drive_date: '2026-06-20',
    last_date: '2026-06-10',
  },
  {
    company_name: 'TCS',
    job_role: 'Systems Engineer',
    description: 'TCS is hiring Systems Engineers for its digital transformation projects. Freshers will undergo 3-month training before project allocation.',
    package_lpa: 7.00,
    location: 'Multiple Locations',
    required_percentage: 60.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering,Mechanical Engineering',
    required_year: '4',
    available_seats: 100,
    number_of_rounds: 3,
    drive_date: '2026-05-20',
    last_date: '2026-05-10',
  },
  {
    company_name: 'Infosys',
    job_role: 'Systems Engineer',
    description: 'Infosys is recruiting fresh graduates for its Systems Engineer role. Selected candidates will work on enterprise software projects across domains.',
    package_lpa: 6.50,
    location: 'Pune',
    required_percentage: 60.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering',
    required_year: '4',
    available_seats: 80,
    number_of_rounds: 3,
    drive_date: '2026-05-25',
    last_date: '2026-05-15',
  },
  {
    company_name: 'Wipro',
    job_role: 'Project Engineer',
    description: 'Wipro is hiring Project Engineers for its WILP (Work Integrated Learning Program). Candidates will work on live projects from day one.',
    package_lpa: 6.00,
    location: 'Bangalore',
    required_percentage: 60.00,
    allowed_backlogs: 1,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering,Mechanical Engineering',
    required_year: '4',
    available_seats: 60,
    number_of_rounds: 2,
    drive_date: '2026-05-28',
    last_date: '2026-05-18',
  },
  {
    company_name: 'Cognizant',
    job_role: 'Programmer Analyst Trainee',
    description: 'Cognizant is hiring Programmer Analyst Trainees. You will be trained in latest technologies and deployed on client projects globally.',
    package_lpa: 5.00,
    location: 'Chennai',
    required_percentage: 60.00,
    allowed_backlogs: 1,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering',
    required_year: '4',
    available_seats: 50,
    number_of_rounds: 2,
    drive_date: '2026-06-02',
    last_date: '2026-05-22',
  },
  {
    company_name: 'Accenture',
    job_role: 'Associate Software Engineer',
    description: 'Accenture is looking for Associate Software Engineers to join its Technology division. Work on digital, cloud, and AI projects for global clients.',
    package_lpa: 8.00,
    location: 'Hyderabad',
    required_percentage: 60.00,
    allowed_backlogs: 2,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering',
    required_year: '4',
    available_seats: 40,
    number_of_rounds: 3,
    drive_date: '2026-06-05',
    last_date: '2026-05-25',
  },
  {
    company_name: 'Capgemini',
    job_role: 'Analyst',
    description: 'Capgemini is hiring Analysts for its technology and consulting practice. Freshers will be trained in cloud, data, and digital technologies.',
    package_lpa: 7.50,
    location: 'Mumbai',
    required_percentage: 60.00,
    allowed_backlogs: 2,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering,Mechanical Engineering',
    required_year: '4',
    available_seats: 45,
    number_of_rounds: 2,
    drive_date: '2026-06-08',
    last_date: '2026-05-28',
  },
  {
    company_name: 'HCL Technologies',
    job_role: 'Graduate Engineer Trainee',
    description: 'HCL Technologies is hiring Graduate Engineer Trainees for its IT services division. Selected candidates will work on enterprise and product engineering.',
    package_lpa: 6.00,
    location: 'Noida',
    required_percentage: 60.00,
    allowed_backlogs: 1,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering,Electrical Engineering',
    required_year: '4',
    available_seats: 35,
    number_of_rounds: 2,
    drive_date: '2026-06-12',
    last_date: '2026-06-01',
  },
  {
    company_name: 'Deloitte',
    job_role: 'Analyst - Technology',
    description: 'Deloitte is hiring Technology Analysts for its consulting and advisory practice. Work on digital transformation projects for Fortune 500 clients.',
    package_lpa: 12.00,
    location: 'Hyderabad',
    required_percentage: 65.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology',
    required_year: '4',
    available_seats: 20,
    number_of_rounds: 3,
    drive_date: '2026-06-18',
    last_date: '2026-06-08',
  },
  {
    company_name: 'IBM',
    job_role: 'Application Developer',
    description: 'IBM is hiring Application Developers for its cloud and AI division. Work on IBM Cloud, Watson AI, and enterprise software solutions.',
    package_lpa: 10.00,
    location: 'Bangalore',
    required_percentage: 65.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology,Electronics and Communication Engineering',
    required_year: '4',
    available_seats: 30,
    number_of_rounds: 3,
    drive_date: '2026-06-22',
    last_date: '2026-06-12',
  },
  {
    company_name: 'Oracle',
    job_role: 'Applications Engineer',
    description: 'Oracle is hiring Applications Engineers to work on Oracle Cloud ERP, HCM, and SCM products. Strong Java and SQL skills required.',
    package_lpa: 18.00,
    location: 'Hyderabad',
    required_percentage: 70.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology',
    required_year: '4',
    available_seats: 15,
    number_of_rounds: 4,
    drive_date: '2026-07-01',
    last_date: '2026-06-20',
  },
  {
    company_name: 'Zoho',
    job_role: 'Member Technical Staff',
    description: 'Zoho is hiring for its product engineering team. Work on Zoho CRM, Zoho Books, and other SaaS products used by 80 million users worldwide.',
    package_lpa: 14.00,
    location: 'Chennai',
    required_percentage: 65.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology',
    required_year: '4',
    available_seats: 25,
    number_of_rounds: 3,
    drive_date: '2026-07-05',
    last_date: '2026-06-25',
  },
  {
    company_name: 'Flipkart',
    job_role: 'Software Development Engineer',
    description: 'Flipkart is hiring SDEs for its supply chain, payments, and platform teams. Work on India\'s largest e-commerce platform serving 400 million customers.',
    package_lpa: 28.00,
    location: 'Bangalore',
    required_percentage: 70.00,
    allowed_backlogs: 0,
    required_branch: 'Computer Science Engineering,Information Technology',
    required_year: '4',
    available_seats: 10,
    number_of_rounds: 4,
    drive_date: '2026-07-10',
    last_date: '2026-06-30',
  },
];

async function run() {
  try {
    console.log(`📥 Inserting ${DRIVES.length} job drives...`);
    let inserted = 0;
    for (const d of DRIVES) {
      await pool.query(
        `INSERT INTO job_drives
          (company_name, job_role, description, package_lpa, location,
           required_percentage, allowed_backlogs, required_branch, required_year,
           available_seats, number_of_rounds, drive_date, last_date, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          d.company_name, d.job_role, d.description, d.package_lpa, d.location,
          d.required_percentage, d.allowed_backlogs, d.required_branch, d.required_year,
          d.available_seats, d.number_of_rounds, d.drive_date, d.last_date, OFFICER_ID,
        ]
      );
      inserted++;
      console.log(`  ✅ ${d.company_name} — ${d.job_role} (${d.package_lpa} LPA)`);
    }

    const [total] = await pool.query("SELECT COUNT(*) AS cnt FROM job_drives WHERE last_date >= CURDATE() AND is_active = 1");
    console.log(`\n🎉 Done! ${inserted} drives inserted.`);
    console.log(`📊 Active drives visible in API: ${total[0].cnt}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
