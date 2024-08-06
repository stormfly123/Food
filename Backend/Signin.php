<?php
// Enable CORS and specify allowed methods and headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Start a session
session_start();

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
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Read POST data as JSON
  $data = json_decode(file_get_contents("php://input"), true);

  // Check if email and password are set in the request data
  if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    // Prepare SQL statement to select user by email
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if user exists
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Verify the password
            if (password_verify($password, $row['password'])) {
                // Store user data in session variables
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['email'] = $email;
                $_SESSION['logged_in'] = true;

                // Respond with success message
                echo json_encode(['success' => true, 'message' => 'Login successful']);
            } else {
                // Respond with invalid password message
                echo json_encode(['success' => false, 'message' => 'Invalid password.']);
            }
        } else {
            // Respond with user not found message
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }

        $stmt->close();
    } else {
        // Respond with an error message if the SQL statement couldn't be prepared
        echo json_encode(['success' => false, 'message' => 'Database error: Could not prepare statement.']);
    }
  } else {
    // Respond with missing email or password message
    echo json_encode(['success' => false, 'message' => 'Missing email or password in request.']);
  }
}

// Close the database connection
$conn->close();
?>
