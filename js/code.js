var extension = 'php';

var userId = 0;
var firstname = "";
var lastname = "";

function doLogin()
{
	userId = 0;
	firstname = "";
	lastname = "";

	var login = document.getElementById("usrname").value;
	var password = document.getElementById("passwrd").value;

	//document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"username" : "' + login + '", "password" : "' + password + '"}';
	var url = 'api//login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		userId = jsonObject.user_id;

		if (userId < 1)
		{
			throw jsonObject.error;
		}

		firstname = jsonObject.firstname;
		lastname = jsonObject.lastname;

		saveCookie();

		window.location.href = "html/home.html";
	}
	catch(err)
	{
		alert(err);
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstname=" + firstname + ",lastname=" + lastname + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstname" )
		{
			firstname = tokens[1];
		}
		else if( tokens[0] == "lastname" )
		{
			lastname = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("usrname").innerHTML = "Logged in as " + firstname + " " + lastname;
	}
}

function doLogout()
{
	userId = 0;
	firstname = "";
	lastname = "";
	document.cookie = "firstname= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Add a new contact
// Returns a JSON payload with new contact info
function addContact()
{
	// variables for JSON payload
	var newFirstName = document.getElementById("addFirst").value;
	var newLastName = document.getElementById("addLast").value;
	var newEmail = document.getElementById("addEmail").value;
	var newPhoneNumber = document.getElementById("addPhone").value;


	document.getElementById("addResult").innerHTML = "";

	// JSON payload with all new contact info from HTML page
	var jsonPayload = '{"first name" : "' + newFirstName + '", "last name" : ' + newLastName +
	'", "email" : ' + newEmail +  '", "phone number" : ' + newPhoneNumber +
	'", "userId" : ' + userId +  '}';

	// FIXME: rename based on endpoint name for the PHP file
	var url = urlBase + '/api/addcontact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("addResult").innerHTML = "Contact Added to your list";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}

}


// Search for a contact by any string
function submitSearch()
{
	var srch = document.getElementById("firstnameSearch").value;


	// FIXME: where is the search result in the register.HTML?
	document.getElementById("SearchResult").innerHTML = "";

	var searchList = "";

	// json payload with first name to search and userID of person searching
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';

	var url = urlBase + '/api/search.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("SearchResult").innerHTML = "Processing Names...";
				var jsonObject = JSON.parse( xhr.responseText );

				// build json array of results
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					searchList += jsonObject.results[i];

					// Add a formatting break to each search result displayed
					if( i < jsonObject.results.length - 1 )
					{
						searchList += "<br />\r\n";
					}
				}

				// FIXME: Not 100% sure what this does but I think it
				// just displays the results as a paragraph. This may need to be worked
				// in a bit better
				document.getElementsByTagName("p")[0].innerHTML = searchList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SearchResult").innerHTML = err.message;
	}

}

// Function to submit a change to a Contact
function submitUpdate()
{
	// Get the elements from HTML and put in JSON payload
	var updateFirst = document.getElementById("updateFirst").value;
	var updateLast = document.getElementById("updateLast").value;
	var updateEmail = document.getElementById("updateEmail").value;
	var updatePhone = document.getElementById("updatePhone").value;

	// FIXME: I think this may be a pop up but consult Brandon
	document.getElementById("updateResult").innerHTML = "";

	// JSON payload with all new contact info from HTML page
	var jsonPayload = '{"first name" : "' + updateFirst + '", "last name" : ' + updateLast +
	'", "email" : ' + updateEmail +  '", "phone number" : ' + updatePhone +
	'", "userId" : ' + userId +  '}';

	var url = urlBase + '/api/updatecontact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("updateResult").innerHTML = "Contact Updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("udpateResult").innerHTML = err.message;
	}

}


// Function to register a new user
function doRegister()
{
	// Get variables for JSON payload
	var registerFirst = document.getElementById("inputFirstName").value;
	var registerLast = document.getElementById("inputLastName").value;
	var registerUsername = document.getElementById("inputUserName").value;
	var registerPassword = document.getElementById("inputPassword").value;
	var registerCPassword = document.getElementById("inputCPassword").value;

	if (registerCPassword.localeCompare(registerPassword) != 0)
	{
		alert("Passwords must match");
		return;
	}

	var jsonPayload = {
		username: registerUsername,
		password: registerPassword,
		firstname: registerFirst,
		lastname: registerLast
	};

	var url = '/api/register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(JSON.stringify(jsonPayload));
		var jsonObject = JSON.parse(xhr.responseText);
		if (jsonObject.user_id <= 0)
			throw jsonObject.error;
		alert(jsonObject.user_id);
	}
	catch(err)
	{
		alert(err);
	}
}

// Function to delete contact
// Returns contact ID of user for JSON payload
function deleteContact()
{

}
