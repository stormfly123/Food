<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}


function check_login() {
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: signin.html"); 
    }
}


function login($email) {
    $_SESSION['logged_in'] = true;
    $_SESSION['email'] = $email;
}


function logout() {
    session_unset(); 
    session_destroy(); 
}
?>
