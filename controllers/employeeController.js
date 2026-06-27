const pool = require("../config/db");

// =========================
// Get All Employees
// =========================
exports.getEmployees = async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM employees ORDER BY id ASC"
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};

// =========================
// Add Employee
// =========================
exports.addEmployee = async (req, res) => {

    try {

        const {
            name,
            email,
            age,
            department,
            position,
            status
        } = req.body;

        const image = req.file
            ? "/uploads/" + req.file.filename
            : "/uploads/default.png";

        // =========================
        // Validation
        // =========================

        if (!name || !email || age === undefined || age === null) {

            return res.status(400).json({
                message: "Please fill all required fields"
            });

        }

        const employeeAge = Number(age);

        if (!Number.isInteger(employeeAge)) {

            return res.status(400).json({
                message: "Age must be a valid number"
            });

        }

        if (employeeAge < 18 || employeeAge > 65) {

            return res.status(400).json({
                message: "Age must be between 18 and 65"
            });

        }

        const result = await pool.query(

            `INSERT INTO employees
            (name,email,age,department,position,status,image)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,

            [

                name,
                email,
                employeeAge,
                department || "",
                position || "",
                status || "Active",
                image

            ]

        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Insert Failed"
        });

    }

};

// =========================
// Get Employee By ID
// =========================
exports.getEmployee = async (req, res) => {

    try {

        const result = await pool.query(

            "SELECT * FROM employees WHERE id=$1",

            [req.params.id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Employee Not Found"
            });

        }

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};

// =========================
// Update Employee
// =========================
exports.updateEmployee = async (req, res) => {

    try {

        const {
            name,
            email,
            age,
            department,
            position,
            status
        } = req.body;

        const image = req.file
            ? "/uploads/" + req.file.filename
            : req.body.image;

        if (!name || !email || age === undefined || age === null) {

            return res.status(400).json({
                message: "Please fill all required fields"
            });

        }

        const employeeAge = Number(age);

        if (!Number.isInteger(employeeAge)) {

            return res.status(400).json({
                message: "Age must be a valid number"
            });

        }

        if (employeeAge < 18 || employeeAge > 65) {

            return res.status(400).json({
                message: "Age must be between 18 and 65"
            });

        }

        const result = await pool.query(

            `UPDATE employees
             SET
                name=$1,
                email=$2,
                age=$3,
                department=$4,
                position=$5,
                status=$6,
                image=$7
             WHERE id=$8
             RETURNING *`,

            [
                name,
                email,
                employeeAge,
                department || "",
                position || "",
                status || "Active",
                image,
                req.params.id
            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Employee Not Found"
            });

        }

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Update Failed"
        });

    }

};

// =========================
// Delete Employee
// =========================
exports.deleteEmployee = async (req, res) => {

    try {

        const result = await pool.query(

            "DELETE FROM employees WHERE id = $1 RETURNING *",

            [req.params.id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Employee Not Found"
            });

        }

        res.json({

            message: "Employee Deleted Successfully"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Delete Failed"

        });

    }

};
