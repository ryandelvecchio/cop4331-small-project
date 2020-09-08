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

    if ($result = $conn->query($sql) != TRUE )
		{
			returnWithError($conn->error);
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

?>
