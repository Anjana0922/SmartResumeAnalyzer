const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../db");

const { extractText } = require("../services/pdfService");
const { parseResume } = require("../services/parserService");
const { normalizeResumeData } = require("../services/aiParserService");
const { GoogleGenAI } = require("@google/genai");

// =====================================
// Upload Folder
// =====================================

const uploadFolder = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// =====================================
// Multer Storage (Resumes)
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
// Multer Storage (Profile Photos)
// =====================================

const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase() || ".png";
        cb(null, "photo-" + Date.now() + ext);
    }
});

const uploadPhoto = multer({
    storage: photoStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: function (req, file, cb) {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
        const mime = (file.mimetype || "").toLowerCase();
        if (allowed.test(ext) || allowed.test(mime)) {
            return cb(null, true);
        }
        cb(new Error("Only JPEG, JPG, PNG, and WEBP image files under 5MB are allowed."));
    }
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
                    portfolio_url: normalized.personal?.portfolio_url || "",
                    photo_path: rawResume.personal?.photo || rawResume.metadata?.photo_path || ""
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
// Get User Resumes
// GET /my-resumes & GET /user/:userId
// =====================================

async function handleGetUserResumes(req, res) {
    try {
        const userId = req.params.userId || req.query.user_id || req.headers["x-user-id"];

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required to fetch resumes."
            });
        }

        const sql = `
            SELECT 
                r.resume_id,
                r.user_id,
                r.file_name,
                r.file_path,
                r.upload_date,
                r.status,
                d.name,
                d.email,
                d.phone,
                d.about,
                d.metadata,
                (SELECT p.portfolio_id FROM portfolio p WHERE p.resume_id = r.resume_id ORDER BY p.portfolio_id DESC LIMIT 1) AS portfolio_id,
                (SELECT p.template_name FROM portfolio p WHERE p.resume_id = r.resume_id ORDER BY p.template_name DESC LIMIT 1) AS portfolio_template
            FROM resume r
            LEFT JOIN resume_details d ON r.resume_id = d.resume_id
            WHERE r.user_id = ?
            ORDER BY r.resume_id DESC
        `;

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.error("Error fetching user resumes:", err);
                return res.status(500).json({
                    message: "Failed to retrieve user resumes.",
                    error: err.message
                });
            }

            const resumes = (rows || []).map((row) => {
                let meta = {};
                try {
                    meta = JSON.parse(row.metadata || "{}");
                } catch (e) {
                    meta = {};
                }

                const source = meta.source || (row.status === "Created" ? "scratch" : "upload");
                const careerTarget = meta.career_target || meta.user_category || meta.title || "Professional";

                return {
                    resume_id: row.resume_id,
                    user_id: row.user_id,
                    file_name: row.file_name,
                    file_path: row.file_path,
                    upload_date: row.upload_date,
                    last_updated: meta.last_updated || row.upload_date,
                    status: row.status,
                    source: source,
                    name: row.name || meta.name || "Untitled Resume",
                    title: meta.title || "",
                    email: row.email || "",
                    phone: row.phone || "",
                    location: meta.location || "",
                    photo: meta.photo_path || "",
                    career_target: careerTarget,
                    user_category: meta.user_category || "General",
                    template: meta.template || "classic",
                    about: row.about || "",
                    portfolio_id: row.portfolio_id || null,
                    portfolio_template: row.portfolio_template || null
                };
            });

            return res.status(200).json({
                message: "Resumes retrieved successfully.",
                resumes
            });
        });
    } catch (error) {
        console.error("Error in handleGetUserResumes:", error);
        return res.status(500).json({
            message: "Internal server error fetching resumes.",
            error: error.message
        });
    }
}

router.get("/my-resumes", handleGetUserResumes);
router.get("/user/:userId", handleGetUserResumes);


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
                    portfolio_url: metadata.portfolio_url || "",
                    photo: metadata.photo_path || ""
                },

                photo_path: metadata.photo_path || "",
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


// =====================================
// Upload Profile Photo
// POST /upload-photo
// =====================================

