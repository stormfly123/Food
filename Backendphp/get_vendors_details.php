<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

$vendor_id = isset($_GET['vendor_id']) ? intval($_GET['vendor_id']) : 0;

$mysqli = new mysqli("localhost", "username", "password", "vendors");

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $mysqli->connect_error]);
    exit;
}

$sql = "SELECT vendor_name, location, profile_image FROM registration WHERE id = $vendor_id";
$result = $mysqli->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Vendor not found"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Query failed: " . $mysqli->error]);
}

$mysqli->close();
?>
