<?php
require_once 'db_connect.php';
require_login();

$message = '';
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
        $stmt = $conn->prepare('INSERT INTO students (roll_no, first_name, last_name, gender, dob, email, phone, course, year_sem, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssssssss', $rollNo, $firstName, $lastName, $gender, $dob, $email, $phone, $course, $yearSem, $address);

        if ($stmt->execute()) {
            $message = 'Student registered successfully.';
            $_POST = [];
        } else {
            $error = 'Could not save student. Roll number may already exist.';
        }

        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Student | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Student Management</h2>
        <div class="topbar-right">
            <span><?php echo h($_SESSION['admin_name'] ?? 'Admin'); ?></span>
            <a href="logout.php" class="btn btn-secondary">Logout</a>
        </div>
    </header>

    <nav class="navbar">
        <a href="dashboard.php">Dashboard</a>
        <a href="add_student.php" class="active">Add Student</a>
        <a href="view_students.php">View Students</a>
        <a href="subjects.php">Subjects</a>
        <a href="attendance.php">Attendance</a>
        <a href="add_marks.php">Marks</a>
        <a href="report.php">Reports</a>
    </nav>

    <main class="container">
        <h1>Student Registration</h1>

        <?php if ($message !== ''): ?>
            <div class="alert alert-success"><?php echo h($message); ?></div>
        <?php endif; ?>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?php echo h($error); ?></div>
        <?php endif; ?>

        <form method="post" class="card form-grid needs-validation" novalidate>
            <div>
                <label for="roll_no">Roll Number *</label>
                <input type="text" id="roll_no" name="roll_no" value="<?php echo h($_POST['roll_no'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="first_name">First Name *</label>
                <input type="text" id="first_name" name="first_name" value="<?php echo h($_POST['first_name'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="last_name">Last Name *</label>
                <input type="text" id="last_name" name="last_name" value="<?php echo h($_POST['last_name'] ?? ''); ?>" required>
            </div>
            <div>
                <label for="gender">Gender *</label>
                <select id="gender" name="gender" required>
                    <option value="">Select</option>
                    <option value="Male" <?php echo (($_POST['gender'] ?? '') === 'Male') ? 'selected' : ''; ?>>Male</option>
                    <option value="Female" <?php echo (($_POST['gender'] ?? '') === 'Female') ? 'selected' : ''; ?>>Female</option>
                    <option value="Other" <?php echo (($_POST['gender'] ?? '') === 'Other') ? 'selected' : ''; ?>>Other</option>
                </select>
            </div>
            <div>
                <label for="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" value="<?php echo h($_POST['dob'] ?? ''); ?>">
            </div>
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?php echo h($_POST['email'] ?? ''); ?>">
            </div>
            <div>
                <label for="phone">Phone</label>
                <input type="text" id="phone" name="phone" value="<?php echo h($_POST['phone'] ?? ''); ?>">
            </div>
            <div>
                <label for="course">Course *</label>
                <input type="text" id="course" name="course" value="<?php echo h($_POST['course'] ?? ''); ?>" placeholder="e.g. BSc Computer Science" required>
            </div>
            <div>
                <label for="year_sem">Year/Semester *</label>
                <input type="text" id="year_sem" name="year_sem" value="<?php echo h($_POST['year_sem'] ?? ''); ?>" placeholder="e.g. Semester 1" required>
            </div>
            <div class="full-width">
                <label for="address">Address</label>
                <textarea id="address" name="address" rows="3"><?php echo h($_POST['address'] ?? ''); ?></textarea>
            </div>
            <div class="full-width">
                <button type="submit" class="btn btn-primary">Save Student</button>
            </div>
        </form>
    </main>

    <script src="script.js"></script>
</body>
</html>
