<?php
	session_start();
	
	// Unset session vars
	$_SESSION = array();
	
	if(session_destroy()) {
		header("Location: login.php");
	}
?>