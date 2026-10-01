const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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

    db.get(checkSQL, [email], async (err, user) => {

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

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

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
                    hashedPassword,
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
        } catch (hashErr) {
            console.error(hashErr);
            return res.status(500).json({
                message: "Registration failed.",
                error: hashErr.message
            });
        }

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
            password,
            phone,
            user_category
        FROM Users
        WHERE email = ?
    `;

    db.get(
        sql,
        [
            email
        ],
        async (err, user) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Database error.",
                    error: err.message
                });

            }

            // User not found
            if (!user) {

                return res.status(401).json({
                    message: "Invalid email or password."
                });

            }

            try {
                // Verify entered password with stored hash
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {

                    return res.status(401).json({
                        message: "Invalid email or password."
                    });

                }

                // Strip password from returned user object
                const safeUser = {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone,
                    user_category: user.user_category
                };

                // Login successful
                return res.status(200).json({

                    message: "Login successful.",

                    user: safeUser

                });

            } catch (compareErr) {

                console.error(compareErr);

                return res.status(500).json({
                    message: "Authentication error.",
                    error: compareErr.message
                });

            }

        }
    );

});


module.exports = router;