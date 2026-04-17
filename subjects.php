<?php
require_once 'db_connect.php';
require_login();

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $subjectCode = trim($_POST['subject_code'] ?? '');
    $subjectName = trim($_POST['subject_name'] ?? '');
    $course = trim($_POST['course'] ?? '');
    $semester = trim($_POST['semester'] ?? '');
    $maxMarks = (int) ($_POST['max_marks'] ?? 100);

    if ($subjectCode === '' || $subjectName === '' || $course === '' || $semester === '') {
        $error = 'Please fill all required fields.';
    } elseif ($maxMarks <= 0) {
        $error = 'Max marks must be greater than zero.';
    } else {
        $stmt = $conn->prepare('INSERT INTO subjects (subject_code, subject_name, course, semester, max_marks) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssi', $subjectCode, $subjectName, $course, $semester, $maxMarks);

        if ($stmt->execute()) {
            $message = 'Subject added successfully.';
            $_POST = [];
        } else {
            $error = 'Could not add subject. Subject code may already exist.';
        }

        $stmt->close();
    }
}

$subjects = $conn->query('SELECT * FROM subjects ORDER BY subject_id DESC');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subjects | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Subject Management</h2>
        <div class="topbar-right">
            <span><?php echo h($_SESSION['admin_name'] ?? 'Admin'); ?></span>
            <a href="logout.php" class="btn btn-secondary">Logout</a>
        </div>
    </header>

    <nav class="navbar">
        <a href="dashboard.php">Dashboard</a>
        <a href="add_student.php">Add Student</a>
        <a href="view_students.php">View Students</a>
        <a href="subjects.php" class="active">Subjects</a>
        <a href="attendance.php">Attendance</a>
        <a href="add_marks.php">Marks</a>
        <a href="report.php">Reports</a>
    </nav>

    <main class="container">
        <h1>Subject/Course Management</h1>

        <?php if ($message !== ''): ?>
            <div class="alert alert-success"><?php echo h($message); ?></div>
        <?php endif; ?>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?php echo h($error); ?></div>
        <?php endif; ?>

        <form method="post" class="card form-grid needs-validation" novalidate>
            <div>
                <label for="subject_code">Subject Code *</label>
                <input type="text" id="subject_code" name="subject_code" value="<?php echo h($_POST['subject_code'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="subject_name">Subject Name *</label>
                <input type="text" id="subject_name" name="subject_name" value="<?php echo h($_POST['subject_name'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="course">Course *</label>
                <input type="text" id="course" name="course" value="<?php echo h($_POST['course'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="semester">Semester *</label>
                <input type="text" id="semester" name="semester" value="<?php echo h($_POST['semester'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="max_marks">Max Marks *</label>
                <input type="number" id="max_marks" name="max_marks" min="1" value="<?php echo h($_POST['max_marks'] ?? '100'); ?>" required>
            </div>
            <div class="full-width">
                <button type="submit" class="btn btn-primary">Add Subject</button>
            </div>
        </form>

        <div class="card table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Semester</th>
                        <th>Max Marks</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($subjects && $subjects->num_rows > 0): ?>
                        <?php while ($row = $subjects->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo (int) $row['subject_id']; ?></td>
                                <td><?php echo h($row['subject_code']); ?></td>
                                <td><?php echo h($row['subject_name']); ?></td>
                                <td><?php echo h($row['course']); ?></td>
                                <td><?php echo h($row['semester']); ?></td>
                                <td><?php echo (int) $row['max_marks']; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6">No subjects available.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
