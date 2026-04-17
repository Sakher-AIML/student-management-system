<?php
require_once 'db_connect.php';
require_login();

$studentId = (int) ($_GET['id'] ?? 0);

if ($studentId > 0) {
    $stmt = $conn->prepare('DELETE FROM students WHERE student_id = ?');
    $stmt->bind_param('i', $studentId);
    $stmt->execute();
    $stmt->close();
}

header('Location: view_students.php?message=Student deleted successfully');
exit;
