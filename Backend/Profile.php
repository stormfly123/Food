<?php
session_start(); // Start or resume session

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "backend"; // Replace with your actual database name

// Establish database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
  exit();
}

// Handle GET request to fetch user profile data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Check if user is logged in (session has email)
  if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
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
      "phoneNumber" => $row['phoneNumber'],
      "email" => $row['email'],
      "profileImage" => $row['profileImage'],
    ]);
  } else {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
  }
}

// Handle PUT request to update user profile data
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  // Parse JSON input
  $data = json_decode(file_get_contents('php://input'), true);

  // Check if user is logged in (session has email)
  if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
  }

  // Extract data from JSON
  $email = $_SESSION['email'];
  $fullName = $data['fullName'];
  $phoneNumber = $data['phoneNumber'];
  $profileImage = $data['profileImage'];

  // Update user data in the database
  $updateSql = "UPDATE users SET fullName='$fullName', phoneNumber='$phoneNumber', profileImage='$profileImage' WHERE email='$email'";

  if ($conn->query($updateSql) === TRUE) {
    http_response_code(200);
    echo json_encode(["message" => "Profile updated successfully"]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Error updating profile: " . $conn->error]);
  }
}

// Close connection
$conn->close();
?>
