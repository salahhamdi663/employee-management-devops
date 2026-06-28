require("dotenv").config();
const client = require("prom-client");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const os = require("os");

const pool = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// =========================
// Prometheus Metrics
// =========================

const register = new client.Registry();

client.collectDefaultMetrics({
    register
});

const httpRequestsTotal = new client.Counter({
    name: "employee_app_http_requests_total",
    help: "Total HTTP Requests",
    labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestsTotal);

// =========================
// Middlewares
// =========================

app.use(cors());
app.use((req, res, next) => {

    res.on("finish", () => {

        httpRequestsTotal.inc({

            method: req.method,
            route: req.path,
            status: res.statusCode

        });

    });

    next();

});
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

    res.set("Content-Type", register.contentType);

    res.end(await register.metrics());

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
