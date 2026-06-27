const api = "/users";

let allUsers = [];

// =====================
// Load Users
// =====================

async function loadUsers() {

    const res = await fetch(api);

    allUsers = await res.json();

    displayUsers(allUsers);

    updateDashboard(allUsers);

}

// =====================
// Display Users
// =====================

function displayUsers(users) {

    const container = document.getElementById("users");

    container.innerHTML = "";

    updateDashboard(users);

    if (users.length === 0) {

        container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center">
                No Employees Found
            </div>
        </div>`;

        return;

    }

function updateDashboard(users){

document.getElementById("totalEmployees").innerText = users.length;

const active = users.filter(u=>u.status==="Active").length;

const inactive = users.filter(u=>u.status==="Inactive").length;

const departments = new Set(users.map(u=>u.department)).size;

document.getElementById("activeEmployees").innerText = active;

document.getElementById("inactiveEmployees").innerText = inactive;

document.getElementById("departments").innerText = departments;

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

<p>

<i class="fa-solid fa-building"></i>

${user.department}

</p>

<p>

<i class="fa-solid fa-briefcase"></i>

${user.position}

</p>

<p>

<span class="badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}">

${user.status}

</span>

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
    const department = document.getElementById("department").value;
    const position = document.getElementById("position").value;
    const status = document.getElementById("status").value;

    const image = document.getElementById("image").files[0];

    if (!name || !email || !age) {

        Swal.fire({
            icon: "warning",
            title: "Missing Data",
            text: "Please fill all required fields"
        });

        return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("department", department);
    formData.append("position", position);
    formData.append("status", status);

    if (image) {
        formData.append("image", image);
    }

    const res = await fetch(api, {

        method: "POST",

        body: formData

    });

    if (res.ok) {

        Swal.fire({
            icon: "success",
            title: "Employee Added",
            timer: 1500,
            showConfirmButton: false
        });

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("age").value = "";
        document.getElementById("department").value = "";
        document.getElementById("position").value = "";
        document.getElementById("status").value = "Active";
        document.getElementById("image").value = "";

        loadUsers();

    }

}

// =====================
// Delete
// =====================

async function deleteUser(id){

const result = await Swal.fire({

title:"Delete Employee?",

text:"This action cannot be undone.",

icon:"warning",

showCancelButton:true,

confirmButtonColor:"#d33",

confirmButtonText:"Delete"

});

if(!result.isConfirmed)
return;

await fetch(api+"/"+id,{

method:"DELETE"

});

await loadUsers();

Swal.fire({

icon:"success",

title:"Deleted Successfully",

timer:1500,

showConfirmButton:false

});

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
