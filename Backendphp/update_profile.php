<?php
session_start();

if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$vendor_id = $_SESSION['vendor_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vendor_name = $_POST['vendor_name'];
    $email = $_POST['email'];
    $location = $_POST['location'];
    $phone = $_POST['phone'];

    $sql = "SELECT profile_image, cover_image FROM registration WHERE vendor_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $vendor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $vendor = $result->fetch_assoc();
    $stmt->close();

    $profile_image_path = $vendor['profile_image']; 
    if (!empty($_FILES['profile_image']['name'])) {
        $profile_image = basename($_FILES['profile_image']['name']);
        $profile_image_tmp = $_FILES['profile_image']['tmp_name'];
        $profile_image_path = "uploads/" . $profile_image;
        move_uploaded_file($profile_image_tmp, $profile_image_path);
    }

    $cover_image_path = $vendor['cover_image']; 
    if (!empty($_FILES['cover_image']['name'])) {
        $cover_image = basename($_FILES['cover_image']['name']);
        $cover_image_tmp = $_FILES['cover_image']['tmp_name'];
        $cover_image_path = "uploads/" . $cover_image;
        move_uploaded_file($cover_image_tmp, $cover_image_path);
    }

   
    $sql = "UPDATE registration SET vendor_name = ?, email = ?, location = ?, phone = ?, profile_image = ?, cover_image = ? WHERE vendor_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $vendor_name, $email, $location, $phone, $profile_image_path, $cover_image_path, $vendor_id);

    if ($stmt->execute()) {
        $_SESSION['success'] = "Profile updated successfully";
    } else {
        $_SESSION['errors']['general'] = "Error updating profile: " . $stmt->error;
    }

    $stmt->close();
    header("Location: profile.php");
    exit();
}


$conn->close();
?>
