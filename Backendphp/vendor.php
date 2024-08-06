<?php
session_start();

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if vendor is authenticated
if (!isset($_SESSION['vendor_id'])) {
    header("Location: signin.php");
    exit();
}

// CORS headers - Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

// Fetch recent orders for the current vendor
$vendor_id = $_SESSION['vendor_id'];
$sqlRecentOrders = "SELECT order_id, customer_name, customer_address, customer_phone, order_details, total_amount, status 
                    FROM purchase 
                    WHERE vendor_id = ? 
                    ORDER BY order_id DESC 
                    LIMIT 5";
$stmtRecentOrders = $conn->prepare($sqlRecentOrders);
if ($stmtRecentOrders === false) {
    die("Error preparing statement: " . $conn->error);
}
$stmtRecentOrders->bind_param("i", $vendor_id);
$stmtRecentOrders->execute();
$resultRecentOrders = $stmtRecentOrders->get_result();
if ($resultRecentOrders === false) {
    die("Error executing query: " . $stmtRecentOrders->error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Recent Orders</title>
    <style>
        header {
    background-color: #ff7f50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header .logo {
    font-size: 1.5rem;
    font-weight: bold;
}

header nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

header nav ul li {
    margin-left: 1rem;
}

header nav ul li a {
    color: white;
    text-decoration: none;
    font-weight: bold;
}
        .container {
            width: 100%;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            margin-top: 20px;
        }
        table {
            width: 150%;
            border-collapse: collapse;
            margin-top: 20px;

        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #ff7f50;
            color: white;
        }
        .btn {
            padding: 5px 10px;
            margin-right: 5px;
            border: none;
            cursor: pointer;
        }
        .btn-approve {
            background-color: #4CAF50;
            color: white;
        }
        .btn-reject {
            background-color: #f44336;
            color: white;
        }
        .btn-complete {
            background-color: #008CBA;
            color: white;
        }
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
    <div class="container">

        <header>
        <div class="logo">Orders Dashboard</div>
        <nav>
            <ul>
                <li><a href="dashboard.php">Home</a></li>
                <li><a href="menu.php">Menu</a></li>
                <li><a href="vendor.php">Orders</a></li>
                <li><a href="profile.php">Profile</a></li>
                <li><a href="landing.html">Logout</a></li>
            </ul>
        </nav>


    </header>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Customer Address</th>
                    <th>Customer Phone</th>
                    <th>Order Details</th>
                    <th>Total Amount (₦)</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($resultRecentOrders->num_rows > 0) { ?>
                    <?php while ($row = $resultRecentOrders->fetch_assoc()) { ?>
                        <tr>
                            <td><?php echo htmlspecialchars($row['order_id']); ?></td>
                            <td><?php echo htmlspecialchars($row['customer_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['customer_address']); ?></td>
                            <td><?php echo htmlspecialchars($row['customer_phone']); ?></td>
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
                            <td>
                                <button class="btn btn-approve" onclick="updateOrderStatus(<?php echo $row['order_id']; ?>, 'Approved')">Approve</button>
                                <button class="btn btn-reject" onclick="updateOrderStatus(<?php echo $row['order_id']; ?>, 'Rejected')">Reject</button>
                                <button class="btn btn-complete" onclick="updateOrderStatus(<?php echo $row['order_id']; ?>, 'Completed')">Complete</button>
                            </td>
                        </tr>
                    <?php } ?>
                <?php } else { ?>
                    <tr>
                        <td colspan="8">No recent orders found</td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>

    <script>
        function updateOrderStatus(orderId, status) {
            fetch('update_order_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: orderId, status: status }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    location.reload(); // Reload the page to reflect status changes
                } else {
                    throw new Error('Error updating order status');
                }
            })
            .catch(error => {
                console.error('Error updating order status:', error);
                alert('Failed to update order status. Please try again.');
            });
        }
    </script>
</body>
</html>

<?php
$stmtRecentOrders->close();
$conn->close();
?>
