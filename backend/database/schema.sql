-- =============================================================
--  CAMPUS RECRUITMENT SYSTEM — DATABASE SCHEMA
--  DB   : campus_recruitment  |  Engine: MySQL 8.0+
--  Note : This file creates ONLY the table structure.
--         Student data is loaded via database/seed_students.js
--         Officers are added manually via MySQL Workbench or /api/register
-- =============================================================

CREATE DATABASE IF NOT EXISTS campus_recruitment
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campus_recruitment;

-- ----------------------------------------------------------
-- 1. STUDENTS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  student_id        INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(120)     NOT NULL,
  roll_number       VARCHAR(20)      NOT NULL UNIQUE,
  email             VARCHAR(160)     NOT NULL UNIQUE,
  mobile_number     VARCHAR(15)      NOT NULL,
  branch            VARCHAR(80)      NOT NULL,
  year              TINYINT UNSIGNED NOT NULL COMMENT '1 = 1st year … 4 = 4th year',
  percentage        DECIMAL(5,2)     NOT NULL COMMENT 'CGPA or percentage',
  backlogs          TINYINT UNSIGNED NOT NULL DEFAULT 0,
  password          VARCHAR(255)     NOT NULL COMMENT 'bcrypt hash',
  role              ENUM('student')  NOT NULL DEFAULT 'student',
  profile_complete  BOOLEAN          NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_branch (branch),
  INDEX idx_year   (year),
  INDEX idx_perc   (percentage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 2. OFFICERS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS officers (
  officer_id    INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120)    NOT NULL,
  email         VARCHAR(160)    NOT NULL UNIQUE,
  mobile_number VARCHAR(15)     NOT NULL,
  employee_id   VARCHAR(30)     NOT NULL UNIQUE,
  department    VARCHAR(100)    NOT NULL DEFAULT 'Training & Placement',
  password      VARCHAR(255)    NOT NULL COMMENT 'bcrypt hash',
  role          ENUM('officer') NOT NULL DEFAULT 'officer',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 3. JOB DRIVES
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_drives (
  drive_id            INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  company_name        VARCHAR(120)     NOT NULL,
  job_role            VARCHAR(120)     NOT NULL,
  description         TEXT,
  package_lpa         DECIMAL(6,2)     NOT NULL COMMENT 'Package in LPA',
  location            VARCHAR(100)     NOT NULL,
  required_percentage DECIMAL(5,2)     NOT NULL COMMENT 'Min CGPA or % required',
  allowed_backlogs    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  required_branch     VARCHAR(500)     NOT NULL COMMENT 'Comma-separated branch names',
  required_year       VARCHAR(50)      NOT NULL COMMENT 'Comma-separated years e.g. 3,4',
  available_seats     SMALLINT UNSIGNED        DEFAULT NULL,
  number_of_rounds    TINYINT UNSIGNED         DEFAULT NULL,
  drive_date          DATE             NOT NULL,
  last_date           DATE             NOT NULL COMMENT 'Application deadline',
  is_active           BOOLEAN          NOT NULL DEFAULT TRUE,
  created_by          INT UNSIGNED     NOT NULL,
  created_at          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_drive_officer FOREIGN KEY (created_by) REFERENCES officers(officer_id) ON DELETE CASCADE,
  INDEX idx_active     (is_active),
  INDEX idx_deadline   (last_date),
  INDEX idx_drive_date (drive_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 4. APPLICATIONS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
  application_id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id           INT UNSIGNED NOT NULL,
  drive_id             INT UNSIGNED NOT NULL,
  application_status   ENUM('Pending','Shortlisted','Selected','Rejected') NOT NULL DEFAULT 'Pending',
  eligibility_verified BOOLEAN      NOT NULL DEFAULT FALSE,
  officer_notes        TEXT,
  applied_date         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(student_id)  ON DELETE CASCADE,
  CONSTRAINT fk_app_drive   FOREIGN KEY (drive_id)   REFERENCES job_drives(drive_id)  ON DELETE CASCADE,
  UNIQUE KEY uq_student_drive (student_id, drive_id),
  INDEX idx_status   (application_status),
  INDEX idx_drive_id (drive_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 5. QUIZ_RESULTS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_results (
  quiz_id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id   INT UNSIGNED NOT NULL,
  quiz_name    VARCHAR(120) NOT NULL DEFAULT 'General Quiz',
  score        SMALLINT     NOT NULL DEFAULT 0,
  total_marks  SMALLINT     NOT NULL DEFAULT 100,
  passed       BOOLEAN      NOT NULL DEFAULT FALSE,
  time_taken   SMALLINT UNSIGNED     COMMENT 'Seconds taken to complete',
  attempt_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quiz_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_quiz_student (student_id),
  INDEX idx_quiz_date    (attempt_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 6. CODING_RESULTS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS coding_results (
  coding_id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      INT UNSIGNED NOT NULL,
  contest_name    VARCHAR(120) NOT NULL DEFAULT 'Coding Contest',
  problem_id      INT UNSIGNED NOT NULL DEFAULT 0,
  problem_title   VARCHAR(200),
  score           SMALLINT     NOT NULL DEFAULT 0,
  max_score       SMALLINT     NOT NULL DEFAULT 100,
  language        VARCHAR(30)  NOT NULL DEFAULT 'Python',
  submission_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_coding_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_coding_student (student_id),
  INDEX idx_contest        (contest_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 7. PERFORMANCE  (Aggregated — auto-updated on quiz/coding submit)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS performance (
  performance_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id         INT UNSIGNED NOT NULL UNIQUE,
  total_quiz_score   FLOAT        NOT NULL DEFAULT 0,
  quiz_attempts      INT UNSIGNED NOT NULL DEFAULT 0,
  avg_quiz_score     FLOAT        NOT NULL DEFAULT 0,
  total_coding_score FLOAT        NOT NULL DEFAULT 0,
  coding_submissions INT UNSIGNED NOT NULL DEFAULT 0,
  overall_rank       INT UNSIGNED          DEFAULT NULL,
  last_updated       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_perf_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 8. REFRESH_TOKENS  (for future JWT token rotation)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  user_role  ENUM('student','officer') NOT NULL,
  token      VARCHAR(500) NOT NULL,
  expires_at DATETIME     NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- NOTE: No seed data here. All student data is loaded via:
--       node database/seed_students.js
-- Officers are created via /api/register or MySQL Workbench.
-- =============================================================
