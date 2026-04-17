<?php
require_once 'db_connect.php';
require_login();

$studentId = (int) ($_GET['student_id'] ?? 0);
$students = $conn->query('SELECT student_id, roll_no, first_name, last_name FROM students ORDER BY roll_no ASC');

$studentInfo = null;
$attendanceSummary = [];
$marksSummary = [];

if ($studentId > 0) {
    $stmtStudent = $conn->prepare('SELECT * FROM students WHERE student_id = ?');
    $stmtStudent->bind_param('i', $studentId);
    $stmtStudent->execute();
    $studentInfo = $stmtStudent->get_result()->fetch_assoc();
    $stmtStudent->close();

    if ($studentInfo) {
        $stmtAttendance = $conn->prepare(
            'SELECT
                SUM(CASE WHEN status = "Present" THEN 1 ELSE 0 END) AS present_count,
                SUM(CASE WHEN status = "Absent" THEN 1 ELSE 0 END) AS absent_count,
                SUM(CASE WHEN status = "Late" THEN 1 ELSE 0 END) AS late_count,
                COUNT(*) AS total_count
             FROM attendance
             WHERE student_id = ?'
        );
        $stmtAttendance->bind_param('i', $studentId);
        $stmtAttendance->execute();
        $attendanceSummary = $stmtAttendance->get_result()->fetch_assoc() ?: [];
        $stmtAttendance->close();

        $stmtMarks = $conn->prepare(
            'SELECT sub.subject_code, sub.subject_name, m.exam_type, m.marks_obtained, m.max_marks, m.grade
             FROM marks m
             INNER JOIN subjects sub ON m.subject_id = sub.subject_id
             WHERE m.student_id = ?
             ORDER BY sub.subject_code, m.exam_type'
        );
        $stmtMarks->bind_param('i', $studentId);
        $stmtMarks->execute();
        $marksSummary = $stmtMarks->get_result();
        $stmtMarks->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Student Reports</h2>
        <div class="topbar-right">
            <span><?php echo h($_SESSION['admin_name'] ?? 'Admin'); ?></span>
            <a href="logout.php" class="btn btn-secondary">Logout</a>
        </div>
    </header>

    <nav class="navbar">
        <a href="dashboard.php">Dashboard</a>
        <a href="add_student.php">Add Student</a>
        <a href="view_students.php">View Students</a>
        <a href="subjects.php">Subjects</a>
        <a href="attendance.php">Attendance</a>
        <a href="add_marks.php">Marks</a>
        <a href="report.php" class="active">Reports</a>
    </nav>

    <main class="container">
        <h1>Student Report Generation</h1>

        <form method="get" class="card search-row">
            <select name="student_id" required>
                <option value="">Select Student</option>
                <?php if ($students): ?>
                    <?php while ($student = $students->fetch_assoc()): ?>
                        <option value="<?php echo (int) $student['student_id']; ?>" <?php echo $studentId === (int) $student['student_id'] ? 'selected' : ''; ?>>
                            <?php echo h($student['roll_no'] . ' - ' . $student['first_name'] . ' ' . $student['last_name']); ?>
                        </option>
                    <?php endwhile; ?>
                <?php endif; ?>
            </select>
            <button type="submit" class="btn btn-primary">Generate</button>
        </form>

        <?php if ($studentInfo): ?>
            <section class="card">
                <h3>Student Profile</h3>
                <p><strong>Roll No:</strong> <?php echo h($studentInfo['roll_no']); ?></p>
                <p><strong>Name:</strong> <?php echo h($studentInfo['first_name'] . ' ' . $studentInfo['last_name']); ?></p>
                <p><strong>Course:</strong> <?php echo h($studentInfo['course']); ?></p>
                <p><strong>Year/Semester:</strong> <?php echo h($studentInfo['year_sem']); ?></p>
                <p><strong>Email:</strong> <?php echo h($studentInfo['email']); ?></p>
            </section>

            <section class="card">
                <h3>Attendance Summary</h3>
                <?php
                $present = (int) ($attendanceSummary['present_count'] ?? 0);
                $absent = (int) ($attendanceSummary['absent_count'] ?? 0);
                $late = (int) ($attendanceSummary['late_count'] ?? 0);
                $total = (int) ($attendanceSummary['total_count'] ?? 0);
                $percentage = $total > 0 ? round(($present / $total) * 100, 2) : 0;
                ?>
                <p><strong>Total Classes:</strong> <?php echo $total; ?></p>
                <p><strong>Present:</strong> <?php echo $present; ?></p>
                <p><strong>Absent:</strong> <?php echo $absent; ?></p>
                <p><strong>Late:</strong> <?php echo $late; ?></p>
                <p><strong>Attendance Percentage:</strong> <?php echo $percentage; ?>%</p>
            </section>

            <section class="card table-wrapper">
                <h3>Marks Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Exam</th>
                            <th>Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($marksSummary && $marksSummary->num_rows > 0): ?>
                            <?php while ($row = $marksSummary->fetch_assoc()): ?>
                                <tr>
                                    <td><?php echo h($row['subject_code'] . ' - ' . $row['subject_name']); ?></td>
                                    <td><?php echo h($row['exam_type']); ?></td>
                                    <td><?php echo h($row['marks_obtained'] . ' / ' . $row['max_marks']); ?></td>
                                    <td><?php echo h($row['grade']); ?></td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="4">No marks data available for this student.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </section>

            <button onclick="window.print()" class="btn btn-primary">Print Report</button>
        <?php elseif ($studentId > 0): ?>
            <div class="alert alert-error">Student not found.</div>
        <?php endif; ?>
    </main>

    <script src="script.js"></script>
</body>
</html>
