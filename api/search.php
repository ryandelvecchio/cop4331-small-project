<?php

	$inData = getRequestInfo();

  include_once 'config.php';

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
    $userQuery = $inData["userQuery"];
    $userID = $inData["userID"];

    $sql =
      "SELECT * FROM contacts WHERE user_id={$userID}
      AND (firstname LIKE '%{$userQuery}%' OR lastname LIKE '%{$userQuery}%' OR phone LIKE '%{$userQuery}%' OR email LIKE '%{$userQuery}%')";

		$result = $conn->query($sql);

    if ($result->num_rows > 0)
    {
      $searchResults = array();
      while ($row = $result->fetch_assoc())
      {
          $contact = array('firstname' => $row['firstname'],
                           'lastname'  => $row['lastname'],
                           'phone'     => $row['phone'],
                           'email'     => $row['email'],
                           'contact_id' => intval($row['contact_id']));

          array_push($searchResults, $contact);
      }
      returnWithInfo($searchResults);
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

  function returnWithError($err)
	{
		$retValue = '{"results":[], "error":"' . $err .'"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($searchResults)
	{
    $retValue = '{"results":'. json_encode($searchResults) . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

?>
