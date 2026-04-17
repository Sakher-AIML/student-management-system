<?php
require_once 'db_connect.php';
require_login();

$search = trim($_GET['search'] ?? '');
$message = trim($_GET['message'] ?? '');

if ($search !== '') {
    $like = '%' . $search . '%';
    $stmt = $conn->prepare(
        'SELECT * FROM students
         WHERE roll_no LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR course LIKE ?
         ORDER BY student_id DESC'
    );
    $stmt->bind_param('ssss', $like, $like, $like, $like);
    $stmt->execute();
    $students = $stmt->get_result();
    $stmt->close();
} else {
    $students = $conn->query('SELECT * FROM students ORDER BY student_id DESC');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Students | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topbar">
        <h2>Student Records</h2>
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
        <h1>Student List</h1>

        <?php if ($message !== ''): ?>
            <div class="alert alert-success"><?php echo h($message); ?></div>
        <?php endif; ?>

        <form method="get" class="card search-row">
            <input type="text" name="search" placeholder="Search by roll no, name, or course" value="<?php echo h($search); ?>">
            <button type="submit" class="btn btn-primary">Search</button>
            <a href="view_students.php" class="btn btn-secondary">Reset</a>
        </form>

        <div class="card table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Year/Sem</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($students && $students->num_rows > 0): ?>
                        <?php while ($row = $students->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo (int) $row['student_id']; ?></td>
                                <td><?php echo h($row['roll_no']); ?></td>
                                <td><?php echo h($row['first_name'] . ' ' . $row['last_name']); ?></td>
                                <td><?php echo h($row['gender']); ?></td>
                                <td><?php echo h($row['course']); ?></td>
                                <td><?php echo h($row['year_sem']); ?></td>
                                <td><?php echo h($row['email']); ?></td>
                                <td><?php echo h($row['phone']); ?></td>
                                <td>
                                    <a class="btn btn-small" href="edit_student.php?id=<?php echo (int) $row['student_id']; ?>">Edit</a>
                                    <a class="btn btn-small btn-danger confirm-delete" href="delete_student.php?id=<?php echo (int) $row['student_id']; ?>">Delete</a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9">No students found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
