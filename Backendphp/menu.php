<?php

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
session_start();


if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$vendor_id = $_SESSION['vendor_id'];
$sql = "SELECT * FROM meals WHERE vendor_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $vendor_id);
$stmt->execute();
$result = $stmt->get_result();

$meals = [];
while ($row = $result->fetch_assoc()) {
    $meals[] = $row;
}

// Check if the request is for JSON data
if (isset($_GET['json']) && $_GET['json'] == 'true') {
    header('Content-Type: application/json');
    echo json_encode($meals);
    $stmt->close();
    $conn->close();
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
    <title>Vendor Menu</title>
    <link rel="stylesheet" href="css/menu.css">
</head>
<body>


    <div class="container">
        <h1>Vendor Menu</h1>
        <table>
            <thead>
                <tr>
                    <th>Meal Name</th>
                    <th>Description</th>
                    <th>Price (₦)</th>
                    <th>Delivery Fee (₦)</th>
                    <th>Image</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($meals as $meal) { ?>
                    <tr>
                        <td><?php echo htmlspecialchars($meal['meal_name']); ?></td>
                        <td><?php echo htmlspecialchars($meal['description']); ?></td>
                        <td><?php echo htmlspecialchars($meal['price']); ?></td>
                        <td><?php echo htmlspecialchars($meal['delivery_fee']); ?></td>
                        <td><img src="uploads/<?php echo htmlspecialchars($meal['image']); ?>" alt="Meal Image" class="meal-image"></td>
                        <td>
                            <a href="edit.php?id=<?php echo $meal['meal_id']; ?>">Edit</a> 
                            <a href="delete.php?id=<?php echo $meal['meal_id']; ?>" onclick="return confirm('Are you sure you want to delete this meal?');">Delete</a> 
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
        <a href="Add.html" class="add-meal-btn">Add New Meal</a>
    </div>
</body>
</html>
