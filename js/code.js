let user_id = -1;
let firstname = "";
let lastname = "";

async function doLogin() {
    const username = $('#username').val();
    const password = $('#password').val();

    const jsonPayload = {
        username,
        password
    }

    const url = '/api/login.php';

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
    }

    try {
        const response = await fetch(url, settings);
        if (response.ok) {
            const data = await response.json();
            if (data.error) {
                $('#loginStatus').text(data.error);
                return;
            }

            user_id = data.user_id;

            if (user_id <= 0) {
                $('#loginStatus').text('Invalid Username/Password');
                return;
            }

            firstname = data.firstname;
            lastname = data.lastname;

            saveCookie();

            window.location.href = "html/home.html";
        } else {
            $('#loginStatus').text(data.error);
        }
    } catch (err) {
        $('#loginStatus').text('Unknown Error');
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
async function addContact() {
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

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
    }

    const response = await fetch(url, settings);
    if (response.ok) {
        const data = await response.json();
        if (data.error) {
            $('#addedStatus').text(data.error);
            return;
        }

        $('#addedStatus').text('Contact added to your list');
        $('#addForm').trigger('reset');
    } else {
        $('#addedStatus').text(data.error);
    }
}

// Search for a contact by any string
async function submitSearch() {
    $('#searchStatus').text('Searching...');

    const query = $('#searchBox').val();

    $("#resultTableBody").empty();

    const jsonPayload = {
        query,
        user_id
    }

    const url = '/api/search.php';

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
    }

    const response = await fetch(url, settings);
    if (response.ok) {
        const data = await response.json();
        if (data.error) {
            $('#searchStatus').text(data.error);
            return;
        }

        const results = data.results;

        if (results.length === 0) {
            $('#searchStatus').text('No results found');
            return;
        }

        $('#searchStatus').text('');

        // append each search result to the list of results
        for (let i = 0; i < data.results.length; i++) {
            addSearchResult(data.results[i]);
        }
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
async function submitUpdate() {
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

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
    }

    const response = await fetch(url, settings);
    if (response.ok) {
        const data = await response.json();
        if (data.error) {
            $('#updateStatus').text(data.error);
            return;
        }

        updateRow(jsonPayload, contact_id);
        $('#updatedStatus').text('Contact Updated');
    }
}

function updateRow(jsonPayload, contact_id) {
    let row = document.getElementById(contact_id);
    row.children[0].textContent = jsonPayload.firstname;
    row.children[1].textContent = jsonPayload.lastname;
    row.children[2].textContent = jsonPayload.email;
    row.children[3].textContent = jsonPayload.phone;
    row.children[4].textContent = jsonPayload.fav_activity;
}

// Function to register a new user
async function doRegister() {
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

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
    }

    const response = await fetch(url, settings);
    if (response.ok) {
        const data = await response.json();

        if (data.error) {
            $('#registerStatus').text(data.error);
            return;
        }

        window.location.href = '../index.html';
    }
}

// Function to delete contact
async function deleteContact() {
    const contact_id = $('#deleteModal').attr('data-contact_id');

    const jsonPayload = {
        contact_id
    }

    const url = '/api/deletecontact.php';

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
    }

    const response = await fetch(url, settings);
    if (response.ok) {
        const data = await response.json();

        if (data.error) {
            return;
        }

        $(`#${contact_id}`).remove();
    }
}