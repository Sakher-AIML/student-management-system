# Smart Student Management System

A complete beginner-friendly college project built with HTML, CSS, JavaScript, PHP, and MySQL.

This repository now contains both development phases:

- Phase 1 (Frontend Demo): fully browser-based (no server required)
- Phase 2 (Backend Upgrade): full PHP + MySQL implementation for XAMPP

This structure lets you demonstrate the project even when PHP is not available, and later run the complete backend version for final submission.

## Development Phases

### Phase 1 - Frontend Demo (Completed)

- File entry: index.html
- Uses: HTML + CSS + JavaScript + localStorage
- Modules: login, dashboard, students, subjects, attendance, marks, report, tools
- Demo login roles:
	- Admin (full access): admin / admin123
	- Viewer (read-only): any other username/password

### Phase 1 Owner Features (Expanded)

- Add, edit, delete students with instant refresh
- Search students by roll number, name, course, or semester
- Add, edit, delete subjects
- Attendance tracking by student + subject + date
- Attendance toggle and delete actions
- Marks tracking with auto grade preview
- Marks update by unique student + subject + exam type
- Student report generation with print and CSV export
- Full backup export/import in JSON
- Browser localStorage persistence

### Phase 2 - PHP + MySQL Backend (Completed)

- File entry: login.php (or index.php)
- Uses: PHP + MySQL (database.sql)
- Includes admin auth, student CRUD, attendance, marks, reports
- Ready to run using XAMPP

## Live on GitHub Pages

GitHub Pages can host only static files. This repository uses index.html as the Phase 1 frontend demo for online preview.

The full Phase 2 application is PHP + MySQL based, so it must run on a local or remote PHP server (for example XAMPP).

## Project Highlights

- Admin login with session-based authentication
- Dashboard with summary statistics
- Student registration and full CRUD operations
- Student search by roll number, name, and course
- Subject and course management
- Attendance management
- Marks and grade management
- Student-wise report generation with print support

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: PHP (MySQLi)
- Database: MySQL
- Local server: XAMPP (Apache + MySQL)

## Folder Structure

```text
SSMS/
├── index.html            # Phase 1 frontend demo (runs without server)
├── index.php             # Phase 2 PHP entry (redirect to login/dashboard)
├── login.php
├── logout.php
├── dashboard.php
├── add_student.php
├── view_students.php
├── edit_student.php
├── delete_student.php
├── subjects.php
├── attendance.php
├── add_marks.php
├── report.php
├── db_connect.php
├── database.sql
├── style.css
├── script.js
├── README.md
└── LICENSE
```

## Database Design

The project uses these main tables:

- admins
- students
- subjects
- attendance
- marks

Foreign keys are used in attendance and marks tables to keep student and subject references valid.

## Local Setup Guide (XAMPP)

1. Install XAMPP.
2. Start Apache and MySQL from the XAMPP control panel.
3. Copy this folder into xampp/htdocs.
4. Open phpMyAdmin: http://localhost/phpmyadmin
5. Import database.sql.
6. Open the app in browser:
	- http://localhost/SSMS/login.php

### Run Phase 1 Without Server

If you only want the frontend demo:

1. Open index.html directly in your browser.
2. Login with admin / admin123.
3. Demo data is stored in localStorage.
4. Use the Tools tab to export backup JSON anytime.

### Default Admin Credentials

- Username: admin
- Password: admin123

## How to Enable GitHub Pages

1. Open repository settings on GitHub.
2. Go to Pages.
3. In Build and deployment, choose:
	- Source: Deploy from a branch
	- Branch: main
	- Folder: /(root)
4. Save settings.

GitHub Pages will publish index.html.

## Important Note About Hosting

If you open the GitHub Pages URL, you will see the static project landing page only.

PHP pages like login.php, dashboard.php, and other backend modules cannot run on GitHub Pages.
To run the complete system online, use a PHP-enabled host (for example, cPanel hosting, Render with PHP runtime, Railway, or VPS).

## Core Modules Explained

### 1. Admin Login
- Validates admin credentials
- Starts session on successful login

### 2. Dashboard
- Displays total students, subjects, attendance today, and marks entries

### 3. Student Management
- Add new student
- View student list
- Edit student details
- Delete student records
- Search students

### 4. Subject Management
- Add and list subjects by code, name, course, semester, and max marks

### 5. Attendance Management
- Record attendance per student and subject for a date
- Update existing attendance using duplicate key handling

### 6. Marks Management
- Save marks by exam type
- Automatically calculate grade

### 7. Report Generation
- Generate student profile report
- Show attendance summary and marks summary
- Print-ready format

## File Explanation (Viva Friendly)

- index.html: Phase 1 complete frontend app UI and page sections.
- style.css: Shared styles for both Phase 1 demo and Phase 2 PHP pages.
- script.js: Phase 1 app logic and Phase 2 helper JS (validation + delete confirmation).
- db_connect.php: Database connection, session start, and helper auth functions.
- login.php: Admin login page and credential verification.
- dashboard.php: Main admin dashboard with summary counts.
- add_student.php: Student registration form and insert logic.
- view_students.php: Student listing and search.
- edit_student.php: Update student details.
- delete_student.php: Delete selected student record.
- subjects.php: Add and display subjects.
- attendance.php: Save and view attendance records.
- add_marks.php: Save marks and auto-calculate grade.
- report.php: Student report view with attendance and marks summary.
- database.sql: Full schema + sample data + default admin.

## Security and Validation

- Prepared statements for database queries
- Session-based route protection
- Output escaping with htmlspecialchars
- Client-side form validation with JavaScript

## Testing Checklist

- Login test (valid and invalid credentials)
- Add student test
- Edit and delete student test
- Attendance save/update test
- Marks save and grade calculation test
- Report generation test

## Sample Data

Sample admin, students, subjects, attendance, and marks are already included in database.sql.
So after import, the project is ready for demonstration.

## License

This project is released under the LICENSE file included in this repository.
