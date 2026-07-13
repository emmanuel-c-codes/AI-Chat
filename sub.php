<?php
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $name     = $_POST['name'];
    $email    = $_POST['email'];
    $password = $_POST['password']; // Note: In production, consider using password_hash()

    // 1. Fixed the SQL query (removed trailing comma, matched column names, used placeholders)
    $sql = "INSERT INTO connectdb (NAME, EMAIL, PHONE_NUMBER) VALUES (?, ?, ?)";

    // 2. Prepare the statement to prevent SQL Injection
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        // 3. Bind the variables to the placeholders ("sss" means 3 strings)
        mysqli_stmt_bind_param($stmt, "sss", $name, $email, $password);
        
        // 4. Execute the query
        if (mysqli_stmt_execute($stmt)) {
            echo "Data submitted successfully!";
        } else {
            echo "Error inserting data: " . mysqli_error($conn);
        }
        
        // 5. Close the statement
        mysqli_stmt_close($stmt);
    } else {
        echo "Error preparing statement: " . mysqli_error($conn);
    }
}
?>