<?php
session_start();

// Check if vendor is authenticated
if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors"; // Adjust your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if meal ID is provided and valid
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $meal_id = $_GET['id'];

    // Prepare SQL statement to delete meal
    $sql = "DELETE FROM meals WHERE meal_id = ? AND vendor_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $meal_id, $_SESSION['vendor_id']);

    // Execute statement
    if ($stmt->execute()) {
        // Redirect to menu page after deletion
        header("Location: menu.php");
        exit();
    } else {
        echo "Error deleting meal: " . $conn->error;
    }
} else {
    echo "Invalid meal ID.";
}

$stmt->close();
$conn->close();
?>
