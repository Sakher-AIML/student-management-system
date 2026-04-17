<?php
require_once 'db_connect.php';
require_login();

$studentId = (int) ($_GET['id'] ?? 0);

if ($studentId <= 0) {
    header('Location: view_students.php');
    exit;
}

$stmt = $conn->prepare('SELECT * FROM students WHERE student_id = ?');
$stmt->bind_param('i', $studentId);
$stmt->execute();
$student = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$student) {
    header('Location: view_students.php?message=Student not found');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rollNo = trim($_POST['roll_no'] ?? '');
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $gender = trim($_POST['gender'] ?? '');
    $dob = trim($_POST['dob'] ?? '');
    $dob = $dob !== '' ? $dob : null;
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $course = trim($_POST['course'] ?? '');
    $yearSem = trim($_POST['year_sem'] ?? '');
    $address = trim($_POST['address'] ?? '');

    if ($rollNo === '' || $firstName === '' || $lastName === '' || $gender === '' || $course === '' || $yearSem === '') {
        $error = 'Please fill all required fields.';
    } elseif ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        $update = $conn->prepare(
            'UPDATE students SET roll_no = ?, first_name = ?, last_name = ?, gender = ?, dob = ?, email = ?, phone = ?, course = ?, year_sem = ?, address = ? WHERE student_id = ?'
        );
        $update->bind_param('ssssssssssi', $rollNo, $firstName, $lastName, $gender, $dob, $email, $phone, $course, $yearSem, $address, $studentId);

        if ($update->execute()) {
            $update->close();
            header('Location: view_students.php?message=Student updated successfully');
            exit;
        }

        $error = 'Could not update student. Roll number may already exist.';
        $update->close();
    }

    $student = [
        'roll_no' => $rollNo,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'gender' => $gender,
        'dob' => $dob,
        'email' => $email,
        'phone' => $phone,
        'course' => $course,
        'year_sem' => $yearSem,
        'address' => $address
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Edit Student</h2>
        <div class="topbar-right">
            <span><?php echo h($_SESSION['admin_name'] ?? 'Admin'); ?></span>
            <a href="logout.php" class="btn btn-secondary">Logout</a>
        </div>
    </header>

    <nav class="navbar">
        <a href="dashboard.php">Dashboard</a>
        <a href="add_student.php">Add Student</a>
        <a href="view_students.php" class="active">View Students</a>
        <a href="subjects.php">Subjects</a>
        <a href="attendance.php">Attendance</a>
        <a href="add_marks.php">Marks</a>
        <a href="report.php">Reports</a>
    </nav>

    <main class="container">
        <h1>Edit Student</h1>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?php echo h($error); ?></div>
        <?php endif; ?>

        <form method="post" class="card form-grid needs-validation" novalidate>
            <div>
                <label for="roll_no">Roll Number *</label>
                <input type="text" id="roll_no" name="roll_no" value="<?php echo h($student['roll_no'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="first_name">First Name *</label>
                <input type="text" id="first_name" name="first_name" value="<?php echo h($student['first_name'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="last_name">Last Name *</label>
                <input type="text" id="last_name" name="last_name" value="<?php echo h($student['last_name'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="gender">Gender *</label>
                <select id="gender" name="gender" required>
                    <option value="">Select</option>
                    <option value="Male" <?php echo (($student['gender'] ?? '') === 'Male') ? 'selected' : ''; ?>>Male</option>
                    <option value="Female" <?php echo (($student['gender'] ?? '') === 'Female') ? 'selected' : ''; ?>>Female</option>
                    <option value="Other" <?php echo (($student['gender'] ?? '') === 'Other') ? 'selected' : ''; ?>>Other</option>
                </select>
            </div>
            <div>
                <label for="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" value="<?php echo h($student['dob'] ?? ''); ?>">
            </div>
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?php echo h($student['email'] ?? ''); ?>">
            </div>
            <div>
                <label for="phone">Phone</label>
                <input type="text" id="phone" name="phone" value="<?php echo h($student['phone'] ?? ''); ?>">
            </div>
            <div>
                <label for="course">Course *</label>
                <input type="text" id="course" name="course" value="<?php echo h($student['course'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="year_sem">Year/Semester *</label>
                <input type="text" id="year_sem" name="year_sem" value="<?php echo h($student['year_sem'] ?? ''); ?>" required>
            </div>
            <div class="full-width">
                <label for="address">Address</label>
                <textarea id="address" name="address" rows="3"><?php echo h($student['address'] ?? ''); ?></textarea>
            </div>
            <div class="full-width">
                <button type="submit" class="btn btn-primary">Update Student</button>
            </div>
        </form>
    </main>

    <script src="script.js"></script>
</body>
</html>
