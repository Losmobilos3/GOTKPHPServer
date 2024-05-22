<?php 
    # Connect to DB
    include 'dbconnect.php';
    $conn = OpenCon();
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    # Takes raw data from the request  
    $json = file_get_contents('php://input');
    $data = json_decode($json); # Parses the JSON
    # Extracts the elements in the request
    $unhash = $data->unhash;
    $pwhash = $data->pwhash;

    # Insert the registered user into the DB, and switch to login page
    $sql = "INSERT INTO users (unsha256, pwsha256) VALUES ('$unhash', '$pwhash');";
    $result =  $conn->query($sql);
?>