router.post("/upload-photo", (req, res) => {
    uploadPhoto.single("photo")(req, res, function (err) {
        if (err) {
            console.error("Photo upload error:", err.message);
            return res.status(400).json({
                message: err.message || "Failed to upload photo."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No photo file provided."
            });
        }

        const relativePath = `/uploads/${req.file.filename}`;
        console.log("Photo uploaded successfully:", relativePath);

        return res.status(200).json({
            message: "Profile photo uploaded successfully!",
            photo_path: relativePath,
            url: `http://localhost:5000${relativePath}`
        });
    });
});


// =====================================
// Update Resume (Same-Record In-Place)
// PUT /:resumeId
// =====================================

router.put("/:resumeId", (req, res) => {
    try {
        const resumeId = req.params.resumeId;

        if (!resumeId) {
            return res.status(400).json({ message: "Resume ID is required." });
        }

        db.get(
            "SELECT * FROM Resume_Details WHERE resume_id = ?",
            [resumeId],
            (findErr, existingRow) => {
                if (findErr) {
                    console.error("Database query error:", findErr);
                    return res.status(500).json({
                        message: "Failed to query existing resume.",
                        error: findErr.message
                    });
                }

                if (!existingRow) {
                    return res.status(404).json({
                        message: `Resume with ID ${resumeId} not found.`
                    });
                }

                const rawResume = req.body.resumeData || req.body;
                const normalized = normalizeResumeData(rawResume);

                if (!normalized.personal?.name) {
                    return res.status(400).json({
                        message: "Full Name is required."
                    });
                }

                if (!normalized.personal?.email) {
                    return res.status(400).json({
                        message: "Email is required."
                    });
                }

                let previousMetadata = {};
                try {
                    previousMetadata = JSON.parse(existingRow.metadata || "{}");
                } catch (e) {
                    previousMetadata = {};
                }

                const userCategory =
                    req.body.user_category ||
                    rawResume.metadata?.user_category ||
                    previousMetadata.user_category ||
                    "Student";

                const photoPath =
                    rawResume.personal?.photo ||
                    rawResume.metadata?.photo_path ||
                    previousMetadata.photo_path ||
                    "";

                const mergedMetadata = {
                    ...previousMetadata,
                    version: "1.0",
                    source: previousMetadata.source || "scratch",
                    user_category: userCategory,
                    last_updated: new Date().toISOString(),
                    title: normalized.personal.title || "",
                    location: normalized.personal.location || "",
                    portfolio_url: normalized.personal.portfolio_url || "",
                    photo_path: photoPath
                };

                const educationJSON = JSON.stringify(normalized.education || []);
                const skillsJSON = JSON.stringify(normalized.skills || {});
                const projectsJSON = JSON.stringify(normalized.projects || []);
                const experienceJSON = JSON.stringify(normalized.experience || []);
                const certificatesJSON = JSON.stringify(normalized.certificates || []);
                const achievementsJSON = JSON.stringify(normalized.achievements || []);
                const languagesJSON = JSON.stringify(normalized.languages || []);
                const customSectionsJSON = JSON.stringify(normalized.custom_sections || []);
                const metadataJSON = JSON.stringify(mergedMetadata);
                const aboutText = normalized.summary || normalized.about || "";

                // 1. Update Resume table in-place (no new row)
                const updateResumeSql = `
                    UPDATE Resume
                    SET file_name = ?,
                        upload_date = CURRENT_TIMESTAMP
                    WHERE resume_id = ?
                `;

                const updatedFileName = `${normalized.personal.name} - Resume (Updated)`;

                db.run(updateResumeSql, [updatedFileName, resumeId], function (resErr) {
                    if (resErr) {
                        console.error("Resume table update error:", resErr);
                        return res.status(500).json({
                            message: "Failed to update Resume record.",
                            error: resErr.message
                        });
                    }

                    // 2. Update Resume_Details table in-place (no new row)
                    const updateDetailsSql = `
                        UPDATE Resume_Details
                        SET name = ?,
                            email = ?,
                            phone = ?,
                            education = ?,
                            skills = ?,
                            projects = ?,
                            experience = ?,
                            certifications = ?,
                            achievements = ?,
                            languages = ?,
                            github = ?,
                            linkedin = ?,
                            about = ?,
                            custom_sections = ?,
                            metadata = ?
                        WHERE resume_id = ?
                    `;

                    db.run(
                        updateDetailsSql,
                        [
                            normalized.personal.name,
                            normalized.personal.email,
                            normalized.personal.phone,
                            educationJSON,
                            skillsJSON,
                            projectsJSON,
                            experienceJSON,
                            certificatesJSON,
                            achievementsJSON,
                            languagesJSON,
                            normalized.personal.github,
                            normalized.personal.linkedin,
                            aboutText,
                            customSectionsJSON,
                            metadataJSON,
                            resumeId
                        ],
                        function (detailsErr) {
                            if (detailsErr) {
                                console.error("Resume_Details update error:", detailsErr);
                                return res.status(500).json({
                                    message: "Failed to update resume details.",
                                    error: detailsErr.message
                                });
                            }

                            console.log(`Resume #${resumeId} successfully updated in-place (0 duplicate rows).`);

                            normalized.personal.photo = photoPath;
                            normalized.metadata = mergedMetadata;

                            return res.status(200).json({
                                message: "Resume updated successfully!",
                                resume_id: Number(resumeId),
                                resume: normalized
                            });
                        }
                    );
                });
            }
        );
    } catch (error) {
        console.error("Error updating resume:", error);
        return res.status(500).json({
            message: "Internal server error while updating resume.",
            error: error.message
        });
    }
});


