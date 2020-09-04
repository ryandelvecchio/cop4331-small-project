<?php
  session_start();

  if(isset($_SESSION['user_id'])) {
      header("Location: home.php");
  }

  include_once 'config.php';

  // Set validation error flag as false
  $error = false;

  // Check if form is submitted
  if (isset($_POST['signup'])) {
      $username = mysqli_real_escape_string($connection, $_POST['inputUsername']);
      $firstname = mysqli_real_escape_string($connection, $_POST['inputFirstName']);
      $lastname = mysqli_real_escape_string($connection, $_POST['inputLastName']);
      $password = mysqli_real_escape_string($connection, $_POST['inputPassword']);
      $cpassword = mysqli_real_escape_string($connection, $_POST['inputCPassword']);
      
      // Names can contain only alpha characters
      if (!preg_match("/^[a-zA-Z]+$/", $firstname)) {
          $error = true;
          $firstname_error = "First name must contain only letters.";
      }

      if (!preg_match("/^[a-zA-Z]+$/", $lastname)) {
          $error = true;
          $lastname_error = "Last name must contain only letters.";
      }

      // Usernames may contain letters and numbers
      if (!preg_match("/^[a-zA-Z0-9]+$/", $username)) {
          $error = true;
          $username_error = "Username must contain only letters and numbers.";
      }

      if(strlen($password) < 6) {
          $error = true;
          $password_error = "Password must be a minimum of 6 characters.";
      }

      if($password != $cpassword) {
          $error = true;
          $cpassword_error = "Passwords do not match.";
      }

      if (!$error) {
          if(mysqli_query($connection, "INSERT INTO users(username,password,firstname,lastname) VALUES('" . $username . "', '" . md5($password) . "', '" . $firstname . "', '" . $lastname . "')")) {
              $successmsg = "Registration complete!";
          } else {
              $errormsg = "Error in registering...Please try again later!";
          }
      }
  }
?>

<!DOCTYPE html>
<html>
<head>
  <meta name="author" content="Brandon Mitchell">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link href="css/styles.css" rel="stylesheet">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
  crossorigin="anonymous">
</head>

<body>

  <h1 id=title class=display-4>Contact Manager</h1>
  <br>

  <div style = "max-width: 1400px; margin: 1; padding: 15px">

    <h1 class="display-4">Register</h1>


    <form role="form" action="register.php" method="post">
      <!-- First and Last Name Row -->
      <div class="form-row">
        <div class="form-group col-md-2">
          <label for="inputFirstName">First</label>
          <input type="text" class="form-control" name="inputFirstName" required placeholder="Johnny">
          <span class="text-danger"><?php if (isset($lastname_error)) echo $lastname_error; ?></span>
        </div>
        <div class="form-group col-md-2">
          <label for="inputLastName">Last</label>
          <input type="text" class="form-control" name="inputLastName" required placeholder="Appleseed">
          <span class="text-danger"><?php if (isset($firstname_error)) echo $firstname_error; ?></span>
        </div>
      </div>

      <!-- Username Row -->
      <div class="form-row">
        <div class="form-group col-md-2">
          <label for="inputUsername">Username</label>
          <input type="text" class="form-control" name="inputUsername" required placeholder="jseed2020">
          <span class="text-danger"><?php if (isset($username_error)) echo $username_error; ?></span>
        </div>
      </div>

      <!-- Password and Confirm Password Row -->
      <div class="form-row">
        <div class="form-group col-md-2">
          <label for="inputPassword">Password</label>
          <input type="password" class="form-control" name="inputPassword" required placeholder="***********">
          <span class="text-danger"><?php if (isset($password_error)) echo $password_error; ?></span>
        </div>
        <div class="form-group col-md-2">
          <label for="inputPassword">Confirm Password</label>
          <input type="password" class="form-control" name="inputCPassword" required placeholder="***********">
          <span class="text-danger"><?php if (isset($cpassword_error)) echo $cpassword_error; ?></span>
        </div>
      </div>

      <button type="submit" name="signup" class="btn btn-primary">Sign Up</button>

      <button type="button" class="btn btn-primary">
        <a href="index.html" style="color:inherit">Back</a>
      </button>
    </form>
    <span class="text-success"><?php if (isset($successmsg)) { echo $successmsg; } ?></span>
    <span class="text-danger"><?php if (isset($errormsg)) { echo $errormsg; } ?></span>
  </div>

  <script>

  </script>

</body>
</html>
