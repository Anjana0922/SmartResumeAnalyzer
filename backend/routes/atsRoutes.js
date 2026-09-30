const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const db = require("../db");
const { extractText } = require("../services/pdfService");
const {
    analyzeResumeText,
    extractCleanATSData,
    convertResumeDetailsToATSData,
    generateNormalizedTextFromData
} = require("../services/atsAnalyzerService");
const { parseResume } = require("../services/parserService");

// =====================================
// Upload Folder Configuration
// =====================================
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, "ats-" + Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_"));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === ".pdf" || ext === ".docx") {
            return cb(null, true);
        }
        cb(new Error("Only PDF (.pdf) and Word (.docx) documents are supported."));
    }
});

// =====================================
// POST /api/ats/analyze
// Analyzes uploaded file OR existing resume
// =====================================
router.post("/analyze", upload.single("resume"), async (req, res) => {
    try {
        // 1. Authentication Check: Require valid user_id
        const rawUserId = req.body.user_id || req.headers["x-user-id"];
        if (!rawUserId) {
            return res.status(401).json({
                message: "Authentication required. Please log in to analyze your resume."
            });
        }
        const userId = parseInt(rawUserId, 10);
        if (isNaN(userId) || userId <= 0) {
            return res.status(401).json({
                message: "Invalid user session. Please log in again."
            });
        }

        let resumeText = "";
        let fileName = "Resume";
        let filePath = "";
        let resumeId = req.body.resume_id ? parseInt(req.body.resume_id, 10) : null;
        let cleanATSData = null;

        // Case 1: Existing resume ID provided (Enforce ownership verification)
        if (resumeId) {
            console.log(`[ATS] Verifying ownership and analyzing resume ID: ${resumeId} for user ${userId}`);
            const resumeRow = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM Resume WHERE resume_id = ? AND user_id = ?", [resumeId, userId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!resumeRow) {
                return res.status(404).json({
                    message: "Resume not found or you do not have permission to access it."
                });
            }

            fileName = resumeRow.file_name;
            filePath = resumeRow.file_path;

            // Reuse existing structured Resume_Details if available
            const detailsRow = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM Resume_Details WHERE resume_id = ?", [resumeId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (detailsRow) {
                console.log(`[ATS] Reusing validated structured Resume_Details for resume ID ${resumeId}`);
                cleanATSData = convertResumeDetailsToATSData(detailsRow);
                resumeText = generateNormalizedTextFromData(cleanATSData);
            } else if (filePath && fs.existsSync(filePath)) {
                resumeText = await extractText(filePath);
            }
        }
        // Case 2: Uploaded file
        else if (req.file) {
            fileName = req.file.originalname;
            filePath = req.file.path;
            console.log(`[ATS] Extracting text from uploaded file: ${fileName} for user ${userId}`);
            resumeText = await extractText(filePath);

            // Attempt unified parser so Resume and Resume_Details are saved and shared across modules
            try {
                const parsedResult = await parseResume(resumeText);
                if (parsedResult) {
                    const uploadDate = new Date().toISOString().split("T")[0];
                    const insertResumeSQL = `
                        INSERT INTO Resume (user_id, file_name, file_path, upload_date, status)
                        VALUES (?, ?, ?, ?, 'ATS Analyzed')
                    `;
                    resumeId = await new Promise((resolve, reject) => {
                        db.run(insertResumeSQL, [userId, fileName, filePath, uploadDate], function (err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                        });
                    });

                    const metadataToStore = {
                        title: parsedResult.personal?.title || "",
                        location: parsedResult.personal?.location || parsedResult.personal?.address || "",
                        portfolio_url: parsedResult.personal?.portfolio_url || "",
                        photo_path: parsedResult.personal?.photo || "",
                        source: "ats_upload",
                        user_category: req.body.user_category || "Student"
                    };

                    const detailsSQL = `
                        INSERT INTO Resume_Details
                        (resume_id, name, email, phone, education, skills, projects, experience, certifications, achievements, languages, github, linkedin, about, custom_sections, metadata)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    await new Promise((resolve, reject) => {
                        db.run(detailsSQL, [
                            resumeId,
                            parsedResult.personal?.name || "",
                            parsedResult.personal?.email || "",
                            parsedResult.personal?.phone || "",
                            JSON.stringify(parsedResult.education || []),
                            JSON.stringify(parsedResult.skills || []),
                            JSON.stringify(parsedResult.projects || []),
                            JSON.stringify(parsedResult.experience || []),
                            JSON.stringify(parsedResult.certificates || []),
                            JSON.stringify(parsedResult.achievements || []),
                            JSON.stringify(parsedResult.languages || []),
                            parsedResult.personal?.github || "",
                            parsedResult.personal?.linkedin || "",
                            parsedResult.about || parsedResult.summary || "",
                            JSON.stringify(parsedResult.custom_sections || []),
                            JSON.stringify(metadataToStore)
                        ], function (err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                        });
                    });

                    // Build cleanATSData directly from newly created structured details
                    const detailsRow = await new Promise((resolve, reject) => {
                        db.get("SELECT * FROM Resume_Details WHERE resume_id = ?", [resumeId], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    });
                    if (detailsRow) {
                        cleanATSData = convertResumeDetailsToATSData(detailsRow);
                        resumeText = generateNormalizedTextFromData(cleanATSData);
                    }
                }
            } catch (parseErr) {
                console.warn("[ATS] Unified parser notice (using heuristic fallback):", parseErr.message);
            }

            // If cleanATSData was not generated via parseResume, check for existing validated Resume_Details for this user
            if (!cleanATSData) {
                try {
                    const cleanBase = path.basename(fileName, path.extname(fileName)).toLowerCase().replace(/[^a-z0-9]/g, "");
                    const existingRow = await new Promise((resolve) => {
                        db.all(
                            `SELECT r.resume_id, r.file_name, r.file_path, rd.* 
                             FROM Resume r 
                             JOIN Resume_Details rd ON r.resume_id = rd.resume_id 
                             WHERE r.user_id = ? 
                             ORDER BY r.resume_id DESC`,
                            [userId],
                            (err, rows) => {
                                if (err || !rows || rows.length === 0) return resolve(null);
                                const match = rows.find(r => {
                                    const rf = (r.file_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                    const rp = (r.file_path || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                    return rf.includes(cleanBase) || rp.includes(cleanBase) || cleanBase.includes(rf);
                                });
                                resolve(match || null);
                            }
                        );
                    });

                    if (existingRow) {
                        console.log(`[ATS] Matched existing structured Resume_Details for user ${userId} (resume ${existingRow.resume_id})`);
                        cleanATSData = convertResumeDetailsToATSData(existingRow);
                        resumeText = generateNormalizedTextFromData(cleanATSData);
                        if (!resumeId) resumeId = existingRow.resume_id;
                    }
                } catch (reuseErr) {
                    console.warn("[ATS] Notice checking existing resume details:", reuseErr.message);
                }
            }
        }
        // Case 3: Raw text provided directly
        else if (req.body.text && req.body.text.trim().length > 0) {
            resumeText = req.body.text.trim();
        } else {
            return res.status(400).json({
                message: "Please upload a resume file (.pdf, .docx) or select an existing resume."
            });
        }

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(422).json({
                message: "Could not extract readable text from the document. The file may be a scanned image without an embedded text layer."
            });
        }

        // Run heuristic scoring and extraction
        console.log(`[ATS] Running heuristic analysis for ${fileName}...`);
        const analysis = analyzeResumeText(resumeText, fileName);
        if (!cleanATSData) {
            cleanATSData = extractCleanATSData(resumeText);
        }

        // If new file upload without resumeId, save to Resume table
        if (!resumeId) {
            const uploadDate = new Date().toISOString().split("T")[0];
            const insertResumeSQL = `
                INSERT INTO Resume (user_id, file_name, file_path, upload_date, status)
                VALUES (?, ?, ?, ?, 'ATS Analyzed')
            `;

            resumeId = await new Promise((resolve, reject) => {
                db.run(insertResumeSQL, [userId, fileName, filePath, uploadDate], function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
        }

        // Save analysis to Resume_Analysis table
        const suggestionsPayload = JSON.stringify({
            overall_score: analysis.overall_score,
            score_label: analysis.score_label,
            is_ats_friendly: analysis.is_ats_friendly,
            breakdown: analysis.breakdown,
            strengths: analysis.strengths,
            problems: analysis.problems,
            suggestions: analysis.suggestions,
            cleanATSData: cleanATSData
        });

        const insertAnalysisSQL = `
            INSERT INTO Resume_Analysis (resume_id, overall_score, suggestions, analyzed_date)
            VALUES (?, ?, ?, datetime('now'))
        `;

        const analysisId = await new Promise((resolve, reject) => {
            db.run(insertAnalysisSQL, [resumeId, analysis.overall_score, suggestionsPayload], function (err) {
                if (err) {
                    console.error("[ATS] Failed to insert Resume_Analysis:", err);
                    reject(new Error("Failed to persist ATS analysis record to database: " + err.message));
                } else {
                    resolve(this.lastID);
                }
            });
        });

        console.log(`[ATS] Analysis complete. Score: ${analysis.overall_score}/100. Analysis ID: ${analysisId}`);

        return res.status(200).json({
            success: true,
            resume_id: resumeId,
            analysis_id: analysisId,
            overall_score: analysis.overall_score,
            score_label: analysis.score_label,
            is_ats_friendly: analysis.is_ats_friendly,
            breakdown: analysis.breakdown,
            strengths: analysis.strengths,
            problems: analysis.problems,
            suggestions: analysis.suggestions,
            cleanATSData: cleanATSData,
            rawText: resumeText,
            fileName: fileName
        });

    } catch (error) {
        console.error("[ATS] Error during resume analysis:", error);
        return res.status(500).json({
            message: error.message || "Failed to analyze resume.",
            error: error.message
        });
    }
});

// =====================================
// GET /api/ats/analysis/:resumeId
// Get latest analysis for a resume
// =====================================
router.get("/analysis/:resumeId", (req, res) => {
    const resumeId = req.params.resumeId;

    const sql = `
        SELECT * FROM Resume_Analysis
        WHERE resume_id = ?
        ORDER BY analysis_id DESC
        LIMIT 1
    `;

    db.get(sql, [resumeId], (err, row) => {
        if (err) {
            console.error("[ATS] Database error:", err);
            return res.status(500).json({ message: "Failed to retrieve analysis." });
        }

        if (!row) {
            return res.status(404).json({ message: "No analysis found for this resume." });
        }

        let parsed = {};
        try {
            parsed = JSON.parse(row.suggestions || "{}");
        } catch (e) {
            parsed = {};
        }

        return res.status(200).json({
            success: true,
            analysis_id: row.analysis_id,
            resume_id: row.resume_id,
            overall_score: row.overall_score,
            analyzed_date: row.analyzed_date,
            ...parsed
        });
    });
});

// =====================================
// GET /api/ats/history/:userId
// Get analysis history for a user
// =====================================
router.get("/history/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            a.analysis_id,
            a.resume_id,
            a.overall_score,
            a.analyzed_date,
            r.file_name,
            r.status
        FROM Resume_Analysis a
        JOIN Resume r ON a.resume_id = r.resume_id
        WHERE r.user_id = ?
        ORDER BY a.analysis_id DESC
        LIMIT 10
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error("[ATS] History query error:", err);
            return res.status(500).json({ message: "Failed to fetch analysis history." });
        }

        return res.status(200).json({
            success: true,
            history: rows || []
        });
    });
});

module.exports = router;
