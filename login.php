<?php
	session_start();

	// Send user to home if they are already logged in
	if(isset($_SESSION['user_id'])) {
		header("Location: home.php");
	}

	include_once 'config.php';

	// Check if form is submitted
	if (isset($_POST['login'])) {

		$username = mysqli_real_escape_string($connection, $_POST['username']);
		$password = mysqli_real_escape_string($connection, $_POST['password']);
		$result = mysqli_query($connection, "SELECT * FROM users WHERE username = '" . $username. "' and password = '" . md5($password) . "'");

		if ($row = mysqli_fetch_array($result)) {
			$_SESSION['user_id'] = $row['user_id'];
			$_SESSION['username'] = $row['username'];
			header("Location: home.php");
		} else {
			$error = "Incorrect username or password.";
		}
	}
?>