// =====================================
// Delete Resume (Cascading)
// DELETE /:resumeId
// =====================================

router.delete("/:resumeId", (req, res) => {
    try {
        const resumeId = req.params.resumeId;
        const userId = req.body?.user_id || req.query?.user_id || req.headers["x-user-id"];

        if (!resumeId) {
            return res.status(400).json({ message: "Resume ID is required." });
        }

        // 1. Verify existence and ownership
        db.get("SELECT * FROM Resume WHERE resume_id = ?", [resumeId], (checkErr, resumeRow) => {
            if (checkErr) {
                console.error("Error finding resume for deletion:", checkErr);
                return res.status(500).json({
                    message: "Database error checking resume.",
                    error: checkErr.message
                });
            }

            if (!resumeRow) {
                return res.status(404).json({ message: `Resume #${resumeId} not found.` });
            }

            // If userId was provided, verify ownership
            if (userId && String(resumeRow.user_id) !== String(userId)) {
                return res.status(403).json({
                    message: "Unauthorized: You do not have permission to delete this resume."
                });
            }

            // 2. Safely unlink uploaded file if it exists
            if (resumeRow.file_path && typeof resumeRow.file_path === "string" && resumeRow.file_path.trim() !== "") {
                try {
                    if (fs.existsSync(resumeRow.file_path)) {
                        fs.unlinkSync(resumeRow.file_path);
                    }
                } catch (fsErr) {
                    console.warn("Could not delete physical resume file:", fsErr.message);
                }
            }

            // 3. Cascade delete across all related tables
            db.serialize(() => {
                db.run("DELETE FROM Resume_Details WHERE resume_id = ?", [resumeId]);
                db.run("DELETE FROM Resume_Analysis WHERE resume_id = ?", [resumeId]);
                db.run("DELETE FROM portfolio WHERE resume_id = ?", [resumeId]);
                db.run("DELETE FROM Resume WHERE resume_id = ?", [resumeId], function (delErr) {
                    if (delErr) {
                        console.error("Error deleting resume:", delErr);
                        return res.status(500).json({
                            message: "Failed to delete resume.",
                            error: delErr.message
                        });
                    }

                    console.log(`Resume #${resumeId} and all associated records deleted successfully.`);
                    return res.status(200).json({
                        message: "Resume deleted successfully.",
                        resume_id: parseInt(resumeId, 10)
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error in delete resume route:", error);
        return res.status(500).json({
            message: "Internal server error deleting resume.",
            error: error.message
        });
    }
});


// =====================================
// AI About Generator Helper
// =====================================

async function generateAboutSummary({ style = "professional", resumeData = {}, userCategory = "Student" }) {
    const apiKey = process.env.GEMINI_API_KEY;
    const normalizedStyle = String(style).toLowerCase().trim() || "professional";

    const personal = resumeData.personal || {};
    const metadata = resumeData.metadata || {};
    const education = Array.isArray(resumeData.education) ? resumeData.education : [];
    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
    const certificates = Array.isArray(resumeData.certificates || resumeData.certifications)
        ? (resumeData.certificates || resumeData.certifications)
        : [];
    const skillsObj = resumeData.skills || {};

    let skillsList = [];
    if (Array.isArray(skillsObj.all) && skillsObj.all.length > 0) {
        skillsList = skillsObj.all;
    } else if (Array.isArray(skillsObj)) {
        skillsList = skillsObj;
    } else if (typeof skillsObj === "object" && skillsObj !== null) {
        for (const val of Object.values(skillsObj)) {
            if (Array.isArray(val)) {
                skillsList.push(...val);
            }
        }
    }
    skillsList = Array.from(new Set(skillsList.map(String).map(s => s.trim()).filter(Boolean)));

    const candidateName = personal.name || "Candidate";
    const candidateTitle =
        personal.title ||
        metadata.title ||
        metadata.career_target ||
        (userCategory === "Student" ? "Aspiring Professional" : "Dedicated Professional");

    const primaryDegree = education[0]?.degree
        ? `${education[0].degree}${education[0].institution ? ` from ${education[0].institution}` : ""}`
        : "";
    const recentRole = experience[0]?.role
        ? `${experience[0].role}${experience[0].company ? ` at ${experience[0].company}` : ""}`
        : "";
    const topProjects = projects.slice(0, 2).map(p => p.title).filter(Boolean).join(", ");
    const topSkills = skillsList.slice(0, 6).join(", ");
    const topCerts = certificates.slice(0, 2).map(c => c.name || c.title).filter(Boolean).join(", ");

    // Grounded rule-based fallback based purely on candidate's real data (no software bias)
    const generateFallback = () => {
        switch (normalizedStyle) {
            case "simple":
                if (recentRole) {
                    return `${candidateTitle} with professional background as ${recentRole}. Skilled in ${topSkills || "effective communication, planning, and execution"}, focused on delivering practical and reliable results.`;
                } else if (primaryDegree) {
                    return `${candidateTitle} with a strong foundation in ${primaryDegree}. Dedicated to applying ${topSkills || "core knowledge and practical competencies"} to contribute effectively to team goals.`;
                }
                return `${candidateTitle} with a solid foundation in ${topSkills || "essential professional competencies"}. Dedicated to quality outcomes and collaborating effectively on impactful work.`;

            case "short":
                if (topSkills && candidateTitle) {
                    return `${candidateTitle} proficient in ${topSkills}, focused on delivering high-quality outcomes and continuous improvement.`;
                }
                return `${candidateTitle} committed to professional excellence, dedication, and measurable impact.`;

            case "technical":
                return `Methodical and detail-oriented ${candidateTitle} with hands-on proficiency in ${topSkills || "specialized domain methodologies and tools"}${topProjects ? `, demonstrated through key work including ${topProjects}` : ""}. Adept at rigorous analysis, disciplined execution, and applying industry best practices.`;

            case "career-focused":
                return `Results-driven ${candidateTitle}${primaryDegree ? ` backgrounded by qualification in ${primaryDegree}` : ""} eager to contribute strong problem-solving abilities, teamwork, and expertise in ${topSkills || "core disciplines"} to achieve high-impact organizational objectives.`;

            case "professional":
            default:
                if (recentRole) {
                    return `Accomplished ${candidateTitle} with proven experience as ${recentRole}. Proficient in ${topSkills || "strategic execution and stakeholder collaboration"}, with a track record of delivering high-quality results.`;
                } else if (primaryDegree) {
                    return `Proactive ${candidateTitle} holding a qualification in ${primaryDegree}. Combines academic training with practical competence in ${topSkills || "essential industry standards"} to solve real-world challenges.`;
                }
                return `Dedicated ${candidateTitle} with strong competencies in ${topSkills || "modern industry practices"}. Committed to operational excellence, integrity, and driving tangible organizational value.`;
        }
    };

    if (!apiKey) {
        console.log("[Generate About] No GEMINI_API_KEY found; using grounded deterministic generator.");
        return { about: generateFallback(), style: normalizedStyle, source: "fallback" };
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

        const prompt = `
You are an expert resume writer. Generate a candidate professional summary/about statement strictly using the provided candidate facts.

The candidate may belong to ANY profession (e.g. Teacher, Doctor, Nurse, Accountant, Salesperson, Marketer, Engineer, Researcher, Designer, Software Developer, Student / Fresher, Business Professional, etc.).
NEVER assume the candidate is a software developer or IT professional unless explicitly indicated by their title, experience, or skills. Use terminology appropriate to their specific discipline.

CRITICAL INTEGRITY RULES:
1. ONLY reference information present in the facts below. NEVER invent companies, years of experience, titles, metrics, or certifications.
2. If facts are sparse, keep the statement concise, honest, authentic, and professionally relevant.
3. Tone and style must strictly adhere to the requested "${normalizedStyle}" style:
   - "simple": Plain, straightforward, authentic language (2-3 sentences).
   - "professional": Executive, well-structured, polished professional tone (2-3 sentences).
   - "short": High-impact, concise summary (1-2 sentences maximum).
   - "technical": Emphasize specialized domain methodologies, techniques, and tools relevant to their specific discipline (2-3 sentences).
   - "career-focused": Highlight ambition, growth mindset, reliability, and career goals (2-3 sentences).
4. Return ONLY the plain text paragraph. Do NOT include markdown quotes, headings, labels, bullet points, or conversational text.

Candidate Facts:
- Name: ${candidateName}
- Title / Headline: ${candidateTitle}
- Category: ${userCategory}
- Career Target: ${metadata.career_target || "General"}
- Education: ${primaryDegree || "Not specified"}
- Recent Experience: ${recentRole || "Not specified"}
- Key Skills: ${topSkills || "Not specified"}
- Notable Work / Projects: ${topProjects || "Not specified"}
- Certifications / Training: ${topCerts || "Not specified"}
`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt
        });

        const text = response?.text?.trim();
        if (text && text.length > 20) {
            const cleaned = text.replace(/^["']|["']$/g, "").replace(/^#+\s*.*/gm, "").trim();
            return { about: cleaned, style: normalizedStyle, source: "ai" };
        }
        return { about: generateFallback(), style: normalizedStyle, source: "fallback" };
    } catch (err) {
        console.warn("[Generate About] Gemini call failed, using deterministic fallback:", err.message);
        return { about: generateFallback(), style: normalizedStyle, source: "fallback" };
    }
}


// =====================================
// AI About Generator Endpoints
// POST /generate-about & POST /:resumeId/generate-about
// =====================================

async function handleGenerateAbout(req, res) {
    try {
        const resumeId = req.params.resumeId;
        const style = req.body.style || "professional";
        const userCategory = req.body.user_category || "Student";
        let resumeData = req.body.resumeData || null;

        if (!resumeData && resumeId && resumeId !== "new") {
            const row = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM Resume_Details WHERE resume_id = ?", [resumeId], (err, r) => {
                    if (err) return reject(err);
                    resolve(r);
                });
            });

            if (row) {
                let parsedEducation = [];
                let parsedSkills = [];
                let parsedExp = [];
                let parsedProj = [];
                let parsedCerts = [];
                try {
                    parsedEducation = JSON.parse(row.education || "[]");
                    parsedSkills = JSON.parse(row.skills || "[]");
                    parsedExp = JSON.parse(row.experience || "[]");
                    parsedProj = JSON.parse(row.projects || "[]");
                    parsedCerts = JSON.parse(row.certifications || "[]");
                } catch (e) {}

                let meta = {};
                try {
                    meta = JSON.parse(row.metadata || "{}");
                } catch (e) {}

                resumeData = {
                    personal: {
                        name: row.name,
                        title: meta.title || ""
                    },
                    metadata: meta,
                    education: parsedEducation,
                    skills: parsedSkills,
                    experience: parsedExp,
                    projects: parsedProj,
                    certificates: parsedCerts
                };
            }
        }

        if (!resumeData) {
            resumeData = {
                personal: { name: req.body.name || "" },
                metadata: {},
                education: [],
                skills: [],
                experience: [],
                projects: [],
                certificates: []
            };
        }

        const result = await generateAboutSummary({
            style,
            resumeData,
            userCategory
        });

        return res.status(200).json({
            message: "About summary generated successfully!",
            about: result.about,
            style: result.style,
            source: result.source
        });
    } catch (error) {
        console.error("Error generating About section:", error);
        return res.status(500).json({
            message: "Failed to generate about section.",
            error: error.message
        });
    }
}

router.post("/generate-about", handleGenerateAbout);
router.post("/:resumeId/generate-about", handleGenerateAbout);

module.exports = router;