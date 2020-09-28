<?php
	// Connec to database
	$conn = new mysqli("IP", "username", "password", "database");

	// Check connection
	if (!$conn)
	{
		die("ERROR: Could not connect. " . mysqli_connect_error());
	}
?>
