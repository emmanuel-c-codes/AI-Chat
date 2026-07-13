<?php
// Include your database connection script
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    
    // 1. Grab all three form inputs securely
    $username = $_POST['user_name'];
    $email    = $_POST['user_email'];
    $password = $_POST['user_password'];

    // 2. Updated SQL string targeting your 4 columns: ID, USERNAME, EMAIL, PASSWORD
    $INSERT = "INSERT INTO connectdb2 (ID, USERNAME, EMAIL, PASSWORD) VALUES (NULL, ?, ?, ?)";

    // 3. Prepare the query execution on the server
    $stmt = mysqli_prepare($conn, $INSERT);

    if ($stmt) {
        // 4. Bind parameters ("sss" means 3 strings)
        mysqli_stmt_bind_param($stmt, "sss", $username, $email, $password);
        
        // 5. Run the statement to save everything to the database
        if (mysqli_stmt_execute($stmt)) {
            // Success! Send the browser over to your success screen
            header("Location: submit.html");
            exit(); 
        } else {
            echo "Database Execution Error: " . mysqli_stmt_error($stmt);
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo "Query Preparation Error: " . mysqli_error($conn);
    }
}
?>