// Example delete_meal.php
<?php

session_start();
include_once 'session_manager.php'; // Ensure session management is included

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['id'])) {
    check_login(); // Ensure user is logged in

    $meal_id = $_GET['id'];

    // Delete meal from database
    $sql = "DELETE FROM meals WHERE meal_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $meal_id);

    if ($stmt->execute()) {
        // Redirect to menu page or show success message
        header("Location: menu.html?delete_success=true");
        exit();
    } else {
        // Handle deletion failure
        $_SESSION['errors']['general'] = "Failed to delete meal. Please try again later.";
        header("Location: menu.html");
        exit();
    }
}
