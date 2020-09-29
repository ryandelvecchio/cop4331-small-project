<?php

	$inData = getRequestInfo();

	$user_id = $inData["user_id"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$fav_activity = $inData["fav_activity"];

	include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "INSERT INTO contacts (firstname, lastname, email, phone, fav_activity, user_id) VALUES ('{$firstname}','{$lastname}','{$email}','{$phone}','{$fav_activity}','{$user_id}')";

		$result = $conn->query($sql);

		if ($result)
		{
			returnWithInfo($conn->insert_id);
		}
		else
		{
			returnWithError($conn->errno);
		}
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"contact_id":'. $contact_id .', "error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($contact_id)
	{
		$retValue = '{"contact_id":'. $contact_id .', "error":""}';
		sendResultInfoAsJson($retValue);
	}

?>
