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

	//encode the password using md5.js hash function
	//var hash = md5(password);

	//document.getElementById("loginResult").innerHTML = "";

  //var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = 'api//login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;

		if( userId < 1 )
		{
			//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstname = jsonObject.firstname;
		lastname = jsonObject.lastname;

		saveCookie();

		window.location.href = "home.html";
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
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
	// FIXME: Didn't see these fields in the HTML code so we need to make
	// an input for them
	var newFirstName = document.getElementById("newFirstName").value;
	var newLastName = document.getElementById("newLastName").value;
	var newEmail = document.getElementById("newEmail").value;
	var newPhoneNumber = document.getElementById("newPhoneNumber").value;


	document.getElementById("addResult").innerHTML = "";

	// JSON payload with all new contact info from HTML page
	var jsonPayload = '{"first name" : "' + newFirstName + '", "last name" : ' + newLastName +
	'", "email" : ' + newEmail +  '", "phone number" : ' + newPhoneNumber + '}';

	// FIXME: rename based on endpoint name for the PHP file
	var url = urlBase + '/api/addContact.' + extension;

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


// Search for a contact by first name
function searchContacts()
{
	var srch = document.getElementById("firstnameSearch").value;


	// FIXME: where is the search result in the register.HTML?
	document.getElementById("colorSearchResult").innerHTML = "";

	var searchList = "";

	// json payload with first name to search and userID of person searching
	var jsonPayload = '{"first name" : "' + srch + '","userId" : ' + userId + '}';

	// FIXME: change /SearchNames to whatever PHP file name we use
	var url = urlBase + '/api/SearchNames.' + extension;

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
				document.getElementsByTagName("p")[0].innerHTML = SearchList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SearchResult").innerHTML = err.message;
	}

}
