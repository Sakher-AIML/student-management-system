<?php
require_once 'db_connect.php';

$_SESSION = [];
session_destroy();

header('Location: login.php');
exit;
