<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $vendor_name = $_POST['vendor_name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $location = $_POST['location'];
    $phone = $_POST['phone'];
    $profile_image = $_FILES['profile_image']['name']; 
    $cover_image = $_FILES['cover_image']['name']; 

    $errors = array();

    $sql = "INSERT INTO registration (vendor_name, email, password, location, phone, profile_image, cover_image) 
            VALUES ('$vendor_name', '$email', '$password', '$location', '$phone', '$profile_image', '$cover_image')";

    if ($conn->query($sql) === TRUE) {
        header("Location: signin.html");
        exit();
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
