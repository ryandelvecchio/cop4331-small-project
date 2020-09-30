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
    const fav_activity = $('#addActivity').val();

    $('#addedStatus').text('');

    if (!firstname || !lastname || !email || !phone) {
        return $('#addedStatus').text('Please fill out all fields.');
    }

    const jsonPayload = {
        user_id,
        firstname,
        lastname,
        email,
        phone,
        fav_activity
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

    $("#resultTableBody").empty();

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
                //$('#searchStatus').text('Processing results...');
                let response = JSON.parse(xhr.responseText);

                if (response.results.length === 0) {
                    //return $('#searchStatus').text('No results found.');
                }

                // append each search result to the list of results
                for (let i = 0; i < response.results.length; i++) {
                    addSearchResult(response.results[i]);
                }

                //$('#searchStatus').text('');
            }
        };

        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        //$('#searchStatus').text(err.message);
    }

}

// Function that will append an individual search result to the list
function addSearchResult(result) {

  $("#resultTableBody").append(`
      <tr id="${result.contact_id}">
        <td style="word-wrap: break-word">${result.firstname}</td>
        <td style="word-wrap: break-word">${result.lastname}</td>
        <td style="word-wrap: break-word">${result.email}</td>
        <td style="word-wrap: break-word">${result.phone}</td>
        <td style="word-wrap: break-word">${result.fav_activity}</td>
        <td style="word-wrap: break-word">
          <button style="background-color: transparent; background-repeat: no-repeat; background-image: url(/images/trashCan.svg); width: 1.5em; height: 1.5em; background-position: center; border-radius: 2px; border-style: none" onclick="showDeleteConfirmationElements(this.parentNode.parentNode)">
        </td>
        <td style="word-wrap: break-word">
          <button style="background-color: transparent; background-repeat: no-repeat; background-image: url(/images/updatePencil.svg); width: 1.5em; height: 1.5em; background-position: center; border-radius: 2px; border-style: none" onclick="showUpdateRecordsElements(this.parentNode.parentNode)">
        </td>
      </tr>
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
    const contact_id = $('#updateModal').attr('data-contact_id');
    const firstname = $('#updateFirst').val();
    const lastname = $('#updateLast').val();
    const email = $('#updateEmail').val();
    const phone = $('#updatePhone').val();
    const fav_activity = $('#updateActivity').val();

    // JSON payload with all new contact info from HTML page
    const jsonPayload = {
        contact_id,
        firstname,
        lastname,
        email,
        phone,
        fav_activity
    }

    const url = '/api/updatecontact.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                let response = JSON.parse(xhr.responseText);
                if (response.error == "")
                  updateRow(jsonPayload, contact_id);
                $('#updatedStatus').text('Contact Updated');
            }
        };
        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        $('#updatedStatus').text(err.message);
    }
}

function updateRow(jsonPayload, contact_id)
{
  let row = document.getElementById(contact_id);
  row.children[0].textContent = jsonPayload.firstname;
  row.children[1].textContent = jsonPayload.lastname;
  row.children[2].textContent = jsonPayload.email;
  row.children[3].textContent = jsonPayload.phone;
  row.children[4].textContent = jsonPayload.fav_activity;
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
                    if (response.error == "1062")
                      $('#registerStatus').text('Username already taken');
                    else
                      $('#registerStatus').text('Registration Unsuccessful ERROR ' + response.error);
                }
            }
        };

        xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
        $('#registerStatus').text('Registration Unsuccessful ERROR: Unknown');
    }
}

// Function to delete contact
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
