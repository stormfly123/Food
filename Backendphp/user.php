<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendors";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM meals";
$result = $conn->query($sql);

$meals = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $meals[] = $row;
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Meals</title>
    <link rel="stylesheet" href="css/user.css">
</head>
<body>
    <div class="container">
        <h1>All Meals</h1>
        <div class="meals">
            <?php if (empty($meals)): ?>
                <p>No meals available at the moment.</p>
            <?php else: ?>
                <?php foreach ($meals as $meal): ?>
                    <div class="meal">
                        <img src="uploads/<?php echo htmlspecialchars($meal['image']); ?>" alt="<?php echo htmlspecialchars($meal['meal_name']); ?>" class="meal-image">
                        <h2><?php echo htmlspecialchars($meal['meal_name']); ?></h2>
                        <p><?php echo htmlspecialchars($meal['description']); ?></p>
                        <p>Price: ₦<?php echo htmlspecialchars($meal['price']); ?></p>
                        <p>Delivery Fee: ₦<?php echo htmlspecialchars($meal['delivery_fee']); ?></p>
                        <form action="Orders.html" method="post">
                            <input type="hidden" name="meal_id" value="<?php echo htmlspecialchars($meal['meal_id']); ?>">
                            <button type="submit">Order</button>
                        </form>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
