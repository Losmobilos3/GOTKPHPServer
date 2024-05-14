<?php 
    # Connect to DB
    include 'dbconnect.php';
    $conn = OpenCon();
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    # Converts the URL to a DB-insetion
    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo  $row["id"] . " " . $row["unsha256"] . " " . $row["pwsha256"] . " ";
            // You can echo other columns as needed
        }
    } else {
        echo "0 results";
    }
?>