const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const employeeController = require("../controllers/employeeController");

// =========================
// Employees Routes
// =========================

// Get All Employees
router.get("/", employeeController.getEmployees);

// Get Employee By ID
router.get("/:id", employeeController.getEmployee);

// Add Employee
router.post(

    "/",

    upload.single("image"),

    employeeController.addEmployee

);

// Update Employee
router.put(

    "/:id",

    upload.single("image"),

    employeeController.updateEmployee

);

// Delete Employee
router.delete(

    "/:id",

    employeeController.deleteEmployee

);

module.exports = router;
