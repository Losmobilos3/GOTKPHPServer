To setup the server there are a few steps:
Setup the server.
1) Download the XAMPP stack.
2) Copy the contents of the repository into the folder "htdocs", which pops up when "Explorer" is clicked in the XAMPP Control Panel.

Setup the database:
1) Next the database needs to be setup.
2) On the windows machine running the server, run the Apache server and MySQL.
3) Type the following url into a browser: "localhost/dashboard"
4) Click on phpMyAdmin
5) Create a new database called "testbruger"
6) Select the database and click "Privilegier"
7) Click "Tilføj Bruger"
8) Enter "testBruger" into the "Brugernavn" field.
9) Let "Hostnavn" be "%".
10) Enter "test" into the "Adgangskode" field.
11) Scroll down, and click "Udfør".
12) Select all boxes on the screen, and again click "Udfør"
13) Again select the database "testbruger".
14) Click SQL, and enter the following command:

CREATE TABLE gotkdata (
	id INT AUTO_INCREMENT PRIMARY KEY,
    timeStamp INT,
    eventType VARCHAR(100)
);

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    unsha256 VARCHAR(100),
    pwsha256 VARCHAR(100)
);

Now the database should be good.

Finally, click on start on both Apache and MySQL in the XAMPP Control Panel

The server can now be accessed through the IP-address of the windows machine as follows: "\<address\>/gotk/"
