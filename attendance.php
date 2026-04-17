<?php
require_once 'db_connect.php';
require_login();

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $studentId = (int) ($_POST['student_id'] ?? 0);
    $subjectId = (int) ($_POST['subject_id'] ?? 0);
    $attendanceDate = trim($_POST['attendance_date'] ?? '');
    $status = trim($_POST['status'] ?? 'Present');
    $remarks = trim($_POST['remarks'] ?? '');

    if ($studentId <= 0 || $subjectId <= 0 || $attendanceDate === '' || $status === '') {
        $error = 'Please fill all required fields.';
    } else {
        $stmt = $conn->prepare(
            'INSERT INTO attendance (student_id, subject_id, attendance_date, status, remarks) VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)'
        );
        $stmt->bind_param('iisss', $studentId, $subjectId, $attendanceDate, $status, $remarks);

        if ($stmt->execute()) {
            $message = 'Attendance saved successfully.';
        } else {
            $error = 'Could not save attendance.';
        }

        $stmt->close();
    }
}

$students = $conn->query('SELECT student_id, roll_no, first_name, last_name FROM students ORDER BY roll_no ASC');
$subjects = $conn->query('SELECT subject_id, subject_code, subject_name FROM subjects ORDER BY subject_code ASC');

$attendanceList = $conn->query(
    'SELECT a.attendance_id, a.attendance_date, a.status, a.remarks,
            s.roll_no, s.first_name, s.last_name,
            sub.subject_code, sub.subject_name
     FROM attendance a
     INNER JOIN students s ON a.student_id = s.student_id
     INNER JOIN subjects sub ON a.subject_id = sub.subject_id
     ORDER BY a.attendance_date DESC, a.attendance_id DESC
     LIMIT 100'
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Attendance Management</h2>
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
        <a href="attendance.php" class="active">Attendance</a>
        <a href="add_marks.php">Marks</a>
        <a href="report.php">Reports</a>
    </nav>

    <main class="container">
        <h1>Attendance Management</h1>

        <?php if ($message !== ''): ?>
            <div class="alert alert-success"><?php echo h($message); ?></div>
        <?php endif; ?>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?php echo h($error); ?></div>
        <?php endif; ?>

        <form method="post" class="card form-grid needs-validation" novalidate>
            <div>
                <label for="student_id">Student *</label>
                <select id="student_id" name="student_id" required>
                    <option value="">Select Student</option>
                    <?php if ($students): ?>
                        <?php while ($student = $students->fetch_assoc()): ?>
                            <option value="<?php echo (int) $student['student_id']; ?>" <?php echo ((int) ($_POST['student_id'] ?? 0) === (int) $student['student_id']) ? 'selected' : ''; ?>>
                                <?php echo h($student['roll_no'] . ' - ' . $student['first_name'] . ' ' . $student['last_name']); ?>
                            </option>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </select>
            </div>
            <div>
                <label for="subject_id">Subject *</label>
                <select id="subject_id" name="subject_id" required>
                    <option value="">Select Subject</option>
                    <?php if ($subjects): ?>
                        <?php while ($subject = $subjects->fetch_assoc()): ?>
                            <option value="<?php echo (int) $subject['subject_id']; ?>" <?php echo ((int) ($_POST['subject_id'] ?? 0) === (int) $subject['subject_id']) ? 'selected' : ''; ?>>
                                <?php echo h($subject['subject_code'] . ' - ' . $subject['subject_name']); ?>
                            </option>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </select>
            </div>
            <div>
                <label for="attendance_date">Date *</label>
                <input type="date" id="attendance_date" name="attendance_date" value="<?php echo h($_POST['attendance_date'] ?? date('Y-m-d')); ?>" required>
            </div>
            <div>
                <label for="status">Status *</label>
                <select id="status" name="status" required>
                    <option value="Present" <?php echo (($_POST['status'] ?? 'Present') === 'Present') ? 'selected' : ''; ?>>Present</option>
                    <option value="Absent" <?php echo (($_POST['status'] ?? '') === 'Absent') ? 'selected' : ''; ?>>Absent</option>
                    <option value="Late" <?php echo (($_POST['status'] ?? '') === 'Late') ? 'selected' : ''; ?>>Late</option>
                </select>
            </div>
            <div class="full-width">
                <label for="remarks">Remarks</label>
                <textarea id="remarks" name="remarks" rows="2"><?php echo h($_POST['remarks'] ?? ''); ?></textarea>
            </div>
            <div class="full-width">
                <button type="submit" class="btn btn-primary">Save Attendance</button>
            </div>
        </form>

        <div class="card table-wrapper">
            <h3>Recent Attendance Records</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Roll No</th>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($attendanceList && $attendanceList->num_rows > 0): ?>
                        <?php while ($row = $attendanceList->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo h($row['attendance_date']); ?></td>
                                <td><?php echo h($row['roll_no']); ?></td>
                                <td><?php echo h($row['first_name'] . ' ' . $row['last_name']); ?></td>
                                <td><?php echo h($row['subject_code'] . ' - ' . $row['subject_name']); ?></td>
                                <td><?php echo h($row['status']); ?></td>
                                <td><?php echo h($row['remarks']); ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6">No attendance records found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
