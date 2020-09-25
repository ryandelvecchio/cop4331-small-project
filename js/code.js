let user_id = -1;
let firstname = "";
let lastname = "";

function doLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let jsonPayload = {
        username,
        password
    }

    let url = '/api/login.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.send(JSON.stringify(jsonPayload));

        let jsonObject = JSON.parse(xhr.responseText);

        user_id = jsonObject.user_id;

        if (user_id <= 0) {
            throw jsonObject.error;
        }

        firstname = jsonObject.firstname;
        lastname = jsonObject.lastname;

        saveCookie();

        window.location.href = "html/home.html";
    } catch (err) {
        alert(err);
    }

}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstname=" + firstname + ",lastname=" + lastname + ",user_id=" + user_id + ";expires=" + date.toGMTString();
}

function enforceSession() {
    if (user_id < 0) {
        window.location.href = '../index.html';
    }
}

function readCookie() {
    user_id = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstname") {
            firstname = tokens[1];
        } else if (tokens[0] == "lastname") {
            lastname = tokens[1];
        } else if (tokens[0] == "user_id") {
            user_id = parseInt(tokens[1].trim());
        }
    }
}

function doLogout() {
    user_id = -1;
    firstname = "";
    lastname = "";
    document.cookie = "firstname= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

// Add a new contact
// Returns a JSON payload with new contact info
function addContact() {
    // letiables for JSON payload
    let firstname = document.getElementById("addFirst").value;
    let lastname = document.getElementById("addLast").value;
    let email = document.getElementById("addEmail").value;
    let phone = document.getElementById("addPhone").value;

    $('#addedStatus').text('');

    if (!firstname || !lastname || !email || !phone) {
        return $('#addedStatus').text('Please fill out all fields.');
    }

    let jsonPayload = {
        user_id,
        firstname,
        lastname,
        email,
        phone
    }

    let url = '/api/addcontact.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $('#addedStatus').text('Contact added to your list');
                $('#addForm').trigger('reset');
            }
        };
        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        $('#addedStatus').text(err.message);
    }

}


// Search for a contact by any string
function submitSearch() {
    $('#searchStatus').text('Searching...');

    let query = document.getElementById("searchBox").value;

    $('#resultContainer').empty();

    // empty search list to start
    let searchList = "";

    let jsonPayload = {
        query: query,
        user_id: user_id
    }

    let url = '/api/search.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $('#searchStatus').text('Processing results...');
                let response = JSON.parse(xhr.responseText);

                if (response.results.length === 0) {
                	return $('#searchStatus').text('No results found.');
                }

                // append each search result to the list of results
                for (let i = 0; i < response.results.length; i++) {
                    addSearchResult(response.results[i]);
                }

                $('#searchStatus').text('');
            }
        };

        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        $('#searchStatus').text(err.message);
    }

}

// Function that will append an individual search result to the list
function addSearchResult(result) {
    // probably a better way to do this, but i think each button should have a unique id
    let updateButtonId = "updateButton_" + result.contact_id;
    let deleteButtonId = "deleteButton_" + result.contact_id;
    $('#resultContainer').append(`
        <div id="${result.contact_id}">
            <span>${result.firstname} ${result.lastname}</span>
            <input class="btn btn-primary" type="button" id="${deleteButtonId}" value="Delete" onclick="deleteContact(this.parentNode.id)" class="show">
            <input class="btn btn-primary" type="button" id="${updateButtonId}" value="Update" onclick="showUpdateRecordsElements(this.parentNode.id)" class="show"/>
        </div>
    `);
}

// Function to submit a change to a Contact
function submitContactUpdate()
{
    let contact_id = document.getElementById("uContainer").getAttribute("data-contact_id");

    // Get the elements from HTML and put in JSON payload
    let firstname = document.getElementById("uFirst").value;
    let lastname = document.getElementById("uLast").value;
    let email = document.getElementById("uEmail").value;
    let phone = document.getElementById("uPhone").value;

    // FIXME: I think this may be a pop up but consult Brandon
    // document.getElementById("updateResult").innerHTML = "";

    // JSON payload with all new contact info from HTML page
    let jsonPayload = {
        contact_id,
        firstname,
        lastname,
        email,
        phone
    }

    let url = '/api/updatecontact.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $('#uForm').trigger('reset');
                document.getElementById("updatedStatus").innerHTML = "Contact Updated";
            }
        };
        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        document.getElementById("updatedStatus").innerHTML = err.message;
    }

}


// Function to register a new user
function doRegister() {
    // Get letiables for JSON payload
    let firstname = document.getElementById("inputFirstName").value;
    let lastname = document.getElementById("inputLastName").value;
    let username = document.getElementById("inputUserName").value;
    let password = document.getElementById("inputPassword").value;
    let passwordC = document.getElementById("inputCPassword").value;

    if (passwordC.localeCompare(password) != 0) {
        $('#registerStatus').text('Passwords do not match.');
        return;
    }

    let jsonPayload = {
        username,
        password,
        firstname,
        lastname
    };

    let url = '/api/register.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.error === '') {
                    window.location.href = '../index.html';
                } else {
                    //TODO: handle registration errors
                }
            }
        };

        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        $('#registerStatus').text('Unknown error, please try again later.');
    }
}

// Function to delete contact
// Returns contact ID of user for JSON payload
function deleteContact(contact_id) {
    let jsonPayload = {
        contact_id
    }

    let url = '/api/deletecontact.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.error === '') {
                    // Remove the user from the HTML search Display
                    $(`#${contact_id}`).remove();
                } else {
                    //TODO: handle delete errors
                }
            }
        };
        // Send the contact_id
        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        alert(err);
    }
}
