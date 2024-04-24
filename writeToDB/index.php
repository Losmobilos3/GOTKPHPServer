<?php 
    # Connect to DB
    include 'dbconnect.php';
    $conn = OpenCon();
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    # $_GET[i] gets the parameters given in the URL
    #//! Made into a POST request instead
    // Takes raw data from the request
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $ts = $data->timeStamp;
    $et = $data->eventType;

    echo "Received timeStamp: $ts, eventType: $et\n";

    # Converts the URL to a DB-insetion
    $sql = "INSERT INTO gotkdata (timeStamp, eventType) VALUES ($ts, '$et');";
    $conn->query($sql);
?>