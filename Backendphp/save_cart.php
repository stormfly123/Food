<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['customer_id']) || !isset($data['cart_items'])) {
    echo json_encode(array("error" => "Invalid input data"));
    exit();
}

$customer_id = $data['customer_id'];
$cart_items = $data['cart_items'];

foreach ($cart_items as $item) {
    $meal_name = $conn->real_escape_string($item['meal_name']);
    $quantity = intval($item['quantity']);
    $price = floatval($item['price']);
    $deliveryFee = isset($item['deliveryFee']) ? floatval($item['deliveryFee']) : 0;

    $sql = "INSERT INTO cart_items (customer_id, meal_name, quantity, price, delivery_fee) 
            VALUES ('$customer_id', '$meal_name', '$quantity', '$price', '$deliveryFee')";

    if ($conn->query($sql) !== TRUE) {
        echo json_encode(array("error" => "Error: " . $sql . "<br>" . $conn->error));
        exit();
    }
}

$conn->close();

echo json_encode(array("message" => "Cart items saved successfully"));
?>
