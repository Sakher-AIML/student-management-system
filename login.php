<?php
require_once 'db_connect.php';

if (is_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputUsername = trim($_POST['username'] ?? '');
    $inputPassword = trim($_POST['password'] ?? '');

    if ($inputUsername === '' || $inputPassword === '') {
        $error = 'Please enter username and password.';
    } else {
        $stmt = $conn->prepare('SELECT admin_id, username, password, full_name FROM admins WHERE username = ? LIMIT 1');
        $stmt->bind_param('s', $inputUsername);
        $stmt->execute();
        $result = $stmt->get_result();
        $admin = $result->fetch_assoc();
        $stmt->close();

        $isValid = false;

        if ($admin) {
            if (preg_match('/^[a-f0-9]{64}$/i', $admin['password']) === 1) {
                $isValid = hash_equals(strtolower($admin['password']), hash('sha256', $inputPassword));
            } else {
                $isValid = password_verify($inputPassword, $admin['password']) || $admin['password'] === $inputPassword;
            }
        }

        if ($isValid) {
            $_SESSION['admin_id'] = $admin['admin_id'];
            $_SESSION['admin_name'] = $admin['full_name'];
            header('Location: dashboard.php');
            exit;
        }

        $error = 'Invalid username or password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Smart Student Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-body">
    <div class="login-wrapper">
        <h1>Smart Student Management System</h1>
        <p class="subtitle">Admin Login</p>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?php echo h($error); ?></div>
        <?php endif; ?>

        <form method="post" class="card needs-validation" novalidate>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>

            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>

            <button type="submit" class="btn btn-primary">Login</button>
        </form>

        <p class="login-note">Default credentials: <strong>admin / admin123</strong></p>
    </div>

    <script src="script.js"></script>
</body>
</html>
