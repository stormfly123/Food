<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(array("error" => "Connection failed: " . $conn->connect_error));
    exit();
}

$sql = "SELECT * FROM meals";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(array("error" => "Error executing query: " . $conn->error));
    $conn->close();
    exit();
}

$meals = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $meals[] = $row;
    }
} else {
    echo json_encode(array("message" => "No meals found"));
    $conn->close();
    exit();
}

$conn->close();
echo json_encode($meals);
?>
