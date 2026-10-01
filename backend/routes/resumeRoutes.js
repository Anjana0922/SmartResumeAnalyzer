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
    storage: storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === ".pdf" || ext === ".docx") {
            return cb(null, true);
        }
        cb(new Error("Only PDF (.pdf) and Word (.docx) documents are supported."));
    }
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

                const metadataToStore = {
                    title: parsedResume.personal?.title || "",
                    location: parsedResume.personal?.location || parsedResume.personal?.address || "",
                    portfolio_url: parsedResume.personal?.portfolio_url || "",
                    photo_path: parsedResume.personal?.photo || "",
                    source: "upload",
                    user_category: req.body.user_category || "Student"
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
                        ),

                        JSON.stringify(
                            metadataToStore
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
            message: error.message || "Resume processing failed.",
            error: error.message
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
                            success: true,
                            message: "Resume created successfully!",
                            resume_id: resumeID,
                            resumeId: resumeID,
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
                                success: true,
                                message: "Resume updated successfully!",
                                resume_id: Number(resumeId),
                                resumeId: Number(resumeId),
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

    const candidateName = personal.name || "";
    const candidateTitle =
        personal.title ||
        metadata.title ||
        metadata.career_target ||
        "";

    // 1. Synthesize Academic Disciplines & Fields (focusing on domain, avoiding listing schools/marks)
    const degreeFields = education
        .map(e => (typeof e === "string" ? e : (e.degree || e.course || "")))
        .filter(Boolean);
    const academicSummary = degreeFields.length > 0
        ? degreeFields.join(" and ")
        : "";

    // Clean degree field & academic status
    const cleanDegreeField = () => {
        if (degreeFields.length > 0) {
            const first = degreeFields[0].toLowerCase();
            if (/master of computer application|mca/i.test(first)) return "computer applications";
            if (/bachelor of computer application|bca/i.test(first)) return "computer applications";
            if (/computer science|cse|cs\b/i.test(first)) return "computer science";
            if (/information technology|it\b/i.test(first)) return "information technology";
            if (/electronics/i.test(first)) return "electronics and communication";
            if (/mechanical/i.test(first)) return "mechanical engineering";
            if (/civil/i.test(first)) return "civil engineering";
            if (/business|bba|mba|commerce|b\.com/i.test(first)) return "business and commerce";
            return first.replace(/^(master of|bachelor of|diploma in|associate of|b\.?tech in|m\.?tech in|bca in|mca in)\s*/i, "").trim();
        }
        return "";
    };

    const academicField = cleanDegreeField();
    const degreeLower = academicSummary.toLowerCase();
    const isMasterOrPostgrad = /mca|m\.tech|msc|m\.s\.|mba|master|postgraduate|pg\s*diploma/i.test(degreeLower);
    const isBachelor = /bca|b\.tech|bsc|b\.s\.|bba|b\.e\.|bachelor|undergraduate/i.test(degreeLower);
    const isPursuing = /pursuing|current|present|studying/i.test(degreeLower) || 
        education.some(e => {
            const yr = String(e.year || e.duration || "");
            const endYr = String(e.end_year || "");
            return /present|current|-$/i.test(yr) || (!endYr && yr.endsWith("-")) || Number(endYr) >= 2025;
        });

    let academicLevelDesc = "professional";
    if (isMasterOrPostgrad) {
        academicLevelDesc = isPursuing ? "postgraduate student" : "postgraduate";
    } else if (isBachelor) {
        academicLevelDesc = isPursuing ? "undergraduate student" : "graduate";
    } else if (userCategory === "Student") {
        academicLevelDesc = "student";
    }

    // 2. Synthesize Professional & Internship Experience Themes
    const expSummaries = experience
        .map(exp => {
            if (typeof exp === "string") return exp;
            const role = exp.role || exp.title || "";
            const desc = exp.description || exp.responsibilities || "";
            const tech = Array.isArray(exp.technologies) ? exp.technologies.slice(0, 4).join(", ") : "";
            return [role, desc, tech ? `focused in ${tech}` : ""].filter(Boolean).join(" - ");
        })
        .filter(Boolean);
    const experienceSummary = expSummaries.slice(0, 3).join("; ");

    // 3. Synthesize Project Domains & Functional Focus
    const projSummaries = projects
        .map(p => {
            if (typeof p === "string") return p;
            const title = p.title || p.name || "";
            const desc = p.description || p.responsibilities || "";
            const tech = Array.isArray(p.technologies) ? p.technologies.slice(0, 3).join(", ") : (p.technologies || "");
            return [title, desc, tech ? `utilizing ${tech}` : ""].filter(Boolean).join(" - ");
        })
        .filter(Boolean);
    const projectsSummary = projSummaries.slice(0, 3).join("; ");

    // 4. Synthesize Competency Clusters
    const skillsSummary = skillsList.slice(0, 12).join(", ");

    // 5. Synthesize Specialized Training & Certifications
    const certsSummary = certificates
        .map(c => (typeof c === "string" ? c : (c.name || c.title || "")))
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");

    // 6. Existing Summary or Objective for context
    const existingSummary = resumeData.about || resumeData.summary || "";

    // 7. Derive Primary Professional Domain & Identity
    const determinePrimaryDomain = () => {
        if (candidateTitle) return candidateTitle;
        const allText = `${academicSummary} ${experienceSummary} ${skillsSummary} ${projectsSummary}`.toLowerCase();
        if (/web|software|\.net|developer|programmer|engineer|full stack|frontend|backend|sql|javascript|python|java|c#/i.test(allText)) {
            return "Software & Web Development";
        }
        if (/nurs|health|medic|clinic|patient/i.test(allText)) {
            return "Healthcare & Clinical Practice";
        }
        if (/teach|educat|academ|curriculum|pedagog/i.test(allText)) {
            return "Education & Academic Instruction";
        }
        if (/account|finan|tax|audit|bookkeep/i.test(allText)) {
            return "Accounting & Financial Management";
        }
        if (/market|sales|business|brand|growth/i.test(allText)) {
            return "Business Strategy & Marketing";
        }
        if (/design|ui|ux|graphic|creative/i.test(allText)) {
            return "Digital & Visual Design";
        }
        return userCategory === "Student" ? "Applied Technical Studies" : "Professional Practice";
    };

    const primaryDomain = determinePrimaryDomain();
    const effectiveTitle = candidateTitle || (userCategory === "Student" ? `Aspiring Specialist in ${primaryDomain}` : `${primaryDomain} Professional`);

    // Grounded Fallback: strictly avoids candidate names, first-person openings, and resume list repetition
    const generateFallback = () => {
        const fieldStr = academicField || primaryDomain.toLowerCase();
        const levelStr = academicLevelDesc;
        const domStr = primaryDomain.toLowerCase();

        switch (normalizedStyle) {
            case "simple":
                return `With a background in ${fieldStr}, focused on turning requirements into reliable, well-crafted solutions. Combines steady technical fundamentals with a practical, down-to-earth approach to problem-solving and collaboration. Grounded in clear communication and a strong work ethic, the emphasis is always on delivering dependable results that address real-world needs. Continuously exploring new methodologies and refining core competencies to ensure that every project is built with care, consistency, and lasting value.`;

            case "short":
                return `A dedicated ${fieldStr} ${levelStr} focused on ${domStr}. Combining sound theoretical principles with hands-on development, the emphasis is on delivering dependable, well-structured, and high-quality solutions. Driven by continuous learning, disciplined problem-solving, and a commitment to engineering excellence.`;

            case "technical":
                return `Focused on ${domStr}, combining rigorous analytical training in ${fieldStr} with practical engineering methodologies. Emphasizes structured system architecture, modular design, and robust implementation across diverse functional requirements. Brings a disciplined approach to debugging, algorithmic efficiency, and scalable solution delivery. Committed to maintaining high code quality, adherence to best practices, and systematic problem-solving, with an ongoing drive to master evolving technologies and deploy resilient, high-performance systems.`;

            case "career-focused":
                return isPursuing
                    ? `Currently pursuing advanced studies in ${fieldStr} with a proactive, growth-oriented mindset. Dedicated to bridging academic insights with real-world application, with a strong focus on collaborative teamwork, continuous skill acquisition, and goal-driven execution. Prepared to contribute robust analytical and implementation capabilities to dynamic organizational initiatives while continuously evolving to meet emerging professional and technological standards.`
                    : `An ambitious ${fieldStr} ${levelStr} with a strong foundation in ${domStr} and a proactive, growth-oriented mindset. Dedicated to bridging academic insights with real-world application, with a strong focus on collaborative teamwork, continuous skill acquisition, and goal-driven execution. Prepared to contribute robust analytical and implementation capabilities to dynamic organizational initiatives while continuously evolving to meet emerging professional and technological standards.`;

            case "professional":
            default:
                return `A ${fieldStr} ${levelStr} with a comprehensive background in ${domStr} and modern application architecture. Combining disciplined analytical capabilities with practical project execution, the primary focus centers on designing dependable, high-quality, and user-centered solutions. Demonstrates a strong foundation in structured problem-solving, agile collaboration, and continuous technical growth. With a proactive approach to learning evolving industry standards, the work reflects dedication to clean implementation, performance, and meaningful practical impact across every initiative.`;
        }
    };

    if (!apiKey) {
        console.log("[Generate About] No GEMINI_API_KEY found; using grounded deterministic generator.");
        return { about: generateFallback(), style: normalizedStyle, source: "fallback" };
    }

    const getStyleGuide = (st) => {
        switch (st) {
            case "simple":
                return "Use clear, authentic, accessible everyday language (2-3 sentences). Emphasize clarity, solid fundamentals, and down-to-earth reliability without buzzwords or pretension.";
            case "short":
                return "Write a high-impact, punchy summary of 50–75 words (1–2 sentences). Immediately capture core professional identity, primary area of strength, and distinct value.";
            case "technical":
                return "Emphasize technical depth, engineering rigor, system architecture, and disciplined problem-solving methodologies (3-4 sentences). Focus on how solutions are engineered rather than reciting tool names.";
            case "career-focused":
                return "Highlight career momentum, growth mindset, practical adaptability, and the enthusiasm and value brought to organizational objectives (2-3 sentences).";
            case "professional":
            default:
                return "Use a polished, executive, and articulate narrative (2-4 sentences). Emphasize professional identity, domain expertise, and a disciplined approach to delivering real-world value.";
        }
    };

    const suggestedOpenings = [
        academicField ? `"A ${academicField} ${academicLevelDesc} with..."` : `"A ${primaryDomain.toLowerCase()} professional with..."`,
        isPursuing && academicField ? `"Currently pursuing advanced studies in ${academicField} with a focus on..."` : null,
        `"With a background in ${academicField || primaryDomain.toLowerCase()}..."`,
        `"Focused on ${primaryDomain.toLowerCase()}..."`,
        academicField ? `"Combining academic knowledge in ${academicField} with..."` : null
    ].filter(Boolean);

    const prompt = `
You are an expert biographer and executive portfolio writer.
Analyze the candidate's complete profile below and write a natural, personalized "About" section for their professional portfolio.

Candidate Profile Overview:
- Professional Identity / Focus: ${effectiveTitle}
- Background Category: ${userCategory}
- Academic Level & Discipline: ${academicLevelDesc}${academicField ? ` in ${academicField}` : ""}
- Primary Field / Domain: ${primaryDomain}
- Academic Foundations: ${academicSummary || "Not specified"}
- Experience Highlights & Domains: ${experienceSummary || "Not specified"}
- Project Focus & Types of Work: ${projectsSummary || "Not specified"}
- Competencies & Core Strengths: ${skillsSummary || "Not specified"}
- Specialized Training & Certifications: ${certsSummary || "None specified"}
${existingSummary ? `- Self-Stated Focus / Objective: ${existingSummary}` : ""}

STRICT PROHIBITIONS (MANDATORY):
1. NEVER mention the candidate's/person's name anywhere in the text.
2. DO NOT begin with:
   - "I am..."
   - "I have..."
   - "My name is..."
   - "My background..."
   - Any personal name
3. DO NOT use first-person pronouns anywhere ("I", "me", "my", "myself").
4. Write in a confident, third-person or portfolio narrative voice (without using personal names).

NATURAL PROFESSIONAL OPENING REQUIREMENT:
You MUST begin directly with a natural, confident professional phrasing supported by the resume, such as:
${suggestedOpenings.map(o => `- ${o}`).join("\n")}
Select the opening phrase that best fits the candidate's actual qualifications and the requested style.

CRITICAL ANTI-DUPLICATION RULES (DO NOT REPEAT RESUME AS A LIST):
- DO NOT simply list or recite:
  * Education details (do NOT list degrees, colleges, universities, or graduation years)
  * Certificates (do NOT list certificate titles or issuers)
  * Skills one by one (do NOT write comma-separated lists of tools or programming languages)
  * Work experience or internships one by one (do NOT list companies or employment chronologies)
  * Projects one by one (do NOT enumerate project titles as a list)
  * Every resume section in order
- Instead, synthesize their experience, projects, and competencies into cohesive themes:
  * Professional/academic background
  * Main area of interest or career direction
  * Strengths demonstrated through their work/projects
  * Overall professional identity
- Add context and personality to the portfolio so this section complements the detailed resume sections below rather than duplicating them.

GROUNDING & LENGTH:
- Length: strictly between 80 and 150 words (or 50–75 words for the "short" style).
- Ground strictly in the candidate's actual profile facts; NEVER invent qualifications, experience, skills, metrics, companies, or goals that are not supported by the resume.

STYLE REQUIREMENT (${normalizedStyle.toUpperCase()}):
${getStyleGuide(normalizedStyle)}

OUTPUT FORMAT:
Return ONLY the plain text paragraph. Do NOT include markdown quotes, headings, labels, bullet points, candidate name, or conversational introduction.
`;

    const candidateModels = [
        process.env.GEMINI_MODEL || "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3-flash-preview",
    ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

    let aiText = null;
    let lastError = null;

    try {
        const ai = new GoogleGenAI({ apiKey });

        for (let m = 0; m < candidateModels.length; m++) {
            const currentModel = candidateModels[m];
            try {
                const requestConfig = {};
                if (!currentModel.includes("lite")) {
                    requestConfig.thinkingConfig = { thinkingBudget: 0 };
                }

                const response = await ai.models.generateContent({
                    model: currentModel,
                    contents: prompt,
                    config: requestConfig
                });

                const text = response?.text?.trim();
                if (text && text.length > 25) {
                    aiText = text
                        .replace(/^["']|["']$/g, "")
                        .replace(/^#+\s*.*/gm, "")
                        .trim();
                    break;
                }
            } catch (err) {
                lastError = err;
                console.warn(`[Generate About] Model (${currentModel}) failed: ${err.message}. Trying next candidate model...`);
            }
        }

        if (aiText) {
            // Remove candidate name if it inadvertently leaked
            if (candidateName && candidateName.length >= 2) {
                const escaped = candidateName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                aiText = aiText.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "").replace(/\s\s+/g, " ").trim();
                const parts = candidateName.split(/\s+/).filter(p => p.length >= 3);
                for (const p of parts) {
                    const escP = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    aiText = aiText.replace(new RegExp(`^${escP}\\s+is\\s+`, "i"), "");
                    aiText = aiText.replace(new RegExp(`^${escP}\\s+`, "i"), "");
                }
            }

            // Strip prohibited openings
            aiText = aiText
                .replace(/^(i am|i have|my name is|my background is)\s+/i, "")
                .trim();

            if (aiText.length > 0) {
                aiText = aiText.charAt(0).toUpperCase() + aiText.slice(1);
            }

            if (/^i\s+/i.test(aiText)) {
                console.warn("[Generate About] AI response started with first-person pronoun; using grounded fallback.");
                return { about: generateFallback(), style: normalizedStyle, source: "fallback" };
            }

            return { about: aiText, style: normalizedStyle, source: "ai" };
        }

        if (lastError) {
            console.warn("[Generate About] All Gemini models failed, using grounded fallback:", lastError.message);
        }
        return { about: generateFallback(), style: normalizedStyle, source: "fallback" };
    } catch (err) {
        console.warn("[Generate About] Unexpected error, using grounded fallback:", err.message);
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
                    certificates: parsedCerts,
                    about: row.about || ""
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

router.generateAboutSummary = generateAboutSummary;
router.handleGenerateAbout = handleGenerateAbout;

module.exports = router;