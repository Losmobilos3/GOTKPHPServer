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

 function getUsersFromDB()
 {
   $url = "http://127.0.0.1/getUsers/";
   $response = file_get_contents($url);

   $parts = explode(" ", $response);

   $rows = array();

   for ($i = 0; $i < count($parts) - 1; $i +=3) {
      $rows[] = array($parts[$i], $parts[$i+1], $parts[$i+2]);
   }

   return $rows;
 }

 function getCollectedData()
 {
   $url = "http://127.0.0.1/getCollectedData/";
   $response = file_get_contents($url);

   $parts = explode(" ", $response);

   $rows = array();

   for ($i = 0; $i < count($parts) - 1; $i +=3) {      
      $rows[] = array($parts[$i], $parts[$i+1], $parts[$i+2]);
   }

   return $rows;
 }

 function addUserToDB($unhash, $pwhash)
 {
   $conn = OpenCon();
   if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
   }

   $url = 'http://127.0.0.1/createUser/';
   $data = ['unhash' => $unhash, 'pwhash' => $pwhash];

   // use key 'http' even if you send the request to https://...
   $options = [
      'http' => [
         'header' => "Content-type: application/x-www-form-urlencoded\r\n",
         'method' => 'POST',
         'content' => json_encode($data),
      ],
   ];

   $context = stream_context_create($options);
   $result = file_get_contents($url, false, $context);

   header("Location: index.php");
   exit();
   }
?>
