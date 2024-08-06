<?php
// order.php

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate received data
if (isset($data['customer_name'], $data['customer_address'], $data['customer_phone'], $data['cart_items'], $data['total_amount'], $data['vendor_id'])) {
    $customer_name = $conn->real_escape_string($data['customer_name']);
    $customer_address = $conn->real_escape_string($data['customer_address']);
    $customer_phone = $conn->real_escape_string($data['customer_phone']);
    $cart_items = json_encode($data['cart_items']); // Encode the cart items as JSON
    $total_amount = floatval($data['total_amount']); // Ensure total_amount is treated as a float
    $vendor_id = intval($data['vendor_id']); // Ensure vendor_id is treated as an integer

    // Prepare and bind parameters
    $stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_address, customer_phone, cart_items, total_amount, vendor_id) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssdi", $customer_name, $customer_address, $customer_phone, $cart_items, $total_amount, $vendor_id);

    // Execute statement
    if ($stmt->execute()) {
        $order_id = $stmt->insert_id;
        echo json_encode(['message' => 'Order placed successfully', 'order_id' => $order_id]);
    } else {
        echo json_encode(['error' => 'Error placing order: ' . $stmt->error]);
    }

    // Close statement
    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid input']);
}

// Close connection
$conn->close();
?>
