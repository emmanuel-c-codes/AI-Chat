<?php
$server   = 'localhost';
$username = 'root';
$password ='';
$database = 'connect';

$conn = mysql_connect($server, $username, $password, $database);

if (!$conn) {
    die("connection failed: " . mysqli_connect_error());
}

echo "connection successful";
?>