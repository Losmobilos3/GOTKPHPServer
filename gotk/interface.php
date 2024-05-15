<?php
    // Renavigates to login page, if user is not logged in.
    session_start();
    if ($_SESSION['loggedIn'] == false) {
        header("Location: index.php");
        exit();
    }
?>

<html>
    <head>
        <title>GOTK WebInterface</title>
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <header>
        <h1>Collected Data</h1>
        <?php 
            include 'dbconnect.php';
            # rows is an array of arrays. rows[0] contains the first row, and so on
            $rows = getCollectedData();

            if (count($rows) == 0)
                echo  "<a class='error center'> No data to display. </a>";
        ?>
        <img class="interfaceLogo" src="GOTK - Logo.png">
    </header>
    <body>

    <div class="center">
        <a class="frequencyText">% Stove-on time latest 24h: </a><a class="frequencyValue" id="freq"></a>
    </div>
    
    <h2> Datapoints collected (latest active date) </h2>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
    <canvas class="graph" id="myChart" style="max-width:70%"></canvas>-->
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <div class="graphContainer"></div>

        <table class="centerTable" id="myTable">
            <caption> Collected Data </caption>
                <tr>
                    <th>Index </th>
                    <th>Timestamp </th>
                    <th>Event Type</th>
                </tr>
            <script src="addElementToTable.js"></script>
        </table>
    </body>
</html>