const express = require("express");
const router = express.Router();
const db = require("../db");

// Ensure experience column exists in portfolio table
db.run("ALTER TABLE portfolio ADD COLUMN experience TEXT", (err) => {
    // Column already exists or table altered successfully
});

// =====================================================
// GET PORTFOLIO BY PORTFOLIO ID
// GET /api/portfolio/:portfolioId
// =====================================================

router.get("/:portfolioId", (req, res) => {
    const { portfolioId } = req.params;

    const sql = `
        SELECT *
        FROM portfolio
        WHERE portfolio_id = ?
    `;

    db.get(sql, [portfolioId], (err, portfolio) => {

        if (err) {
            console.error("Error fetching portfolio:", err);

            return res.status(500).json({
                error: "Failed to fetch portfolio"
            });
        }

        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found"
            });
        }

        try {

            // Personal details
            portfolio.personal = portfolio.personal
                ? JSON.parse(portfolio.personal)
                : {
                    name: "",
                    title: "",
                    email: "",
                    phone: "",
                    location: "",
                    github: "",
                    linkedin: "",
                    portfolio_url: ""
                };

            // Experience
            portfolio.experience = portfolio.experience
                ? JSON.parse(portfolio.experience)
                : [];

            // Education
            portfolio.education = portfolio.education
                ? JSON.parse(portfolio.education)
                : [];

            // Skills
            portfolio.skills = portfolio.skills
                ? JSON.parse(portfolio.skills)
                : [];

            // Projects
            portfolio.projects = portfolio.projects
                ? JSON.parse(portfolio.projects)
                : [];

            // Certificates
            portfolio.certificates = portfolio.certificates
                ? JSON.parse(portfolio.certificates)
                : [];

            // Achievements
            portfolio.achievements = portfolio.achievements
                ? JSON.parse(portfolio.achievements)
                : [];

            // Languages
            portfolio.languages = portfolio.languages
                ? JSON.parse(portfolio.languages)
                : [];

            // Section order
            portfolio.section_order = portfolio.section_order
                ? JSON.parse(portfolio.section_order)
                : [
                    "about",
                    "experience",
                    "education",
                    "skills",
                    "projects",
                    "certificates",
                    "achievements",
                    "languages"
                ];

        } catch (parseError) {

            console.error(
                "Error parsing portfolio data:",
                parseError
            );

            return res.status(500).json({
                error: "Invalid portfolio data"
            });
        }

        res.status(200).json({
            portfolio: portfolio
        });
    });
});


// =====================================================
// CREATE PORTFOLIO
// POST /api/portfolio
// =====================================================

