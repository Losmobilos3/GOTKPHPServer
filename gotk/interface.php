<html>
    <head>
        <title>GOTK WebInterface</title>
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <header>
        <h1>Data table</h1>
    </header>
    <body>

        <table>
            <caption> Collected Data </caption>
            <tr>
                <th>Index </th>
                <th>Timestamp </th>
                <th>Event Type</th>
            </tr>
            <?php
                # Connects to DB
                include 'dbconnect.php';
                $conn = OpenCon();
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }
    
                # Get every data-entry in the database
                $sql = "SELECT * FROM gotkdata";
                $result = $conn->query($sql);
                # Creates a new row for every row in the database
                if ($result->num_rows > 0) {
                    // output data of each row
                    while($row = $result->fetch_assoc()) {
                    echo '<tr>
                            <td>' . $row["id"]        . '</td>
                            <td>' . $row["timeStamp"] . '</td>
                            <td>' . $row["eventType"] . '</td>
                          </tr>';
                    //echo "Event Type: " . $row["eventType"]. "<br> <br>";
                    }
                } else {
                echo "0 results";
                }
            ?>
            
        </table>
    </body>
</html>