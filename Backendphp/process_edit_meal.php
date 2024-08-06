<?php
session_start();

// Check if vendor is authenticated
if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

// Function to sanitize and validate input
function clean_input($input) {
    // Remove whitespace from the beginning and end of string
    $input = trim($input);
    // Remove backslashes (\)
    $input = stripslashes($input);
    // Convert special characters to HTML entities
    $input = htmlspecialchars($input);
    return $input;
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $meal_id = clean_input($_POST['meal_id']);
    $meal_name = clean_input($_POST['meal_name']);
    $description = clean_input($_POST['description']);
    $price = clean_input($_POST['price']);
    $delivery_fee = clean_input($_POST['delivery_fee']);

    

    
    $conn = new mysqli($servername, $username, $password, $dbname);

    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE meals SET meal_name = ?, description = ?, price = ?, delivery_fee = ? WHERE meal_id = ? AND vendor_id = ?";
    $stmt = $conn->prepare($sql);

    
    $stmt->bind_param("ssddii", $meal_name, $description, $price, $delivery_fee, $meal_id, $_SESSION['vendor_id']);

    
    if ($stmt->execute()) {
        header("Location: menu.php");
        exit();
    } else {
        echo "Error updating meal: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Invalid request.";
}
?>
