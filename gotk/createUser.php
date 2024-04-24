<html>
    <head>
        <title>Create User</title>
    </head>
    <body>
        <form method="POST">
            <label for="username">Enter username:</label>
            <input type="text" id="username" name="username"><br><br>
            <label for="password">Enter password:</label>
            <input type="password" id="password" name="password"><br><br>
            <label for="reentry">Reenter password:</label>
            <input type="password" id="reentry" name="reentry"><br><br>
            <button name="createUser" type="submit">Create User</button>
        </form>

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
                        $conn = OpenCon();
                        if ($conn->connect_error) {
                            die("Connection failed: " . $conn->connect_error);
                        }
            
                        # Insert the registered user into the DB, and switch to login page
                        $sql = "INSERT INTO users (unsha256, pwsha256) VALUES ('$unhash', '$pwhash');";
                        if ($conn->query($sql) === TRUE) {
                            echo "User created successfully!";
                            // Redirect user to another page after successful submission
                            header("Location: index.php");
                            exit();
                        } else {
                            echo "Error: " . $sql . "<br>" . $conn->error;
                        }
                    }
                } else {
                    # Report that the text fields have not been filled
                    echo "Please fill out every textfield!";
                }
            }
        ?>
    </body>
</html>