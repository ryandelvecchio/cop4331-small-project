<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstname = "";
	$lastname = "";

	// Use the server's public IP to connect to the mysql database.
	// login into mysql with a user named root, whose password is "password"
	// We can change this later
	$conn = new mysqli("161.35.52.252", "root", "password", "contactmanager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT user_id, firstname, lastname FROM users where username='" . $inData["login"] . "' and password='" . $inData["password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstname = $row['firstname'];
			$lastname = $row['lastname'];
			$id = $row['user_id'];
			
			returnWithInfo($firstname, $lastname, $id);
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstname":"","lastname":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstname, $lastname, $id )
	{
		$retValue = '{"id":' . $id . ',"firstname":"' . $firstname . '","lastname":"' . $lastname . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>