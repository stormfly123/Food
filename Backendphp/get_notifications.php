<?php
header("Content-Type: application/json");

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$vendor_id = $_SESSION['vendor_id']; // Assuming vendor_id is stored in session
$sqlNotifications = "SELECT * FROM notifications WHERE vendor_id = ?";
$stmtNotifications = $conn->prepare($sqlNotifications);
if ($stmtNotifications === false) {
    http_response_code(500);
    echo json_encode(["error" => "Error preparing statement: " . $conn->error]);
    exit();
}

$stmtNotifications->bind_param("i", $vendor_id);
$stmtNotifications->execute();
$resultNotifications = $stmtNotifications->get_result();
if ($resultNotifications === false) {
    http_response_code(500);
    echo json_encode(["error" => "Error executing query: " . $stmtNotifications->error]);
    exit();
}

$notifications = [];
while ($row = $resultNotifications->fetch_assoc()) {
    $notifications[] = $row;
}

echo json_encode($notifications);

$stmtNotifications->close();
$conn->close();
?>
