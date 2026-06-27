const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve Frontend
app.use(express.static(path.join(__dirname, "public")));

const DB = path.join(__dirname, "data", "users.json");

// ======================
// Helper Functions
// ======================

function readUsers() {
    if (!fs.existsSync(DB)) {
        fs.writeFileSync(DB, "[]");
    }

    return JSON.parse(fs.readFileSync(DB, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(DB, JSON.stringify(users, null, 2));
}

// ======================
// Frontend
// ======================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Health Check
// ======================

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Application is healthy"
    });
});

// ======================
// Get All Users
// ======================

app.get("/users", (req, res) => {
    res.json(readUsers());
});

// ======================
// Get User By ID
// ======================

app.get("/users/:id", (req, res) => {

    const users = readUsers();

    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);

});

// ======================
// Add User
// ======================

app.post("/users", (req, res) => {

    const { name, email, age, image } = req.body;

    if (!name || !email || !age) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const users = readUsers();

    const newUser = {
        id: uuid(),
        name,
        email,
        age,
        image: image || "https://i.pravatar.cc/300"
    };

    users.push(newUser);

    saveUsers(users);

    res.status(201).json(newUser);

});

// ======================
// Update User
// ======================

app.put("/users/:id", (req, res) => {

    const users = readUsers();

    const index = users.findIndex(user => user.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    users[index] = {
        ...users[index],
        ...req.body
    };

    saveUsers(users);

    res.json(users[index]);

});

// ======================
// Delete User
// ======================

app.delete("/users/:id", (req, res) => {

    const users = readUsers();

    const filteredUsers = users.filter(user => user.id !== req.params.id);

    if (filteredUsers.length === users.length) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    saveUsers(filteredUsers);

    res.json({
        message: "User deleted successfully"
    });

});

// ======================
// 404
// ======================

app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
