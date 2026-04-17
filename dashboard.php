<?php
require_once 'db_connect.php';
require_login();

$totalStudents = (int) ($conn->query('SELECT COUNT(*) AS total FROM students')->fetch_assoc()['total'] ?? 0);
$totalSubjects = (int) ($conn->query('SELECT COUNT(*) AS total FROM subjects')->fetch_assoc()['total'] ?? 0);
$totalMarks = (int) ($conn->query('SELECT COUNT(*) AS total FROM marks')->fetch_assoc()['total'] ?? 0);
$todayAttendance = (int) ($conn->query("SELECT COUNT(*) AS total FROM attendance WHERE attendance_date = CURDATE()")
    ->fetch_assoc()['total'] ?? 0);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Smart Student Management System</h2>
        <div class="topbar-right">
            <span>Welcome, <?php echo h($_SESSION['admin_name'] ?? 'Admin'); ?></span>
            <a href="logout.php" class="btn btn-secondary">Logout</a>
        </div>
    </header>

    <nav class="navbar">
        <a href="dashboard.php" class="active">Dashboard</a>
        <a href="add_student.php">Add Student</a>
        <a href="view_students.php">View Students</a>
        <a href="subjects.php">Subjects</a>
        <a href="attendance.php">Attendance</a>
        <a href="add_marks.php">Marks</a>
        <a href="report.php">Reports</a>
    </nav>

    <main class="container">
        <h1>Dashboard</h1>
        <p class="subtitle">Overview of student and academic records.</p>

        <section class="card-grid">
            <div class="card metric-card">
                <h3>Total Students</h3>
                <p class="metric"><?php echo $totalStudents; ?></p>
            </div>
            <div class="card metric-card">
                <h3>Total Subjects</h3>
                <p class="metric"><?php echo $totalSubjects; ?></p>
            </div>
            <div class="card metric-card">
                <h3>Attendance Today</h3>
                <p class="metric"><?php echo $todayAttendance; ?></p>
            </div>
            <div class="card metric-card">
                <h3>Marks Entries</h3>
                <p class="metric"><?php echo $totalMarks; ?></p>
            </div>
        </section>

        <section class="card">
            <h3>Quick Actions</h3>
            <div class="quick-actions">
                <a class="btn btn-primary" href="add_student.php">Register Student</a>
                <a class="btn btn-primary" href="attendance.php">Mark Attendance</a>
                <a class="btn btn-primary" href="add_marks.php">Add Marks</a>
                <a class="btn btn-primary" href="report.php">Generate Report</a>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
