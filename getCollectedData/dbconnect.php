<?php
 function OpenCon()
 {
    $dbhost = "localhost"; // Host-Address
    $dbuser = "testBruger"; // username for DBuser
    $dbpass = "test"; // password for DBuser
    $db = "testBruger"; // database name
    
    $conn = new mysqli($dbhost, $dbuser, $dbpass,$db)
        or die("Connect failed: %s\n". $conn -> error);
    return $conn;
 }
 function CloseCon($conn)
 {
    $conn -> close();
 }
?>
