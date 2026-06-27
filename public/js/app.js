const api = "/users";

let allUsers = [];

// =====================
// Load Users
// =====================

async function loadUsers() {

    const res = await fetch(api);

    allUsers = await res.json();

    displayUsers(allUsers);

}

// =====================
// Display Users
// =====================

function displayUsers(users) {

    const container = document.getElementById("users");

    container.innerHTML = "";

    if (users.length === 0) {

        container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center">
                No Employees Found
            </div>
        </div>`;

        return;

    }

    users.forEach(user => {

        container.innerHTML += `

<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow h-100">

<img src="${user.image}" class="card-img-top">

<div class="card-body">

<h4 class="card-title">

<i class="fa-solid fa-user"></i>

${user.name}

</h4>

<p>

<i class="fa-solid fa-envelope"></i>

${user.email}

</p>

<p>

<i class="fa-solid fa-cake-candles"></i>

Age : ${user.age}

</p>

</div>

<div class="card-footer bg-white">

<button

class="btn btn-warning"

onclick="editUser('${user.id}')">

<i class="fa-solid fa-pen"></i>

Edit

</button>

<button

class="btn btn-danger"

onclick="deleteUser('${user.id}')">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</div>

</div>

</div>

`;

    });

}

// =====================
// Add User
// =====================

async function addUser() {

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const age = document.getElementById("age").value;

    const image = document.getElementById("image").value;

    if (!name || !email || !age) {

        alert("Please Fill All Fields");

        return;

    }

    await fetch(api, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name,

            email,

            age,

            image

        })

    });

    document.getElementById("name").value = "";

    document.getElementById("email").value = "";

    document.getElementById("age").value = "";

    document.getElementById("image").value = "";

    loadUsers();

}

// =====================
// Delete
// =====================

async function deleteUser(id) {

    if (!confirm("Delete this employee ?")) return;

    await fetch(api + "/" + id, {

        method: "DELETE"

    });

    loadUsers();

}

// =====================
// Search
// =====================

function searchUsers() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = allUsers.filter(user =>

        user.name.toLowerCase().includes(keyword) ||

        user.email.toLowerCase().includes(keyword)

    );

    displayUsers(filtered);

}

// =====================
// Edit
// =====================

async function editUser(id) {

    const user = allUsers.find(u => u.id === id);

    if (!user) return;

    const name = prompt("Name", user.name);

    if (name === null) return;

    const email = prompt("Email", user.email);

    if (email === null) return;

    const age = prompt("Age", user.age);

    if (age === null) return;

    const image = prompt("Image URL", user.image);

    if (image === null) return;

    await fetch(api + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name,

            email,

            age,

            image

        })

    });

    loadUsers();

}

loadUsers();
