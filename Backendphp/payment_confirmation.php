<?php
// Ensure CORS headers are set correctly
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database configuration and connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve and decode JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if all required fields are present
if (isset($data['vendor_id'], $data['customer_name'], $data['customer_address'], $data['customer_phone'], $data['order_details'], $data['total_amount'])) {
    $vendor_id = $data['vendor_id'];
    $customer_name = $data['customer_name'];
    $customer_address = $data['customer_address'];
    $customer_phone = $data['customer_phone'];
    $order_details = $data['order_details'];
    $total_amount = $data['total_amount'];
    $status = "Pending"; // Default status

    // Insert order into the database
    $sql = "INSERT INTO purchase (vendor_id, customer_name, customer_address, customer_phone, order_details, total_amount, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }
    $stmt->bind_param("issssis", $vendor_id, $customer_name, $customer_address, $customer_phone, $order_details, $total_amount, $status);
    $stmt->execute();
    if ($stmt->error) {
        die("Error executing query: " . $stmt->error);
    }
    $stmt->close();

    // Respond with success message
    echo json_encode(['message' => 'Order placed successfully']);
} else {
    // Respond with error message if any required field is missing
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input', 'missing_fields' => array_diff(['vendor_id', 'customer_name', 'customer_address', 'customer_phone', 'order_details', 'total_amount'], array_keys($data))]);
}

// Close database connection
$conn->close();
?>
