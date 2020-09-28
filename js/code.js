let user_id = -1;
let firstname = "";
let lastname = "";

function doLogin() {
    const username = $('#username').val();
    const password = $('#password').val();

    const jsonPayload = {
        username,
        password
    }

    const url = '/api/login.php';

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
    const firstname = $('#addFirst').val();
    const lastname = $('#addLast').val();
    const email = $('#addEmail').val();
    const phone = $('#addPhone').val();

    $('#addedStatus').text('');

    if (!firstname || !lastname || !email || !phone) {
        return $('#addedStatus').text('Please fill out all fields.');
    }

    const jsonPayload = {
        user_id,
        firstname,
        lastname,
        email,
        phone
    }

    const url = '/api/addcontact.php';

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

    const query = $('#searchBox').val();

    $('#resultContainer').empty();

    const jsonPayload = {
        query,
        user_id
    }

    const url = '/api/search.php';

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
    $('#resultContainer').append(`
        <div id="${result.contact_id}">
            <span>${result.firstname} ${result.lastname}</span>
            <input class="btn btn-primary" type="button" id="deleteButton" value="Delete" onclick="showDeleteConfirmationElements(this.parentNode.id)">
            <input class="btn btn-primary" type="button" id="updateButton" value="Update" onclick="showUpdateRecordsElements(this.parentNode.id)"/>
        </div>
    `);
}

function closeUpdateForm() {
    $('#updateForm').trigger("reset");
    document.getElementById("uForm").style.display = "none";
    document.getElementById("uContainer").style.display = "none";
}

// Function to submit a change to a Contact
function submitUpdate() {
    // Get the elements from HTML and put in JSON payload
    const contact_id = $('#uContainer').attr('data-contact_id');
    const firstname = $('#updateFirst').val();
    const lastname = $('#updateLast').val();
    const email = $('#updateEmail').val();
    const phone = $('#updatePhone').val();

    // JSON payload with all new contact info from HTML page
    const jsonPayload = {
        contact_id,
        firstname,
        lastname,
        email,
        phone
    }

    const url = '/api/updatecontact.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $('#updatedStatus').text('Contact Updated');
                $('#resultContainer').empty();
                closeUpdateForm();
            }
        };
        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        $('#updatedStatus').text(err.message);
    }

}


// Function to register a new user
function doRegister() {
    // Get letiables for JSON payload
    const firstname = $('#registerFirst').val();
    const lastname = $('#registerLast').val();
    const username = $('#registerUsername').val();
    const password = $('#registerPassword').val();
    const passwordC = $('#registerCPassword').val();

    if (passwordC.localeCompare(password) != 0) {
        $('#registerStatus').text('Passwords do not match.');
        return;
    }

    const jsonPayload = {
        username,
        password,
        firstname,
        lastname
    };

    const url = '/api/register.php';

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
function deleteContact() {
    const contact_id = $('#deleteModal').attr('data-contact_id');

    const jsonPayload = {
        contact_id
    }

    const url = '/api/deletecontact.php';

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