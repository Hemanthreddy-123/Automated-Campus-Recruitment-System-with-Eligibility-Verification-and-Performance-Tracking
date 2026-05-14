-- =============================================================
--  CAMPUS RECRUITMENT SYSTEM — SUPABASE SCHEMA
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- 1. STUDENTS
CREATE TABLE IF NOT EXISTS students (
  student_id        SERIAL PRIMARY KEY,
  full_name         VARCHAR(120)     NOT NULL,
  roll_number       VARCHAR(20)      NOT NULL UNIQUE,
  email             VARCHAR(160)     NOT NULL UNIQUE,
  mobile_number     VARCHAR(15)      NOT NULL,
  branch            VARCHAR(80)      NOT NULL,
  year              SMALLINT         NOT NULL,
  percentage        DECIMAL(5,2)     NOT NULL,
  backlogs          SMALLINT         NOT NULL DEFAULT 0,
  password          VARCHAR(255)     NOT NULL,
  role              VARCHAR(10)      NOT NULL DEFAULT 'student',
  profile_complete  BOOLEAN          NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- 2. OFFICERS
CREATE TABLE IF NOT EXISTS officers (
  officer_id    SERIAL PRIMARY KEY,
  full_name     VARCHAR(120)    NOT NULL,
  email         VARCHAR(160)    NOT NULL UNIQUE,
  mobile_number VARCHAR(15)     NOT NULL,
  employee_id   VARCHAR(30)     NOT NULL UNIQUE,
  department    VARCHAR(100)    NOT NULL DEFAULT 'Training & Placement',
  password      VARCHAR(255)    NOT NULL,
  role          VARCHAR(10)     NOT NULL DEFAULT 'officer',
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 3. JOB DRIVES
CREATE TABLE IF NOT EXISTS job_drives (
  drive_id            SERIAL PRIMARY KEY,
  company_name        VARCHAR(120)     NOT NULL,
  job_role            VARCHAR(120)     NOT NULL,
  description         TEXT,
  package_lpa         DECIMAL(6,2)     NOT NULL,
  location            VARCHAR(100)     NOT NULL,
  required_percentage DECIMAL(5,2)     NOT NULL,
  allowed_backlogs    SMALLINT         NOT NULL DEFAULT 0,
  required_branch     VARCHAR(500)     NOT NULL,
  required_year       VARCHAR(50)      NOT NULL,
  available_seats     SMALLINT,
  number_of_rounds    SMALLINT,
  drive_date          DATE             NOT NULL,
  last_date           DATE             NOT NULL,
  is_active           BOOLEAN          NOT NULL DEFAULT TRUE,
  created_by          INT              NOT NULL REFERENCES officers(officer_id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- 4. APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
  application_id       SERIAL PRIMARY KEY,
  student_id           INT          NOT NULL REFERENCES students(student_id)  ON DELETE CASCADE,
  drive_id             INT          NOT NULL REFERENCES job_drives(drive_id)  ON DELETE CASCADE,
  application_status   VARCHAR(20)  NOT NULL DEFAULT 'Pending',
  eligibility_verified BOOLEAN      NOT NULL DEFAULT FALSE,
  officer_notes        TEXT,
  applied_date         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, drive_id)
);

-- 5. QUIZ_QUESTIONS
CREATE TABLE IF NOT EXISTS quiz_questions (
  question_id   SERIAL PRIMARY KEY,
  quiz_name     VARCHAR(120) NOT NULL DEFAULT 'General Aptitude & Technical Quiz',
  question      TEXT         NOT NULL,
  options       JSONB        NOT NULL,
  correct_index INT          NOT NULL,
  explanation   TEXT,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE
);

-- 6. QUIZ_RESULTS
CREATE TABLE IF NOT EXISTS quiz_results (
  quiz_id      SERIAL PRIMARY KEY,
  student_id   INT          NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  quiz_name    VARCHAR(120) NOT NULL DEFAULT 'General Aptitude & Technical Quiz',
  score        SMALLINT     NOT NULL DEFAULT 0,
  total_marks  SMALLINT     NOT NULL DEFAULT 100,
  passed       BOOLEAN      NOT NULL DEFAULT FALSE,
  time_taken   SMALLINT,
  attempt_date TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 7. CODING_PROBLEMS
CREATE TABLE IF NOT EXISTS coding_problems (
  problem_id      SERIAL PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  difficulty      VARCHAR(20)  NOT NULL DEFAULT 'Medium',
  max_score       SMALLINT     NOT NULL DEFAULT 100,
  description     TEXT         NOT NULL,
  examples        JSONB,
  constraints     JSONB,
  starter_python  TEXT,
  starter_java    TEXT,
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE
);

-- 8. CODING_RESULTS
CREATE TABLE IF NOT EXISTS coding_results (
  coding_id       SERIAL PRIMARY KEY,
  student_id      INT          NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  contest_name    VARCHAR(120) NOT NULL DEFAULT 'Campus Coding Championship',
  problem_id      INT          NOT NULL DEFAULT 0,
  problem_title   VARCHAR(200),
  score           SMALLINT     NOT NULL DEFAULT 0,
  max_score       SMALLINT     NOT NULL DEFAULT 100,
  language        VARCHAR(30)  NOT NULL DEFAULT 'python',
  submission_time TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 9. PERFORMANCE
CREATE TABLE IF NOT EXISTS performance (
  performance_id     SERIAL PRIMARY KEY,
  student_id         INT     NOT NULL UNIQUE REFERENCES students(student_id) ON DELETE CASCADE,
  total_quiz_score   FLOAT   NOT NULL DEFAULT 0,
  quiz_attempts      INT     NOT NULL DEFAULT 0,
  avg_quiz_score     FLOAT   NOT NULL DEFAULT 0,
  total_coding_score FLOAT   NOT NULL DEFAULT 0,
  coding_submissions INT     NOT NULL DEFAULT 0,
  overall_rank       INT,
  last_updated       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- Disable Row Level Security on all tables (for backend access)
-- Run these if you get "permission denied" errors:
-- =============================================================
ALTER TABLE students       DISABLE ROW LEVEL SECURITY;
ALTER TABLE officers       DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_drives     DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications   DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results   DISABLE ROW LEVEL SECURITY;
ALTER TABLE coding_problems DISABLE ROW LEVEL SECURITY;
ALTER TABLE coding_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance    DISABLE ROW LEVEL SECURITY;
