<?php

	$inData = getRequestInfo();

	$id = 0;
	$firstname = "";
	$lastname = "";

  include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
    $password_hash = md5($inData["password"]);
		$sql = "SELECT user_id, firstname, lastname FROM users where username='" . $inData["username"] . "' and password='" . $password_hash . "'";
		$result = $conn->query($sql);

		if (!$result)
		{
			returnWithError($conn->errno);
		}
		else if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstname = $row['firstname'];
			$lastname = $row['lastname'];
			$id = $row['user_id'];

			returnWithInfo($firstname, $lastname, $id);
		}
		else
		{
			returnWithError("No Records Found");
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
		$retValue = '{"user_id":0,"firstname":"","lastname":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstname, $lastname, $id )
	{
		$retValue = '{"user_id":' . $id . ',"firstname":"' . $firstname . '","lastname":"' . $lastname . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
