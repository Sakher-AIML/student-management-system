<?php
require_once 'db_connect.php';
require_login();

$message = '';
$error = '';

function calculate_grade($scorePercent)
{
    if ($scorePercent >= 90) {
        return 'A+';
    }
    if ($scorePercent >= 80) {
        return 'A';
    }
    if ($scorePercent >= 70) {
        return 'B';
    }
    if ($scorePercent >= 60) {
        return 'C';
    }
    if ($scorePercent >= 50) {
        return 'D';
    }
    return 'F';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $studentId = (int) ($_POST['student_id'] ?? 0);
    $subjectId = (int) ($_POST['subject_id'] ?? 0);
    $examType = trim($_POST['exam_type'] ?? '');
    $marksObtained = (float) ($_POST['marks_obtained'] ?? 0);
    $maxMarks = (float) ($_POST['max_marks'] ?? 100);

    if ($studentId <= 0 || $subjectId <= 0 || $examType === '') {
        $error = 'Please fill all required fields.';
    } elseif ($maxMarks <= 0 || $marksObtained < 0 || $marksObtained > $maxMarks) {
        $error = 'Marks should be between 0 and max marks.';
    } else {
        $scorePercent = ($marksObtained / $maxMarks) * 100;
        $grade = calculate_grade($scorePercent);

        $stmt = $conn->prepare(
            'INSERT INTO marks (student_id, subject_id, exam_type, marks_obtained, max_marks, grade)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained), max_marks = VALUES(max_marks), grade = VALUES(grade)'
        );
        $stmt->bind_param('iisdds', $studentId, $subjectId, $examType, $marksObtained, $maxMarks, $grade);

        if ($stmt->execute()) {
            $message = 'Marks saved successfully. Grade: ' . $grade;
        } else {
            $error = 'Could not save marks.';
        }

        $stmt->close();
    }
}

$students = $conn->query('SELECT student_id, roll_no, first_name, last_name FROM students ORDER BY roll_no ASC');
$subjects = $conn->query('SELECT subject_id, subject_code, subject_name, max_marks FROM subjects ORDER BY subject_code ASC');

$marksList = $conn->query(
    'SELECT m.mark_id, m.exam_type, m.marks_obtained, m.max_marks, m.grade,
            s.roll_no, s.first_name, s.last_name,
            sub.subject_code, sub.subject_name
     FROM marks m
     INNER JOIN students s ON m.student_id = s.student_id
     INNER JOIN subjects sub ON m.subject_id = sub.subject_id
     ORDER BY m.mark_id DESC
     LIMIT 100'
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marks | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Marks Management</h2>
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
        <a href="add_marks.php" class="active">Marks</a>
        <a href="report.php">Reports</a>
    </nav>

    <main class="container">
        <h1>Marks/Grades Management</h1>

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
                <label for="exam_type">Exam Type *</label>
                <input type="text" id="exam_type" name="exam_type" value="<?php echo h($_POST['exam_type'] ?? 'Internal-1'); ?>" required>
            </div>
            <div>
                <label for="marks_obtained">Marks Obtained *</label>
                <input type="number" step="0.01" id="marks_obtained" name="marks_obtained" min="0" value="<?php echo h($_POST['marks_obtained'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="max_marks">Max Marks *</label>
                <input type="number" step="0.01" id="max_marks" name="max_marks" min="1" value="<?php echo h($_POST['max_marks'] ?? '100'); ?>" required>
            </div>
            <div class="full-width">
                <button type="submit" class="btn btn-primary">Save Marks</button>
            </div>
        </form>

        <div class="card table-wrapper">
            <h3>Recent Marks Records</h3>
            <table>
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Exam</th>
                        <th>Marks</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($marksList && $marksList->num_rows > 0): ?>
                        <?php while ($row = $marksList->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo h($row['roll_no']); ?></td>
                                <td><?php echo h($row['first_name'] . ' ' . $row['last_name']); ?></td>
                                <td><?php echo h($row['subject_code'] . ' - ' . $row['subject_name']); ?></td>
                                <td><?php echo h($row['exam_type']); ?></td>
                                <td><?php echo h($row['marks_obtained'] . ' / ' . $row['max_marks']); ?></td>
                                <td><?php echo h($row['grade']); ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6">No marks records found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
