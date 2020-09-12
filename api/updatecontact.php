<?php

	$inData = getRequestInfo();

	$contact_id = $inData["contact_id"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$email = $inData["email"];
	$phone = $inData["phone"];

	include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql
			= "UPDATE contacts SET
			firstname='{$firstname}',
			lastname='{$lastname}',
			email='{$email}',
			phone='{$phone}'
			WHERE contact_id={$contact_id}";

		$result = $conn->query($sql);

		if ($result === TRUE)
		{
			returnWithInfo();
		}
		else
		{
			returnWithError("Error updating record");
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

	function returnWithError($err)
	{
		$retValue = '{"success": "false", "error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo()
	{
		$retValue = '{"success": "true", "error": ""}';
		sendResultInfoAsJson($retValue);
	}

?>
