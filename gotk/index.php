<?php 
// Initialize value for checking if the user is logged in.
session_start();
if(!isset($_GET['action']))
{
   $_SESSION['loggedIn'] = false; # Set the key whatever you want
}
?>

<html>
<head>
    <title>Login Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<header>
    <h1>Login Page</h1>
    <img class="loginLogo" src="GOTK - Logo.png">
</header>
<body>
    <div class="loginBox">
        <form method="POST">
            <label class="inputLabel" for="username">Enter username:</label>
            <input type="text" id="username" name="username"><br><br>
            <label class="inputLabel" for="password">Enter password:</label>
            <input type="password" id="password" name="password"><br><br>
            <br><br>
            <br><br>
            <br><br>
            <button id="loginBtn" name="loginBtn">Login</button>
            <?php
        # Check login button
        if (isset($_POST['loginBtn'])) {
            if (!empty($_POST['username']) && !empty($_POST['password'])) {
                # Fetches strings from textfields
                $username = $_POST['username'];
                $password = $_POST['password'];

                # Sha256 Encode lortet og gem det i databasen
                $unhash = hash('sha256', $username);
                $pwhash = hash('sha256', $password);
                
                # Gets users from database
                include 'dbconnect.php';
                # rows is an array of arrays. rows[0] contains the first row, and so on
                $rows = getUsersFromDB();
                
                # Check every user through to see if the entered login is correct
                foreach ($rows as $row) {
                    if ($unhash == $row[1] && $pwhash == $row[2]) {
                        $_SESSION['loggedIn'] = true;
                        header("Location: interface.php");
                        exit();
                    }
                }
                
                # If the entered data is not correct, report it to the user
                echo "<br> <a class='messageToUser'> Username and/or password is incorrect. </a>";
            } else {
                # If at least one of the fields is empty, report it to the user.
                echo "<br> <a class='messageToUser'> Please fill every field! </a>";
            }
        }
    ?>
        </form>
    </div>
</body>
</html>
