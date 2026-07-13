<?php
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

 $INSERT = "INSERT INTO connectdb (name, email, password)VALUES(?, ?, ?)";

// if (mysqli_querry($conn, $INSERT)){
//     echo "new record successful";
//     header("location: submit.html")
// }

}
?>






<?php
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    // Check if the form fields actually exist before assigning them
    $name     = isset($_POST['name']) ? $_POST['name'] : '';
    $email    = isset($_POST['email']) ? $_POST['email'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    // Only run the query if name isn't empty
    if (!empty($name)) {
        $INSERT = "INSERT INTO connectdb (name, email, password) VALUES (?, ?, ?)";
        
        // Your prepared statement execution code goes here...
    } else {
        echo "Please fill out the form first.";
    }
}
?>