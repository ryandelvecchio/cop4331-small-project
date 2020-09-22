<?php

	//TODO: Should probably not allow users to delete other users contacts lol...

	$inData = getRequestInfo();

	$contact_id = $inData["contact_id"];

	include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "DELETE FROM contacts WHERE contact_id={$contact_id}";

		$result = $conn->query($sql);

		if ($result)
			returnWithInfo();
		else
			returnWithError($conn->errno);

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
		$retValue = '{"error": "' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo()
	{
		$retValue = '{"error": ""}';
		sendResultInfoAsJson($retValue);
	}

?>
