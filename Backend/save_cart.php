<?php
session_start();

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if vendor is authenticated
if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

// CORS headers - Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "backend";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Ensure necessary data is present
    if (isset($data['customer_id'], $data['cart_items'])) {
        $customer_id = $data['customer_id'];
        $cart_items = json_encode($data['cart_items']); // Convert array to JSON string

        // Insert cart items into the database
        $sql = "INSERT INTO cart (customer_id, cart_items) VALUES (?, ?)
                ON DUPLICATE KEY UPDATE cart_items = VALUES(cart_items)";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            die("Error preparing statement: " . $conn->error);
        }
        $stmt->bind_param("is", $customer_id, $cart_items);
        if ($stmt->execute() === false) {
            die("Error executing query: " . $stmt->error);
        }

        echo json_encode(["message" => "Cart saved successfully!"]);
        $stmt->close();
    } else {
        echo json_encode(["error" => "Invalid input data"]);
    }
} else {
    echo json_encode(["error" => "Method not allowed!"]);
}

$conn->close();
?>
