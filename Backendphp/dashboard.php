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
$dbname = "vendors";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$vendor_id = $_SESSION['vendor_id'];

// Fetch total meals
$sqlMeals = "SELECT COUNT(*) as total_meals FROM meals WHERE vendor_id = ?";
$stmtMeals = $conn->prepare($sqlMeals);
$stmtMeals->bind_param("i", $vendor_id);
$stmtMeals->execute();
$resultMeals = $stmtMeals->get_result();
$totalMeals = $resultMeals->fetch_assoc()['total_meals'];

// Fetch total orders
$sqlOrders = "SELECT COUNT(*) as total_orders FROM purchase WHERE vendor_id = ?";
$stmtOrders = $conn->prepare($sqlOrders);
$stmtOrders->bind_param("i", $vendor_id);
$stmtOrders->execute();
$resultOrders = $stmtOrders->get_result();
$totalOrders = $resultOrders->fetch_assoc()['total_orders'];

// Fetch total revenue
$sqlRevenue = "SELECT SUM(total_amount) as total_revenue FROM purchase WHERE vendor_id = ?";
$stmtRevenue = $conn->prepare($sqlRevenue);
$stmtRevenue->bind_param("i", $vendor_id);
$stmtRevenue->execute();
$resultRevenue = $stmtRevenue->get_result();
$totalRevenue = $resultRevenue->fetch_assoc()['total_revenue'];

// Fetch recent orders
$sqlRecentOrders = "SELECT order_id, customer_name, order_details, total_amount, status FROM purchase WHERE vendor_id = ? ORDER BY order_id DESC LIMIT 5";
$stmtRecentOrders = $conn->prepare($sqlRecentOrders);
$stmtRecentOrders->bind_param("i", $vendor_id);
$stmtRecentOrders->execute();
$resultRecentOrders = $stmtRecentOrders->get_result();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Dashboard Overview</title>
    <link rel="stylesheet" href="css/over.css">
    <style>
        .order-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .order-item img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">Food Vendor Dashboard</div>
        <nav>
            <ul>
                <li><a href="landing.html">Home</a></li>
                <li><a href="menu.php">Menu</a></li>
                <li><a href="vendor.php">Orders</a></li>
                <li><a href="profile.php">Profile</a></li>
                <li><a href="landing.html">Logout</a></li>
            </ul>
        </nav>
    </header>
    <section class="overview">
        <div class="container">
            <h1>Dashboard Overview</h1>
            <div class="metrics">
                <div class="metric">
                    <h2>Total Meals</h2>
                    <p class="count"><?php echo htmlspecialchars($totalMeals); ?></p>
                </div>
                <div class="metric">
                    <h2>Total Orders</h2>
                    <p class="count"><?php echo htmlspecialchars($totalOrders); ?></p>
                </div>
                <div class="metric">
                    <h2>Revenue</h2>
                    <p class="count">₦<?php echo htmlspecialchars($totalRevenue); ?></p>
                </div>
            </div>
        </div>
    </section>
    <section class="recent-orders">
        <div class="container">
            <h2>Recent Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Order Details</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($resultRecentOrders->num_rows > 0) { ?>
                        <?php while ($row = $resultRecentOrders->fetch_assoc()) { ?>
                            <tr>
                                <td><?php echo htmlspecialchars($row['order_id']); ?></td>
                                <td><?php echo htmlspecialchars($row['customer_name']); ?></td>
                                <td>
                                    <?php
                                    $orderDetails = json_decode($row['order_details'], true);
                                    if ($orderDetails && is_array($orderDetails)) {
                                        foreach ($orderDetails as $item) {
                                            echo '<div class="order-item">';
                                            echo '<img src="' . htmlspecialchars($item['image']) . '" alt="' . htmlspecialchars($item['name']) . '">';
                                            echo '<span>' . htmlspecialchars($item['name']) . ' - Quantity: ' . htmlspecialchars($item['quantity']) . '</span>';
                                            echo '</div>';
                                        }
                                    } else {
                                        echo 'Invalid order details';
                                    }
                                    ?>
                                </td>
                                <td>₦<?php echo htmlspecialchars($row['total_amount']); ?></td>
                                <td><?php echo htmlspecialchars($row['status']); ?></td>
                            </tr>
                        <?php } ?>
                    <?php } else { ?>
                        <tr>
                            <td colspan="5">No recent orders found</td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </section>
    <footer>
        <p>&copy; 2024 Food Vendor. All rights reserved.</p>
    </footer>
</body>
</html>
<?php
$stmtMeals->close();
$stmtOrders->close();
$stmtRevenue->close();
$stmtRecentOrders->close();
$conn->close();
?>
