<?php

	$inData = getRequestInfo();

  $username = $inData["username"];
  $password = $inData["password"];
  $firstname = $inData["firstname"];
	$lastname = $inData["lastname"];

  include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "INSERT INTO users(username,password,firstname,lastname)
            VALUES('" . $username . "', '" . md5($password) . "', '" . $firstname . "', '" . $lastname . "')";

		$result = $conn->query($sql);

    if (!$result)
		{
			returnWithError($conn->errno);
		}
		else
		{
			returnWithInfo($conn->insert_id);
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
		$retValue = '{"user_id":0, "error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($user_id)
	{
		$retValue = '{"user_id":'. $user_id .', "error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

?>
