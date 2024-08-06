<?php
header('Content-Type: application/json');

function sendResponse($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit();
}

function db_connect() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "vendors";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        return false;
    }

    return $conn;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!isset($data['order_id'], $data['status'])) {
    sendResponse(false, 'Missing required fields');
}

$order_id = intval($data['order_id']);
$status = htmlspecialchars($data['status']);
$message = isset($data['message']) ? htmlspecialchars($data['message']) : '';

$conn = db_connect();

if (!$conn) {
    sendResponse(false, 'Database connection failed');
}

$sql = "UPDATE orders SET status = ?, message = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param('ssi', $status, $message, $order_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        sendResponse(true, 'Order status updated successfully');
    } else {
        sendResponse(false, 'No rows affected, check order ID');
    }

    $stmt->close();
} else {
    sendResponse(false, 'Failed to prepare SQL statement');
}

$conn->close();
?>
