<?php
$server   = 'localhost'; // Fixed: removed the space
$username = 'root';
$password = '';
$database = 'connect';

// Fixed: changed mysql_connect to mysqli_connect
$conn = mysqli_connect($server, $username, $password, $database);

// Fixed: correct syntax for checking a failed connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "Connection successful!";
?>