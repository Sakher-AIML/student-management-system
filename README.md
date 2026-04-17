# Smart Student Management System

A complete beginner-friendly college project built with HTML, CSS, JavaScript, PHP, and MySQL.

This project helps manage student records in one place with modules for registration, attendance, marks, subjects, and report generation.

## Live on GitHub Pages

GitHub Pages can host only static files. This repository includes a static landing page at index.html for online viewing.

The full web application is PHP + MySQL based, so it must run on a local or remote PHP server (for example XAMPP).

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
├── index.html            # Static landing page for GitHub Pages
├── index.php             # Redirect to login/dashboard (PHP app)
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
