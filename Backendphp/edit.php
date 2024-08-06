<?php
session_start();

// Check if vendor is authenticated
if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors"; // Adjust your database name

// Check if meal ID is provided in the query string
if (!isset($_GET['id'])) {
    header("Location: menu.php"); // Redirect if ID is not provided
    exit();
}

$meal_id = $_GET['id'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch meal details based on meal ID and vendor ID
$sql = "SELECT * FROM meals WHERE meal_id = ? AND vendor_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $meal_id, $_SESSION['vendor_id']);
$stmt->execute();
$result = $stmt->get_result();

// Check if meal exists for the current vendor
if ($result->num_rows > 0) {
    $meal = $result->fetch_assoc();
} else {
    echo "Meal not found or you do not have permission to edit.";
    exit();
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Meal</title>
    <link rel="stylesheet" href="css/edit.css">
</head>
<body>
    <div class="container">
        <h2>Edit Meal</h2>
        <form action="process_edit_meal.php" method="post">
            <input type="hidden" name="meal_id" value="<?php echo $meal['meal_id']; ?>">
            <div class="form-group">
                <label for="meal_name">Meal Name:</label>
                <input type="text" id="meal_name" name="meal_name" value="<?php echo htmlspecialchars($meal['meal_name']); ?>" required>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description" rows="4" required><?php echo htmlspecialchars($meal['description']); ?></textarea>
            </div>
            <div class="form-group">
                <label for="price">Price (₦):</label>
                <input type="number" id="price" name="price" value="<?php echo $meal['price']; ?>" required>
            </div>
            <div class="form-group">
                <label for="delivery_fee">Delivery Fee (₦):</label>
                <input type="number" id="delivery_fee" name="delivery_fee" value="<?php echo $meal['delivery_fee']; ?>" required>
            </div>
            <div class="form-group">
                <button type="submit">Update</button>
            </div>
        </form>
    </div>
</body>
</html>
