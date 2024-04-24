<html>
    <head>
        <title>Login Page</title>
    </head>
    <body>
        <form method="POST">
            <label for="username">Enter username:</label>
            <input type="text" id="username" name="username"><br><br>
            <label for="password">Enter password:</label>
            <input type="password" id="password" name="password"><br><br>
            <button id="loginBtn" name="loginBtn">Login</button>
            <button id="createUsr" name="createUsr">Create Account</button>
        </form>

        <?php
            # Redirects to the create user page if the button is clicked
            if(isset($_POST["createUsr"])) {
                header("Location: createUser.php");
                exit();
            }
        ?>

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
                    
                    # Connects to database
                    include 'dbconnect.php';
                    $conn = OpenCon();
                    if ($conn->connect_error) {
                        die("Connection failed: " . $conn->connect_error);
                    }
        
                    # Fetch every SHA-256 encrypted user
                    $sql = "SELECT * FROM users";
                    $result = $conn->query($sql);

                    # Check every user through to see if the entered login is correct
                    while($row = $result->fetch_assoc()) {
                        if ($unhash == $row["unsha256"] && $pwhash == $row["pwsha256"]) {
                            header("Location: interface.php");
                            exit();
                        }
                    }
                    
                    # If the entered data is not correct, report it to the user
                    echo "Username and/or password is incorrect.";
                } else {
                    # If at least one of the fields is empty, report it to the user.
                    echo "Please fill every field!";
                }
            }
        ?>
    </body>
</html>