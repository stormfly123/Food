<?php
session_start();
require_once('session_manager.php');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT vendor_id FROM registration WHERE email = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($vendor_id);
        $stmt->fetch();
        login($email); 
        $_SESSION['vendor_id'] = $vendor_id;
        header("Location: dashboard.php"); 
    } else {
        echo "Invalid email or password.";
    }

    $stmt->close();
}

$conn->close();
?>
