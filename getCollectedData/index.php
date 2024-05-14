<?php 
    header("Access-Control-Allow-Origin: http://localhost");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    # Connect to DB
    include 'dbconnect.php';
    $conn = OpenCon();
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    # Converts the URL to a DB-insetion
    $sql = "SELECT * FROM gotkdata";
    $result =  $conn->query($sql);

    $response = array(); // Initialize an empty array to store the response data

    if ($result->num_rows > 0) {
        // Loop through each row in the result set
        while($row = $result->fetch_assoc()) {
            // Append each row as an associative array to the response array
            $response[] = array(
                "id" => $row["id"],
                "timeStamp" => $row["timeStamp"],
                "eventType" => $row["eventType"]
                // You can include other columns as needed
            );
        }
    } else {
        // If no rows are found, send a simple message in the response
        $response["message"] = "No data found";
    }

    // Encode the response array as JSON and echo it
    echo json_encode($response);

    // Close the database connection
    $conn->close();
?>