<?php
// //enable cors
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");


// // Establish database connection (example using MySQL)
// $servername = "localhost";
// $username = "root";
// $password = "";
// $dbname = "backend";

// $conn = new mysqli($servername, $username, $password, $dbname);

// // Check connection
// if ($conn->connect_error) {
//   die("Connection failed: " . $conn->connect_error);
// }

// // Handle POST request
// if ($_SERVER["REQUEST_METHOD"] == "POST") {
//   // Retrieve POST data
//   $fullName = $_POST['fullName'];
//   $email = $_POST['email'];
//   $confirmPassword = $_POST['confirmPassword'];
//   $password = $_POST['password'];
//   $phoneNumber = $_POST['phoneNumber'];

//   // Hash password
//   $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

//   // Insert into database
//   $sql = "INSERT INTO users (fullName, email, password,confirmPassword, phoneNumber) 
//           VALUES ('$fullName', '$email', '$hashedPassword', '$confirmPassword', '$phoneNumber')";

//   if ($conn->query($sql) === TRUE) {
//     echo "New record created successfully";
//     header('');
//   } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
//   }
// }

// // Close connection
// $conn->close();


// Enable CORS


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "backend";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $data = json_decode(file_get_contents("php://input"), true);

  if (isset($data['fullName']) && isset($data['email']) && isset($data['password']) && isset($data['phoneNumber'])) {
    $fullName = $data['fullName'];
    $email = $data['email'];
    $password = $data['password'];
    $phoneNumber = $data['phoneNumber'];

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare statement
    $sql = "INSERT INTO users (fullName, email, password, phoneNumber) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    // Bind parameters
    $stmt->bind_param('ssss', $fullName, $email, $hashedPassword, $phoneNumber);

    // Execute statement
    if ($stmt->execute()) {
      echo json_encode(['message' => 'User registered successfully']);
    } else {
      echo json_encode(['error' => 'Registration failed']);
    }

    $stmt->close();
  } else {
    echo json_encode(['error' => 'Missing required fields']);
  }
}

$conn->close();
?>
