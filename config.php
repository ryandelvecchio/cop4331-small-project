<?php
	// Connec to database
	$connection = mysqli_connect('localhost', 'root', '', 'contactmanager');
	
	// Check connection
	if($connection === false){
		die("ERROR: Could not connect. " . mysqli_connect_error());
	}
?>