router.post("/", (req, res) => {

    const {
        resume_id,
        template_name,
        theme,
        photo_path,
        about,
        experience,
        education,
        skills,
        projects,
        certificates,
        achievements,
        languages,
        section_order
    } = req.body;


    // -------------------------------------------------
    // Check resume ID
    // -------------------------------------------------

    if (!resume_id) {

        return res.status(400).json({
            error: "resume_id is required"
        });

    }


    // -------------------------------------------------
    // Get personal and resume details from Resume_Details
    // -------------------------------------------------

    const resumeSQL = `
        SELECT *
        FROM Resume_Details
        WHERE resume_id = ?
    `;

    db.get(
        resumeSQL,
        [resume_id],
        (err, resumeDetails) => {

            if (err) {
                console.error(
                    "Error fetching resume details:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to fetch resume details"
                });
            }

            if (!resumeDetails) {
                return res.status(404).json({
                    error: "Resume details not found"
                });
            }

            // -------------------------------------------------
            // Personal details automatically taken from resume
            // -------------------------------------------------

            let meta = {};
            try {
                meta = JSON.parse(resumeDetails.metadata || "{}");
            } catch (e) {
                meta = {};
            }

            const personal = {
                name: (req.body.personal && req.body.personal.name) || resumeDetails.name || "",
                title: (req.body.personal && req.body.personal.title) || meta.title || "",
                email: (req.body.personal && req.body.personal.email) || resumeDetails.email || "",
                phone: (req.body.personal && req.body.personal.phone) || resumeDetails.phone || "",
                location: (req.body.personal && req.body.personal.location) || meta.location || "",
                github: (req.body.personal && req.body.personal.github) || resumeDetails.github || "",
                linkedin: (req.body.personal && req.body.personal.linkedin) || resumeDetails.linkedin || "",
                portfolio_url: (req.body.personal && req.body.personal.portfolio_url) || meta.portfolio_url || ""
            };

            // Experience fallback
            let resumeExperience = [];
            if (experience && Array.isArray(experience) && experience.length > 0) {
                resumeExperience = experience;
            } else {
                try {
                    resumeExperience = JSON.parse(resumeDetails.experience || "[]");
                } catch (e) {
                    resumeExperience = [];
                }
            }

            // Education fallback
            let resumeEducation = [];
            if (education && Array.isArray(education) && education.length > 0) {
                resumeEducation = education;
            } else {
                try {
                    resumeEducation = JSON.parse(resumeDetails.education || "[]");
                } catch (e) {
                    resumeEducation = [];
                }
            }

            // Skills fallback & flattening
            let resumeSkills = [];
            if (skills && (Array.isArray(skills) ? skills.length > 0 : Object.keys(skills).length > 0)) {
                if (Array.isArray(skills)) {
                    resumeSkills = skills;
                } else if (typeof skills === "object") {
                    resumeSkills = skills.all || Object.values(skills).flat().filter(Boolean);
                }
            } else {
                try {
                    const parsedDbSkills = JSON.parse(resumeDetails.skills || "[]");
                    if (Array.isArray(parsedDbSkills)) {
                        resumeSkills = parsedDbSkills;
                    } else if (parsedDbSkills && typeof parsedDbSkills === "object") {
                        resumeSkills = parsedDbSkills.all || Object.values(parsedDbSkills).flat().filter(Boolean);
                    }
                } catch (e) {
                    resumeSkills = [];
                }
            }
            // Normalize skills to clean strings
            resumeSkills = resumeSkills.map(s => (typeof s === "string" ? s.trim() : (s?.name || String(s)))).filter(Boolean);

            // Projects fallback
            let resumeProjects = [];
            if (projects && Array.isArray(projects) && projects.length > 0) {
                resumeProjects = projects;
            } else {
                try {
                    resumeProjects = JSON.parse(resumeDetails.projects || "[]");
                } catch (e) {
                    resumeProjects = [];
                }
            }

            // Certificates fallback
            let resumeCertificates = [];
            if (certificates && Array.isArray(certificates) && certificates.length > 0) {
                resumeCertificates = certificates;
            } else {
                try {
                    resumeCertificates = JSON.parse(resumeDetails.certifications || "[]");
                } catch (e) {
                    resumeCertificates = [];
                }
            }

            // Achievements fallback
            let resumeAchievements = [];
            if (achievements && Array.isArray(achievements) && achievements.length > 0) {
                resumeAchievements = achievements;
            } else {
                try {
                    resumeAchievements = JSON.parse(resumeDetails.achievements || "[]");
                } catch (e) {
                    resumeAchievements = [];
                }
            }

            // Languages fallback
            let resumeLanguages = [];
            if (languages && Array.isArray(languages) && languages.length > 0) {
                resumeLanguages = languages;
            } else {
                try {
                    resumeLanguages = JSON.parse(resumeDetails.languages || "[]");
                } catch (e) {
                    resumeLanguages = [];
                }
            }

            const resolvedPhoto = photo_path || (req.body.personal && req.body.personal.photo) || meta.photo_path || null;
            const resolvedAbout = (about && typeof about === "string" && about.trim()) ? about.trim() : (resumeDetails.about || "");

            // -------------------------------------------------
            // Create portfolio
            // -------------------------------------------------

            const portfolioSQL = `
                INSERT INTO portfolio
                (
                    resume_id,
                    template_name,
                    theme,
                    photo_path,
                    personal,
                    about,
                    experience,
                    education,
                    skills,
                    projects,
                    certificates,
                    achievements,
                    languages,
                    section_order,
                    generated_date
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `;

            const values = [
                resume_id,
                template_name || "minimal",
                theme || "light",
                resolvedPhoto,
                JSON.stringify(personal),
                resolvedAbout,
                JSON.stringify(resumeExperience || []),
                JSON.stringify(resumeEducation || []),
                JSON.stringify(resumeSkills || []),
                JSON.stringify(resumeProjects || []),
                JSON.stringify(resumeCertificates || []),
                JSON.stringify(resumeAchievements || []),
                JSON.stringify(resumeLanguages || []),
                JSON.stringify(
                    section_order || [
                        "about",
                        "experience",
                        "education",
                        "skills",
                        "projects",
                        "certificates",
                        "achievements",
                        "languages"
                    ]
                )
            ];


            db.run(
                portfolioSQL,
                values,
                function (err) {

                    if (err) {

                        console.error(
                            "SQLite ERROR while creating portfolio:",
                            err
                        );

                        return res.status(500).json({
                            error: err.message
                        });

                    }


                    console.log(
                        "Portfolio created. ID:",
                        this.lastID
                    );


                    return res.status(201).json({

                        message:
                            "Portfolio created successfully",

                        portfolio_id:
                            this.lastID

                    });

                }
            );

        }
    );
});


