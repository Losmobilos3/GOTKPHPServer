<html>
    <head>
        <title>Create User</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <header>
        <h1>Create New User</h1>
    </header>
    <body>
        <div class="loginBox">
            <form method="POST">
                <label class="inputLabel" for="username">Enter username:</label>
                <input type="text" id="username" name="username"><br><br>
                <label class="inputLabel" for="password">Enter password:</label>
                <input type="password" id="password" name="password"><br><br>
                <label class="inputLabel" for="reentry">Reenter password:</label>
                <input type="password" id="reentry" name="reentry"><br><br>
                <br><br>
                <br><br>
                <button name="createUser" type="submit">Create User</button>
                <?php
                    # Check for button press
                    if (isset($_POST['createUser'])) {
                        if (!empty($_POST['username']) && !empty($_POST['password']) && !empty($_POST['reentry'])) {
                            # Get user input
                            $username = $_POST['username'];
                            $password = $_POST['password'];
                            $reentry = $_POST['reentry'];
                            # Check if password is entered correctly both times
                            if ($reentry != $password) {
                                echo "Passwords don't match!";
                            } else {
                                # Sha256 Encode lortet og gem det i databasen
                                $unhash = hash('sha256', $username);
                                $pwhash = hash('sha256', $password);

                                # Connect to DB
                                include 'dbconnect.php';
                                addUserToDB($unhash, $pwhash);
                            }
                        } else {
                            # Report that the text fields have not been filled
                            echo "<br> <a class='messageToUser'> Please fill out every textfield! </a>";
                        }
                    }
                ?>
            </form>
        </div>
    </body>
</html>