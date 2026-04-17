-- Smart Student Management System Database
-- Import this file in phpMyAdmin

CREATE DATABASE IF NOT EXISTS smart_student_db;
USE smart_student_db;

DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    dob DATE,
    email VARCHAR(100),
    phone VARCHAR(15),
    course VARCHAR(100) NOT NULL,
    year_sem VARCHAR(30) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    subject_name VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    semester VARCHAR(30) NOT NULL,
    max_marks INT NOT NULL DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
    remarks VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (student_id, subject_id, attendance_date),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attendance_subject FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100,
    grade VARCHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_marks (student_id, subject_id, exam_type),
    CONSTRAINT fk_marks_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_marks_subject FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Default login:
-- Username: admin
-- Password: admin123
INSERT INTO admins (username, password, full_name)
VALUES ('admin', SHA2('admin123', 256), 'System Administrator');

INSERT INTO students (roll_no, first_name, last_name, gender, dob, email, phone, course, year_sem, address) VALUES
('CSE101', 'Aarav', 'Sharma', 'Male', '2005-04-12', 'aarav.sharma@example.com', '9876543210', 'BSc Computer Science', 'Semester 1', 'Delhi'),
('CSE102', 'Diya', 'Patel', 'Female', '2004-11-30', 'diya.patel@example.com', '9876543211', 'BSc Computer Science', 'Semester 1', 'Ahmedabad'),
('CSE103', 'Rahul', 'Verma', 'Male', '2005-01-20', 'rahul.verma@example.com', '9876543212', 'BSc Computer Science', 'Semester 1', 'Lucknow'),
('CSE104', 'Sneha', 'Iyer', 'Female', '2004-08-18', 'sneha.iyer@example.com', '9876543213', 'BSc Computer Science', 'Semester 1', 'Chennai'),
('CSE105', 'Kabir', 'Khan', 'Male', '2005-06-07', 'kabir.khan@example.com', '9876543214', 'BSc Computer Science', 'Semester 1', 'Mumbai');

INSERT INTO subjects (subject_code, subject_name, course, semester, max_marks) VALUES
('CS101', 'Programming Fundamentals', 'BSc Computer Science', 'Semester 1', 100),
('CS102', 'Database Management System', 'BSc Computer Science', 'Semester 1', 100),
('CS103', 'Web Development Basics', 'BSc Computer Science', 'Semester 1', 100),
('CS104', 'Mathematics for Computing', 'BSc Computer Science', 'Semester 1', 100);

INSERT INTO attendance (student_id, subject_id, attendance_date, status, remarks) VALUES
(1, 1, '2026-04-10', 'Present', NULL),
(2, 1, '2026-04-10', 'Absent', 'Medical leave'),
(3, 1, '2026-04-10', 'Present', NULL),
(4, 1, '2026-04-10', 'Late', 'Arrived 10 minutes late'),
(5, 1, '2026-04-10', 'Present', NULL),
(1, 2, '2026-04-11', 'Present', NULL),
(2, 2, '2026-04-11', 'Present', NULL),
(3, 2, '2026-04-11', 'Absent', 'Family function');

INSERT INTO marks (student_id, subject_id, exam_type, marks_obtained, max_marks, grade) VALUES
(1, 1, 'Internal-1', 86, 100, 'A'),
(2, 1, 'Internal-1', 74, 100, 'B'),
(3, 1, 'Internal-1', 91, 100, 'A+'),
(4, 2, 'Internal-1', 68, 100, 'C'),
(5, 3, 'Internal-1', 79, 100, 'B');
