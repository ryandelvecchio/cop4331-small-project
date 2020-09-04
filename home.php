<?php
  session_start();

  // Send user to login if user_id is not set
  if(isset($_SESSION['user_id'])=="") {
      header("Location: login.php");
  }

  include_once 'config.php';

  $userId = $_SESSION['user_id'];
  $username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html>
<head>
  <meta name="author" content="Brandon Mitchell">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <script type="text/javascript" src="js/code.js"></script>
  <link href="css/styles.css" rel="stylesheet">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
  crossorigin="anonymous">
</head>

<body>

  <h1 id=title class=display-4>UCF Contact Manager</h1>

  <br>

  <div style = "max-width: 1400px; margin: 1; padding: 15px">
    <!-- There must be a way to pass in the user's first name -->
    <h1 class="display-4">Welcome <?php echo $_SESSION['username']; ?></h1>

      <p>Choose an action:</p>
      <!-- Search for users in the database -->
      <input class="btn btn-primary" type="button" value="Search Users" onclick="searchUsers()"/>
      <input class="hide" type="text" id="textInput" placeholder="First Name"/>
      <input class="hide" type="text" id="textInput2" placeholder="Last Name"/>
      <input class="hide btn btn-primary" type="button" id="searchButton" value="Search" onclick="submitSearch()"/>
      <p class="hide" id="searching">Searching For User...</p>

      <!-- Update the  user's current records -->
      <input type="button" class="btn btn-primary" value="Update Records" onclick="updateRecords()"/>
      <input class="hide" type="text" id="updateFirst" placeholder="New First Name"/>
      <input class="hide" type="text" id="updateLast" placeholder="New Last Name"/>
      <input class="hide" type="text" id="updateEmail" placeholder="New Email"/>
      <input class="hide" type="text" id="updatePhone" placeholder="New Phone Number"/>
      <input class="hide btn btn-primary" type="button" id="updateButton" value="Update" onclick="submitUpdate()">
      <p class="hide" id="updated">User Information Updated!</p>

      <br>
      <p> </p>
      <br>

      <!-- Reset Password -->
      <input class="btn btn-primary" type="button" value="Reset Password" onclick="resetPassword()"/>
      <input class="hide" type="password" id="oldPW" placeholder="Old Password"/>
      <input class="hide" type="password" id="newPW" placeholder="New Password"/>
      <input class="hide" type="password" id="newPW2" placeholder="Confirm New Password"/>
      <input class="hide btn btn-primary" type="button" id="resetButton" value="Reset Password" onclick="changePassword()"/>
      <p class="hide" id="reset">Password Reset Successful!</p>


      <button type="button" class="btn btn-primary">
        <a href="index.html" style="color:inherit">Sign Out</a>
      </button>
  </div>

</body>
</html>
