<?php
session_start();
require 'session_manager.php';
check_login();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function clean_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mealName = clean_input($_POST['mealName']);
    $mealDescription = clean_input($_POST['mealDescription']);
    $mealPrice = clean_input($_POST['mealPrice']);
    $deliveryFee = clean_input($_POST['deliveryFee']);
    $vendor_id = $_SESSION['vendor_id'];

    if (!is_numeric($mealPrice) || !is_numeric($deliveryFee)) {
        $errors['general'] = "Price and Delivery Fee must be numeric.";
    }

    $targetDir = "uploads/";
    $fileName = basename($_FILES["mealImage"]["name"]);
    $targetFilePath = $targetDir . $fileName;
    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

    $allowTypes = array('jpg', 'jpeg', 'png');
    if (in_array($fileType, $allowTypes)) {
        if (move_uploaded_file($_FILES["mealImage"]["tmp_name"], $targetFilePath)) {
            $stmt = $conn->prepare("INSERT INTO meals (meal_name, description, price, delivery_fee, vendor_id, image) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssddis", $mealName, $mealDescription, $mealPrice, $deliveryFee, $vendor_id, $fileName);
            if ($stmt->execute()) {
                header("Location: menu.php");
                exit();
            } else {
                $errors['general'] = "Error adding meal: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $errors['general'] = "Sorry, there was an error uploading your file.";
        }
    } else {
        $errors['general'] = "Sorry, only JPG, JPEG, and PNG files are allowed.";
    }
}

$conn->close();
?>
