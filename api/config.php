<?php
	// Connec to database
	$conn = new mysqli("161.35.52.252", "root", "password", "contactmanager");

	// Check connection
	if($conn === false){
		die("ERROR: Could not connect. " . mysqli_connect_error());
	}
?>