// =====================================================
// UPDATE PORTFOLIO
// PUT /api/portfolio/:portfolioId
// =====================================================

router.put("/:portfolioId", (req, res) => {

    const { portfolioId } = req.params;


    const {
        personal,
        template_name,
        theme,
        photo_path,
        about,
        experience,
        education,
        skills,
        projects,
        certificates,
        achievements,
        languages,
        section_order
    } = req.body;


    const sql = `
        UPDATE portfolio
        SET
            personal = ?,
            template_name = ?,
            theme = ?,
            photo_path = ?,
            about = ?,
            experience = ?,
            education = ?,
            skills = ?,
            projects = ?,
            certificates = ?,
            achievements = ?,
            languages = ?,
            section_order = ?
        WHERE portfolio_id = ?
    `;


    const values = [

        JSON.stringify(
            personal || {
                name: "",
                title: "",
                email: "",
                phone: "",
                location: "",
                github: "",
                linkedin: "",
                portfolio_url: ""
            }
        ),

        template_name || "minimal",

        theme || "light",

        photo_path || null,

        about || "",

        JSON.stringify(experience || []),

        JSON.stringify(education || []),

        JSON.stringify(skills || []),

        JSON.stringify(projects || []),

        JSON.stringify(certificates || []),

        JSON.stringify(achievements || []),

        JSON.stringify(languages || []),

        JSON.stringify(section_order || []),

        portfolioId

    ];


    db.run(
        sql,
        values,
        function (err) {

            if (err) {

                console.error(
                    "Error updating portfolio:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to update portfolio"
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    message: "Portfolio not found"
                });

            }


            return res.status(200).json({

                message:
                    "Portfolio updated successfully"

            });

        }
    );
});


// =====================================================
// DELETE PORTFOLIO
// DELETE /api/portfolio/:portfolioId
// =====================================================

router.delete("/:portfolioId", (req, res) => {

    const { portfolioId } = req.params;


    const sql = `
        DELETE FROM portfolio
        WHERE portfolio_id = ?
    `;


    db.run(
        sql,
        [portfolioId],
        function (err) {

            if (err) {

                console.error(
                    "Error deleting portfolio:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to delete portfolio"
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    message: "Portfolio not found"
                });

            }


            return res.status(200).json({

                message:
                    "Portfolio deleted successfully"

            });

        }
    );
});


module.exports = router;