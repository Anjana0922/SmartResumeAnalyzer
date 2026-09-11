const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../db");

const { extractText } = require("../services/pdfService");
const { parseResume } = require("../services/parserService");
const { normalizeResumeData } = require("../services/aiParserService");

// =====================================
// Upload Folder
// =====================================

const uploadFolder = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// =====================================
// Multer Storage
// =====================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({
    storage: storage
});


// =====================================
// Upload Resume
// POST /upload
// =====================================

router.post("/upload", upload.single("resume"), async (req, res) => {

    try {

        // ---------------------------------
        // Check logged-in user
        // ---------------------------------

        const userID = req.body.user_id;

        if (!userID) {

            return res.status(401).json({
                message: "User is not logged in."
            });

        }


        // ---------------------------------
        // Check uploaded file
        // ---------------------------------

        if (!req.file) {

            return res.status(400).json({
                message: "No file uploaded."
            });

        }


        console.log("========== User ID ==========");
        console.log(userID);


        console.log("========== Uploaded File ==========");
        console.log(req.file);


        // =================================
        // Extract Resume Text
        // =================================

        const resumeText = await extractText(req.file.path);

        console.log("\n========== Resume Text ==========\n");
        console.log(resumeText);


        // =================================
        // Parse Resume
        // =================================

        const parsedResume = await parseResume(resumeText);


        // =================================
        // Display Parsed Data
        // =================================

        console.log("\n========== Personal Details ==========");

        console.log(
            "Name :",
            parsedResume.personal.name
        );

        console.log(
            "Email:",
            parsedResume.personal.email
        );

        console.log(
            "Phone:",
            parsedResume.personal.phone
        );

        console.log(
            "Address:",
            parsedResume.personal.address
        );


        console.log("\n========== Education ==========");
        console.log(parsedResume.education);


        console.log("\n========== Skills ==========");
        console.log(parsedResume.skills);


        console.log("\n========== Projects ==========");
        console.log(parsedResume.projects);


        console.log("\n========== Certificates ==========");
        console.log(parsedResume.certificates);


        console.log("\n========== Achievements ==========");
        console.log(parsedResume.achievements);


        console.log("\n========== Languages ==========");
        console.log(parsedResume.languages);


        // =================================
        // Insert into Resume table
        // =================================

        const uploadDate =
            new Date().toISOString().split("T")[0];

        const status = "Uploaded";


        const resumeSQL = `
            INSERT INTO Resume
            (
                user_id,
                file_name,
                file_path,
                upload_date,
                status
            )
            VALUES (?, ?, ?, ?, ?)
        `;


        db.run(

            resumeSQL,

            [
                userID,
                req.file.originalname,
                req.file.path,
                uploadDate,
                status
            ],

            function (err) {

                if (err) {

                    console.error(
                        "Resume insertion error:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Resume insertion failed.",

                        error:
                            err.message

                    });

                }


                const resumeID = this.lastID;


                console.log(
                    "Resume inserted. ID:",
                    resumeID
                );


                // =================================
                // Insert into Resume_Details
                // =================================

                const detailsSQL = `
                    INSERT INTO Resume_Details
                    (
                        resume_id,
                        name,
                        email,
                        phone,
                        education,
                        skills,
                        projects,
                        experience,
                        certifications,
                        achievements,
                        languages,
                        github,
                        linkedin,
                        about,
                        custom_sections
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;


                db.run(

                    detailsSQL,

                    [

                        resumeID,

                        parsedResume.personal?.name || "",

                        parsedResume.personal?.email || "",

                        parsedResume.personal?.phone || "",

                        JSON.stringify(
                            parsedResume.education || []
                        ),

                        JSON.stringify(
                            parsedResume.skills || []
                        ),

                        JSON.stringify(
                            parsedResume.projects || []
                        ),

                        JSON.stringify(
                            parsedResume.experience || []
                        ),

                        JSON.stringify(
                            parsedResume.certificates || []
                        ),

                        JSON.stringify(
                            parsedResume.achievements || []
                        ),

                        JSON.stringify(
                            parsedResume.languages || []
                        ),

                        parsedResume.personal?.github || "",

                        parsedResume.personal?.linkedin || "",

                        parsedResume.about || parsedResume.summary || "",

                        JSON.stringify(
                            parsedResume.custom_sections || []
                        )

                    ],

                    function (err) {

                        if (err) {

                            console.error(
                                "Resume Details insertion error:",
                                err
                            );

                            return res.status(500).json({

                                message:
                                    "Resume Details insertion failed.",

                                error:
                                    err.message

                            });

                        }


                        const resumeDetailsID =
                            this.lastID;


                        console.log(
                            "Resume Details inserted. ID:",
                            resumeDetailsID
                        );


                        // =================================
                        // Success Response
                        // =================================

                        return res.status(200).json({

                            message:
                                "Resume uploaded successfully!",

                            resume_id:
                                resumeID,

                            resume_details_id:
                                resumeDetailsID,

                            parsedResume

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        console.error(
            "Resume processing error:",
            error
        );

        return res.status(500).json({

            message:
                "Resume processing failed.",

            error:
                error.message

        });

    }

});


// =====================================
// Create Resume from Scratch
// POST /create
// =====================================

router.post("/create", async (req, res) => {

    try {

        // ---------------------------------
        // Check logged-in user
        // ---------------------------------

        const userID = req.body.user_id || req.body.metadata?.user_id;

        if (!userID) {

            return res.status(401).json({
                message: "User is not logged in."
            });

        }


        const rawResume = req.body.resumeData || req.body;

        // ---------------------------------
        // Normalize using canonical schema
        // ---------------------------------

        const normalized = normalizeResumeData(rawResume);

        const userCategory =
            req.body.user_category ||
            rawResume.metadata?.user_category ||
            normalized.metadata?.user_category ||
            "Student";

        normalized.metadata = {
            ...normalized.metadata,
            source: "scratch",
            user_category: userCategory,
            last_updated: new Date().toISOString()
        };


        // ---------------------------------
        // Validate required fields
        // ---------------------------------

        if (!normalized.personal?.name || normalized.personal.name.trim() === "") {

            return res.status(400).json({
                message: "Full name is required."
            });

        }

        if (!normalized.personal?.email || normalized.personal.email.trim() === "") {

            return res.status(400).json({
                message: "Email is required."
            });

        }


        // ---------------------------------
        // Insert into Resume table
        // ---------------------------------

        const fileName = `${normalized.personal.name} - Resume (Created)`;
        const filePath = "";
        const status = "Created";

        const resumeSQL = `
            INSERT INTO Resume
            (
                user_id,
                file_name,
                file_path,
                upload_date,
                status
            )
            VALUES (?, ?, ?, datetime('now'), ?)
        `;

        db.run(
            resumeSQL,
            [userID, fileName, filePath, status],
            function (err) {

                if (err) {

                    console.error("Resume insert error:", err);

                    return res.status(500).json({
                        message: "Failed to create resume entry in database.",
                        error: err.message
                    });

                }

                const resumeID = this.lastID;
                console.log("Resume created with ID:", resumeID);


                // ---------------------------------
                // Insert into Resume_Details table
                // ---------------------------------

                const metadataToStore = {
                    ...normalized.metadata,
                    title: normalized.personal?.title || "",
                    location: normalized.personal?.location || "",
                    portfolio_url: normalized.personal?.portfolio_url || ""
                };

                const detailsSQL = `
                    INSERT INTO Resume_Details
                    (
                        resume_id,
                        name,
                        email,
                        phone,
                        education,
                        skills,
                        projects,
                        experience,
                        certifications,
                        achievements,
                        languages,
                        github,
                        linkedin,
                        about,
                        custom_sections,
                        metadata
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.run(
                    detailsSQL,
                    [
                        resumeID,
                        normalized.personal?.name || "",
                        normalized.personal?.email || "",
                        normalized.personal?.phone || "",
                        JSON.stringify(normalized.education || []),
                        JSON.stringify(normalized.skills || {}),
                        JSON.stringify(normalized.projects || []),
                        JSON.stringify(normalized.experience || []),
                        JSON.stringify(normalized.certificates || []),
                        JSON.stringify(normalized.achievements || []),
                        JSON.stringify(normalized.languages || []),
                        normalized.personal?.github || "",
                        normalized.personal?.linkedin || "",
                        normalized.about || normalized.summary || "",
                        JSON.stringify(normalized.custom_sections || []),
                        JSON.stringify(metadataToStore)
                    ],
                    function (detailsErr) {

                        if (detailsErr) {

                            console.error("Resume_Details insert error:", detailsErr);

                            return res.status(500).json({
                                message: "Failed to save resume details.",
                                error: detailsErr.message
                            });

                        }

                        const resumeDetailsID = this.lastID;
                        console.log("Resume_Details created with ID:", resumeDetailsID);

                        return res.status(201).json({
                            message: "Resume created successfully!",
                            resume_id: resumeID,
                            resume_details_id: resumeDetailsID,
                            resume: normalized
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error("Error creating resume from scratch:", error);

        return res.status(500).json({
            message: "Internal server error while creating resume.",
            error: error.message
        });

    }

});


// =====================================
// Get Resume Details
// GET /:resumeId
// =====================================

router.get("/:resumeId", (req, res) => {

    const resumeId = req.params.resumeId;

    const sql = `
        SELECT *
        FROM Resume_Details
        WHERE resume_id = ?
    `;

    db.get(
        sql,
        [resumeId],
        (err, row) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Failed to fetch resume details.",
                    error: err.message
                });

            }

            if (!row) {

                return res.status(404).json({
                    message: "Resume details not found."
                });

            }

            // =================================
            // Parse Database JSON strings
            // =================================

            let education = [];
            let rawSkills = [];
            let projects = [];
            let experience = [];
            let certificates = [];
            let achievements = [];
            let languages = [];
            let custom_sections = [];
            let about = row.about || "";
            let metadata = {};

            try {
                metadata = JSON.parse(row.metadata || "{}");
            } catch (e) {
                metadata = {};
            }

            try {

                education = JSON.parse(row.education || "[]");
                rawSkills = JSON.parse(row.skills || "[]");
                projects = JSON.parse(row.projects || "[]");
                experience = JSON.parse(row.experience || "[]");
                certificates = JSON.parse(row.certifications || "[]");
                achievements = JSON.parse(row.achievements || "[]");
                languages = JSON.parse(row.languages || "[]");
                custom_sections = JSON.parse(row.custom_sections || "[]");

            } catch (error) {

                console.error("JSON parsing error:", error);

                return res.status(500).json({
                    message: "Invalid JSON data in database.",
                    error: error.message
                });

            }

            // =================================
            // Categorized & Unified Skills
            // =================================

            let flatSkills = [];
            let categorizedSkills = {
                technical: [],
                frameworks: [],
                tools: [],
                soft: [],
                all: []
            };

            if (Array.isArray(rawSkills)) {
                flatSkills = rawSkills.map(s => String(s).trim()).filter(Boolean);
                categorizedSkills.technical = [...flatSkills];
                categorizedSkills.all = [...flatSkills];
            } else if (rawSkills && typeof rawSkills === "object") {
                for (const [key, val] of Object.entries(rawSkills)) {
                    if (Array.isArray(val)) {
                        const cleaned = val.map(s => String(s).trim()).filter(Boolean);
                        if (key in categorizedSkills) {
                            categorizedSkills[key] = cleaned;
                        } else {
                            categorizedSkills.technical.push(...cleaned);
                        }
                        flatSkills.push(...cleaned);
                    }
                }
                categorizedSkills.all = categorizedSkills.all.length > 0
                    ? categorizedSkills.all
                    : Array.from(new Set(flatSkills));
                flatSkills = categorizedSkills.all;
            }

            // =================================
            // Create Canonical Resume Object
            // =================================

            const resumeDetails = {

                resume_details_id: row.resume_details_id,

                resume_id: row.resume_id,

                metadata: {
                    version: metadata.version || "1.0",
                    source: metadata.source || "upload",
                    user_category: metadata.user_category || "Student",
                    last_updated: metadata.last_updated || null
                },

                personal: {
                    name: row.name || "",
                    title: metadata.title || "",
                    email: row.email || "",
                    phone: row.phone || "",
                    location: metadata.location || "",
                    github: row.github || "",
                    linkedin: row.linkedin || "",
                    portfolio_url: metadata.portfolio_url || ""
                },

                about,
                summary: about,
                education,
                experience,
                skills: categorizedSkills,
                categorized_skills: categorizedSkills,
                flat_skills: flatSkills,
                projects,
                certificates,
                achievements,
                languages,
                custom_sections,

                github: row.github || "",
                linkedin: row.linkedin || ""

            };

            return res.status(200).json({
                message: "Resume details fetched successfully.",
                resume: resumeDetails
            });

        }
    );

});


module.exports = router;