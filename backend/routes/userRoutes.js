const express = require("express");
const router = express.Router();

const db = require("../db");

// =====================================
// REGISTER USER
// POST /users/
// =====================================

router.post("/", (req, res) => {

    const {
        full_name,
        email,
        password,
        phone,
        user_category
    } = req.body;

    // Check required fields
    if (!full_name || !email || !password) {

        return res.status(400).json({
            message: "Full name, email and password are required."
        });

    }

    const category = user_category === "Job Seeker" ? "Job Seeker" : "Student";

    // Check whether email already exists
    const checkSQL = `
        SELECT user_id
        FROM Users
        WHERE email = ?
    `;

    db.get(checkSQL, [email], (err, user) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Database error.",
                error: err.message
            });

        }

        // Email already registered
        if (user) {

            return res.status(409).json({
                message: "Email already registered."
            });

        }

        // Insert new user
        const sql = `
            INSERT INTO Users
            (
                full_name,
                email,
                password,
                phone,
                user_category,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const created_at = new Date().toISOString();

        db.run(
            sql,
            [
                full_name,
                email,
                password,
                phone || "",
                category,
                created_at
            ],
            function (err) {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        message: "User insertion failed.",
                        error: err.message
                    });

                }

                return res.status(201).json({

                    message: "User registered successfully!",

                    user: {
                        user_id: this.lastID,
                        full_name: full_name,
                        email: email,
                        phone: phone || "",
                        user_category: category
                    }

                });

            }
        );

    });

});


// =====================================
// LOGIN USER
// POST /users/login
// =====================================

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    // Check fields
    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required."
        });

    }

    const sql = `
        SELECT
            user_id,
            full_name,
            email,
            phone,
            user_category
        FROM Users
        WHERE email = ?
        AND password = ?
    `;

    db.get(
        sql,
        [
            email,
            password
        ],
        (err, user) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Database error.",
                    error: err.message
                });

            }

            // Invalid login
            if (!user) {

                return res.status(401).json({
                    message: "Invalid email or password."
                });

            }

            // Login successful
            return res.status(200).json({

                message: "Login successful.",

                user: user

            });

        }
    );

});


module.exports = router;