<?php
// Opens a connection to the database and returns an instance to make SQL requests
function OpenCon()
{
# Information for accessing the database
   $dbhost = "localhost"; // Host-Address
   $dbuser = "testBruger"; // username for DBuser
   $dbpass = "test"; // password for DBuser
   $db = "testBruger"; // database name
   
   $conn = new mysqli($dbhost, $dbuser, $dbpass,$db)
      or die("Connect failed: %s\n". $conn -> error);
   return $conn;
}
// Closes the connection given
function CloseCon($conn)
{
   $conn -> close();
}
?>
