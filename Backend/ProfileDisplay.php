<?php
session_start(); // Start session if not already started

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Check if user is logged in (session has email)
if (!isset($_SESSION['email'])) {
  echo json_encode(["error" => "Unauthorized"]);
  exit();
}

// Establish database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "backend";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch user profile data based on session email
$email = $_SESSION['email'];
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  // Return user profile data as JSON response
  echo json_encode([
    "fullName" => $row['fullName'],
    "email" => $row['email'],
    "profileImage"=>$row['profileImage']
  ]);
} else {
  echo json_encode(["error" => "User not found"]);
}

// Close connection
$conn->close();

