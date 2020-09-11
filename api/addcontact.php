<?php

	$inData = getRequestInfo();

	$user_id = $inData["user_id"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$createtime = date("Y-m-d h:i:sa");

	include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "INSERT INTO contacts (firstname, lastname, email, phone, createtime, user_id) VALUES ('". $firstname ."','". $lastname ."','". $email ."','". $phone ."','". $createtime ."','". $user_id  ."')";

		$result = $conn->query($sql);

		if ($result === TRUE)
		{
			returnWithInfo();
		}
		else
		{
			returnWithError( "Error inserting record" );
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo()
	{
		$retValue = '{"status":"success"}';
		sendResultInfoAsJson( $retValue );
	}

?>
