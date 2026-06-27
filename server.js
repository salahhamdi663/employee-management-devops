require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const os = require("os");

const pool = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// =========================
// Middlewares
// =========================

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// =========================
// Static Files
// =========================

app.use(express.static(path.join(__dirname, "public")));

// =========================
// Frontend
// =========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// Employee API
// =========================

app.use("/users", employeeRoutes);

// =========================
// Health Check
// =========================

app.get("/health", async (req, res) => {

    try {

        await pool.query("SELECT NOW()");

        res.status(200).json({

            status: "UP",

            database: "Connected",

            timestamp: new Date()

        });

    } catch (err) {

        res.status(500).json({

            status: "DOWN",

            database: "Disconnected"

        });

    }

});

// =========================
// Version
// =========================

app.get("/version", (req, res) => {

    res.json({

        app: "Employee Management",

        version: "2.0.0",

        environment: process.env.NODE_ENV || "development"

    });

});

// =========================
// Metrics
// =========================

app.get("/metrics", async (req, res) => {

    try {

        const result = await pool.query(

            "SELECT COUNT(*) FROM employees"

        );

        const memory = process.memoryUsage();

        res.json({

            employees: result.rows[0].count,

            uptime: Math.floor(process.uptime()),

            hostname: os.hostname(),

            node_version: process.version,

            memory_rss: Math.round(memory.rss / 1024 / 1024) + " MB",

            heap_used: Math.round(memory.heapUsed / 1024 / 1024) + " MB"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// =========================
// 404
// =========================

app.use((req, res) => {

    res.status(404).json({

        message: "Route Not Found"

    });

});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("======================================");
    console.log(" Employee Management API Started");
    console.log("======================================");
    console.log(`Server Running : http://localhost:${PORT}`);
    console.log(`Environment    : ${process.env.NODE_ENV || "development"}`);
    console.log("======================================");

});
