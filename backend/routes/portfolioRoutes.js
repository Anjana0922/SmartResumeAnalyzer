const express = require("express");
const router = express.Router();
const db = require("../db");

// =====================================================
// SAFE SCHEMA MIGRATION
// Safely add missing columns if they do not already exist
// =====================================================

const migrations = [
    "ALTER TABLE portfolio ADD COLUMN user_id INTEGER",
    "ALTER TABLE portfolio ADD COLUMN experience TEXT",
    "ALTER TABLE portfolio ADD COLUMN custom_sections TEXT",
    "ALTER TABLE portfolio ADD COLUMN ai_suggestions TEXT",
    "ALTER TABLE portfolio ADD COLUMN slug TEXT"
];

migrations.forEach((sql) => {
    db.run(sql, (err) => {
        // Column already exists or table altered successfully
    });
});

// =====================================================
// OWNERSHIP & AUTHENTICATION HELPERS
// =====================================================

function getRequestUserId(req) {
    return req.headers["x-user-id"] || req.query.user_id || (req.body && req.body.user_id) || null;
}

function verifyResumeOwnership(resumeId, userId, callback) {
    if (!resumeId) {
        return callback(new Error("resume_id is required"), false, null);
    }

    const sql = `
        SELECT r.user_id, r.resume_id, r.file_name
        FROM Resume r
        WHERE r.resume_id = ?
    `;

    db.get(sql, [resumeId], (err, row) => {
        if (err) return callback(err, false, null);
        if (!row) return callback(null, false, null);

        // If a userId is passed from auth/session, verify it matches
        if (userId && String(row.user_id) !== String(userId)) {
            return callback(null, false, row);
        }

        return callback(null, true, row);
    });
}

function verifyPortfolioOwnership(portfolioId, userId, callback) {
    if (!portfolioId) {
        return callback(new Error("portfolio_id is required"), false, null);
    }

    const sql = `
        SELECT p.*, r.user_id AS resume_user_id
        FROM portfolio p
        LEFT JOIN Resume r ON p.resume_id = r.resume_id
        WHERE p.portfolio_id = ?
    `;

    db.get(sql, [portfolioId], (err, row) => {
        if (err) return callback(err, false, null);
        if (!row) return callback(null, false, null);

        const ownerId = row.user_id || row.resume_user_id;
        if (userId && ownerId && String(ownerId) !== String(userId)) {
            return callback(null, false, row);
        }

        return callback(null, true, row);
    });
}

function parsePortfolioRow(portfolio) {
    if (!portfolio) return null;

    try {
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
                portfolio_url: "",
                photo: ""
            };
    } catch (e) {
        portfolio.personal = {
            name: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            github: "",
            linkedin: "",
            portfolio_url: "",
            photo: ""
        };
    }

    try {
        portfolio.experience = portfolio.experience ? JSON.parse(portfolio.experience) : [];
    } catch (e) {
        portfolio.experience = [];
    }

    try {
        portfolio.education = portfolio.education ? JSON.parse(portfolio.education) : [];
    } catch (e) {
        portfolio.education = [];
    }

    try {
        portfolio.skills = portfolio.skills ? JSON.parse(portfolio.skills) : [];
    } catch (e) {
        portfolio.skills = [];
    }

    try {
        portfolio.projects = portfolio.projects ? JSON.parse(portfolio.projects) : [];
    } catch (e) {
        portfolio.projects = [];
    }

    try {
        portfolio.certificates = portfolio.certificates ? JSON.parse(portfolio.certificates) : [];
    } catch (e) {
        portfolio.certificates = [];
    }

    try {
        portfolio.achievements = portfolio.achievements ? JSON.parse(portfolio.achievements) : [];
    } catch (e) {
        portfolio.achievements = [];
    }

    try {
        portfolio.languages = portfolio.languages ? JSON.parse(portfolio.languages) : [];
    } catch (e) {
        portfolio.languages = [];
    }

    try {
        portfolio.custom_sections = portfolio.custom_sections ? JSON.parse(portfolio.custom_sections) : [];
    } catch (e) {
        portfolio.custom_sections = [];
    }

    try {
        portfolio.ai_suggestions = portfolio.ai_suggestions ? JSON.parse(portfolio.ai_suggestions) : [];
    } catch (e) {
        portfolio.ai_suggestions = [];
    }

    try {
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
    } catch (e) {
        portfolio.section_order = [
            "about",
            "experience",
            "education",
            "skills",
            "projects",
            "certificates",
            "achievements",
            "languages"
        ];
    }

    return portfolio;
}

// =====================================================
// GET USER PORTFOLIOS
// GET /api/portfolio/my-portfolios & /api/portfolio/user/:userId
// =====================================================

function handleGetUserPortfolios(req, res) {
    const userId = req.params.userId || req.query.user_id || req.headers["x-user-id"];

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const sql = `
        SELECT p.*, r.file_name, r.upload_date
        FROM portfolio p
        LEFT JOIN Resume r ON p.resume_id = r.resume_id
        WHERE p.user_id = ? OR r.user_id = ?
        ORDER BY p.portfolio_id DESC
    `;

    db.all(sql, [userId, userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user portfolios:", err);
            return res.status(500).json({ error: "Failed to retrieve portfolios" });
        }

        const portfolios = (rows || []).map(parsePortfolioRow);

        return res.status(200).json({
            message: "Portfolios retrieved successfully",
            portfolios
        });
    });
}

router.get("/my-portfolios", handleGetUserPortfolios);
router.get("/user/:userId", handleGetUserPortfolios);

// =====================================================
// GET PORTFOLIO BY PORTFOLIO ID (Public & Owner View)
// GET /api/portfolio/:portfolioId
// =====================================================

router.get("/:portfolioId", (req, res) => {
    const { portfolioId } = req.params;

    // Avoid route collision with static sub-paths
    if (portfolioId === "my-portfolios" || portfolioId === "generate-about" || portfolioId === "ai-suggestions") {
        return res.status(400).json({ error: "Invalid portfolio identifier" });
    }

    const sql = `
        SELECT p.*, r.user_id AS resume_user_id, r.file_name
        FROM portfolio p
        LEFT JOIN Resume r ON p.resume_id = r.resume_id
        WHERE p.portfolio_id = ?
    `;

    db.get(sql, [portfolioId], (err, row) => {
        if (err) {
            console.error("Error fetching portfolio:", err);
            return res.status(500).json({ error: "Failed to fetch portfolio" });
        }

        if (!row) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        const portfolio = parsePortfolioRow(row);

        return res.status(200).json({
            message: "Portfolio fetched successfully",
            portfolio
        });
    });
});

// =====================================================
// CREATE OR UPDATE PORTFOLIO (UPSERT)
// POST /api/portfolio
// Prevents duplicate records on template choice or resave
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
        custom_sections,
        section_order,
        ai_suggestions
    } = req.body;

    if (!resume_id) {
        return res.status(400).json({ error: "resume_id is required" });
    }

    const requestUserId = getRequestUserId(req);

    // 1. Verify that the resume exists and check ownership
    verifyResumeOwnership(resume_id, requestUserId, (verifyErr, isOwner, resumeRow) => {
        if (verifyErr) {
            console.error("Error verifying resume ownership:", verifyErr);
            return res.status(500).json({ error: "Database error verifying resume ownership" });
        }

        if (!resumeRow) {
            return res.status(404).json({ error: "Resume not found" });
        }

        if (requestUserId && !isOwner) {
            return res.status(403).json({ error: "Unauthorized. You do not own this resume." });
        }

        const effectiveUserId = resumeRow.user_id || requestUserId || null;

        // 2. Fetch Resume_Details for fallback facts
        db.get("SELECT * FROM Resume_Details WHERE resume_id = ?", [resume_id], (detErr, resumeDetails) => {
            if (detErr) {
                console.error("Error fetching resume details:", detErr);
                return res.status(500).json({ error: "Failed to fetch resume details" });
            }

            const details = resumeDetails || {};
            let meta = {};
            try {
                meta = JSON.parse(details.metadata || "{}");
            } catch (e) {
                meta = {};
            }

            // Consolidate personal details
            const incomingPersonal = req.body.personal || {};
            const personal = {
                name: incomingPersonal.name || details.name || meta.name || "",
                title: incomingPersonal.title || meta.title || "",
                email: incomingPersonal.email || details.email || "",
                phone: incomingPersonal.phone || details.phone || "",
                location: incomingPersonal.location || meta.location || "",
                github: incomingPersonal.github || details.github || "",
                linkedin: incomingPersonal.linkedin || details.linkedin || "",
                portfolio_url: incomingPersonal.portfolio_url || meta.portfolio_url || "",
                photo: photo_path || incomingPersonal.photo || meta.photo_path || null
            };

            // Experience fallback
            let finalExperience = [];
            if (experience && Array.isArray(experience) && experience.length > 0) {
                finalExperience = experience;
            } else {
                try {
                    finalExperience = JSON.parse(details.experience || "[]");
                } catch (e) {
                    finalExperience = [];
                }
            }

            // Education fallback
            let finalEducation = [];
            if (education && Array.isArray(education) && education.length > 0) {
                finalEducation = education;
            } else {
                try {
                    finalEducation = JSON.parse(details.education || "[]");
                } catch (e) {
                    finalEducation = [];
                }
            }

            // Skills fallback & flattening
            let finalSkills = [];
            if (skills && (Array.isArray(skills) ? skills.length > 0 : Object.keys(skills).length > 0)) {
                if (Array.isArray(skills)) {
                    finalSkills = skills;
                } else if (typeof skills === "object") {
                    finalSkills = skills.all || Object.values(skills).flat().filter(Boolean);
                }
            } else {
                try {
                    const parsedDbSkills = JSON.parse(details.skills || "[]");
                    if (Array.isArray(parsedDbSkills)) {
                        finalSkills = parsedDbSkills;
                    } else if (parsedDbSkills && typeof parsedDbSkills === "object") {
                        finalSkills = parsedDbSkills.all || Object.values(parsedDbSkills).flat().filter(Boolean);
                    }
                } catch (e) {
                    finalSkills = [];
                }
            }
            finalSkills = finalSkills.map((s) => (typeof s === "string" ? s.trim() : (s?.name || String(s)))).filter(Boolean);

            // Projects fallback
            let finalProjects = [];
            if (projects && Array.isArray(projects) && projects.length > 0) {
                finalProjects = projects;
            } else {
                try {
                    finalProjects = JSON.parse(details.projects || "[]");
                } catch (e) {
                    finalProjects = [];
                }
            }

            // Certificates fallback
            let finalCertificates = [];
            if (certificates && Array.isArray(certificates) && certificates.length > 0) {
                finalCertificates = certificates;
            } else {
                try {
                    finalCertificates = JSON.parse(details.certifications || "[]");
                } catch (e) {
                    finalCertificates = [];
                }
            }

            // Achievements fallback
            let finalAchievements = [];
            if (achievements && Array.isArray(achievements) && achievements.length > 0) {
                finalAchievements = achievements;
            } else {
                try {
                    finalAchievements = JSON.parse(details.achievements || "[]");
                } catch (e) {
                    finalAchievements = [];
                }
            }

            // Languages fallback
            let finalLanguages = [];
            if (languages && Array.isArray(languages) && languages.length > 0) {
                finalLanguages = languages;
            } else {
                try {
                    finalLanguages = JSON.parse(details.languages || "[]");
                } catch (e) {
                    finalLanguages = [];
                }
            }

            // Custom Sections fallback
            let finalCustomSections = [];
            if (custom_sections && Array.isArray(custom_sections) && custom_sections.length > 0) {
                finalCustomSections = custom_sections;
            } else {
                try {
                    finalCustomSections = JSON.parse(details.custom_sections || "[]");
                } catch (e) {
                    finalCustomSections = [];
                }
            }

            const resolvedPhoto = photo_path || personal.photo || null;
            const resolvedAbout = (about && typeof about === "string" && about.trim()) ? about.trim() : (details.about || "");
            const resolvedTemplate = template_name || "minimal";
            const resolvedTheme = theme || (resolvedTemplate === "dark" ? "dark" : "light");
            const resolvedOrder = section_order || [
                "about",
                "experience",
                "education",
                "skills",
                "projects",
                "certificates",
                "achievements",
                "languages"
            ];

            // 3. Search for existing portfolio for this resume to prevent duplicate records
            db.get("SELECT portfolio_id FROM portfolio WHERE resume_id = ?", [resume_id], (checkErr, existingRow) => {
                if (checkErr) {
                    console.error("Error checking existing portfolio:", checkErr);
                    return res.status(500).json({ error: "Failed to check existing portfolio" });
                }

                if (existingRow) {
                    // Update existing portfolio
                    const updateSQL = `
                        UPDATE portfolio
                        SET
                            user_id = ?,
                            template_name = ?,
                            theme = ?,
                            photo_path = ?,
                            personal = ?,
                            about = ?,
                            experience = ?,
                            education = ?,
                            skills = ?,
                            projects = ?,
                            certificates = ?,
                            achievements = ?,
                            languages = ?,
                            custom_sections = ?,
                            section_order = ?
                        WHERE portfolio_id = ?
                    `;

                    const updateValues = [
                        effectiveUserId,
                        resolvedTemplate,
                        resolvedTheme,
                        resolvedPhoto,
                        JSON.stringify(personal),
                        resolvedAbout,
                        JSON.stringify(finalExperience),
                        JSON.stringify(finalEducation),
                        JSON.stringify(finalSkills),
                        JSON.stringify(finalProjects),
                        JSON.stringify(finalCertificates),
                        JSON.stringify(finalAchievements),
                        JSON.stringify(finalLanguages),
                        JSON.stringify(finalCustomSections),
                        JSON.stringify(resolvedOrder),
                        existingRow.portfolio_id
                    ];

                    db.run(updateSQL, updateValues, function (upErr) {
                        if (upErr) {
                            console.error("Error updating existing portfolio:", upErr);
                            return res.status(500).json({ error: upErr.message });
                        }

                        console.log("Existing portfolio updated. ID:", existingRow.portfolio_id);
                        return res.status(200).json({
                            message: "Portfolio updated successfully",
                            portfolio_id: existingRow.portfolio_id,
                            isExisting: true
                        });
                    });
                } else {
                    // Insert new portfolio
                    const insertSQL = `
                        INSERT INTO portfolio
                        (
                            user_id,
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
                            custom_sections,
                            section_order,
                            generated_date
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                    `;

                    const insertValues = [
                        effectiveUserId,
                        resume_id,
                        resolvedTemplate,
                        resolvedTheme,
                        resolvedPhoto,
                        JSON.stringify(personal),
                        resolvedAbout,
                        JSON.stringify(finalExperience),
                        JSON.stringify(finalEducation),
                        JSON.stringify(finalSkills),
                        JSON.stringify(finalProjects),
                        JSON.stringify(finalCertificates),
                        JSON.stringify(finalAchievements),
                        JSON.stringify(finalLanguages),
                        JSON.stringify(finalCustomSections),
                        JSON.stringify(resolvedOrder)
                    ];

                    db.run(insertSQL, insertValues, function (inErr) {
                        if (inErr) {
                            console.error("Error creating new portfolio:", inErr);
                            return res.status(500).json({ error: inErr.message });
                        }

                        console.log("New portfolio created. ID:", this.lastID);
                        return res.status(201).json({
                            message: "Portfolio created successfully",
                            portfolio_id: this.lastID,
                            isExisting: false
                        });
                    });
                }
            });
        });
    });
});

// =====================================================
// UPDATE PORTFOLIO
// PUT /api/portfolio/:portfolioId
// =====================================================

router.put("/:portfolioId", (req, res) => {
    const { portfolioId } = req.params;
    const requestUserId = getRequestUserId(req);

    // Verify ownership before updating
    verifyPortfolioOwnership(portfolioId, requestUserId, (verifyErr, isOwner, portfolioRow) => {
        if (verifyErr) {
            console.error("Error checking portfolio ownership:", verifyErr);
            return res.status(500).json({ error: "Failed to verify ownership" });
        }

        if (!portfolioRow) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        if (requestUserId && !isOwner) {
            return res.status(403).json({ error: "Unauthorized. You do not own this portfolio." });
        }

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
            custom_sections,
            ai_suggestions,
            section_order
        } = req.body;

        const updateSQL = `
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
                custom_sections = ?,
                ai_suggestions = ?,
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
                    portfolio_url: "",
                    photo: ""
                }
            ),
            template_name || portfolioRow.template_name || "minimal",
            theme || portfolioRow.theme || "light",
            photo_path !== undefined ? photo_path : portfolioRow.photo_path,
            about !== undefined ? about : portfolioRow.about,
            JSON.stringify(experience !== undefined ? experience : []),
            JSON.stringify(education !== undefined ? education : []),
            JSON.stringify(skills !== undefined ? skills : []),
            JSON.stringify(projects !== undefined ? projects : []),
            JSON.stringify(certificates !== undefined ? certificates : []),
            JSON.stringify(achievements !== undefined ? achievements : []),
            JSON.stringify(languages !== undefined ? languages : []),
            JSON.stringify(custom_sections !== undefined ? custom_sections : []),
            JSON.stringify(ai_suggestions !== undefined ? ai_suggestions : []),
            JSON.stringify(section_order !== undefined ? section_order : []),
            portfolioId
        ];

        db.run(updateSQL, values, function (err) {
            if (err) {
                console.error("Error updating portfolio:", err);
                return res.status(500).json({ error: "Failed to update portfolio" });
            }

            return res.status(200).json({
                message: "Portfolio updated successfully",
                portfolio_id: portfolioId
            });
        });
    });
});

// =====================================================
// DELETE PORTFOLIO
// DELETE /api/portfolio/:portfolioId
// =====================================================

router.delete("/:portfolioId", (req, res) => {
    const { portfolioId } = req.params;
    const requestUserId = getRequestUserId(req);

    verifyPortfolioOwnership(portfolioId, requestUserId, (verifyErr, isOwner, portfolioRow) => {
        if (verifyErr) {
            return res.status(500).json({ error: "Database error" });
        }

        if (!portfolioRow) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        if (requestUserId && !isOwner) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        db.run("DELETE FROM portfolio WHERE portfolio_id = ?", [portfolioId], function (err) {
            if (err) {
                console.error("Error deleting portfolio:", err);
                return res.status(500).json({ error: "Failed to delete portfolio" });
            }

            return res.status(200).json({ message: "Portfolio deleted successfully" });
        });
    });
});

// =====================================================
// AI ABOUT GENERATOR (Multi-Style)
// POST /api/portfolio/generate-about
// =====================================================

const resumeRoutes = require("./resumeRoutes");

router.post("/generate-about", (req, res) => {
    if (typeof resumeRoutes.handleGenerateAbout === "function") {
        return resumeRoutes.handleGenerateAbout(req, res);
    }
    return res.status(500).json({ error: "About generator service not available" });
});

// =====================================================
// AI SUGGESTIONS ANALYZER
// POST /api/portfolio/ai-suggestions
// Advisory recommendations based strictly on candidate facts
// =====================================================

router.post("/ai-suggestions", async (req, res) => {
    try {
        const { resumeData, portfolioId } = req.body;
        let data = resumeData;

        if (!data && portfolioId) {
            const row = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM portfolio WHERE portfolio_id = ?", [portfolioId], (err, r) => {
                    if (err) return reject(err);
                    resolve(r);
                });
            });
            if (row) {
                data = parsePortfolioRow(row);
            }
        }

        if (!data) {
            return res.status(400).json({ error: "Portfolio or resume data is required for suggestions" });
        }

        const personal = data.personal || {};
        const title = (personal.title || "").trim();
        const about = (data.about || data.summary || "").trim();
        const skills = Array.isArray(data.skills) ? data.skills : [];
        const experience = Array.isArray(data.experience) ? data.experience : [];
        const education = Array.isArray(data.education) ? data.education : [];
        const projects = Array.isArray(data.projects) ? data.projects : [];
        const certificates = Array.isArray(data.certificates) ? data.certificates : [];
        const photo = personal.photo || data.photo_path || null;

        const suggestions = [];

        // 1. Professional Title / Headline
        if (!title) {
            suggestions.push({
                id: "headline_missing",
                category: "Headline",
                type: "warning",
                title: "Add a clear professional title",
                description: "A prominent headline (e.g. 'Senior Accountant', 'Clinical Nurse', 'High School Teacher') immediately anchors your portfolio for visitors."
            });
        } else if (title.length < 4) {
            suggestions.push({
                id: "headline_short",
                category: "Headline",
                type: "info",
                title: "Expand professional headline",
                description: `Consider clarifying '${title}' to specify your key specialization or domain focus.`
            });
        } else {
            suggestions.push({
                id: "headline_good",
                category: "Headline",
                type: "success",
                title: "Strong headline present",
                description: `Headline '${title}' establishes clear professional positioning.`
            });
        }

        // 2. About Summary
        if (!about) {
            suggestions.push({
                id: "about_missing",
                category: "About",
                type: "warning",
                title: "Craft an introduction summary",
                description: "An 'About Me' statement provides narrative context to your skills. Use the AI About Generator above to generate styles in one click."
            });
        } else if (about.split(/\s+/).length < 20) {
            suggestions.push({
                id: "about_brief",
                category: "About",
                type: "info",
                title: "Summary is very brief",
                description: "Your summary is under 20 words. Expanding it slightly with your core strengths and goals adds depth to your hero section."
            });
        }

        // 3. Measurable Impact in Experience / Work
        if (experience.length > 0) {
            const hasMetrics = experience.some((e) => /\d+%|\$\d+|\d+\s*(years?|students?|patients?|clients?|projects?|team)/i.test(e.description || ""));
            if (!hasMetrics) {
                suggestions.push({
                    id: "metrics_missing",
                    category: "Experience",
                    type: "recommendation",
                    title: "Include quantifiable achievements",
                    description: "Add numbers or outcomes to your responsibilities (e.g. 'Managed 30+ students', 'Reduced billing turnaround by 15%', 'Supervised 12 staff members')."
                });
            } else {
                suggestions.push({
                    id: "metrics_present",
                    category: "Experience",
                    type: "success",
                    title: "Quantified impact detected",
                    description: "Your experience includes measurable outcomes and scope metrics."
                });
            }
        }

        // 4. Skills Organization
        if (skills.length < 3) {
            suggestions.push({
                id: "skills_few",
                category: "Skills",
                type: "warning",
                title: "Highlight core competencies",
                description: "Listing at least 5-8 relevant domain competencies and tools helps visitors quickly assess your expertise."
            });
        } else if (skills.length > 15) {
            suggestions.push({
                id: "skills_many",
                category: "Skills",
                type: "info",
                title: "Focus on top skills",
                description: "You have over 15 skills listed. Consider prioritizing the most impactful skills so the portfolio looks structured and focused."
            });
        }

        // 5. Contact & Social Links
        const hasLinkedIn = Boolean(personal.linkedin && personal.linkedin.trim());
        const hasEmail = Boolean(personal.email && personal.email.trim());
        const hasPhone = Boolean(personal.phone && personal.phone.trim());

        if (!hasEmail && !hasPhone) {
            suggestions.push({
                id: "contact_missing",
                category: "Contact",
                type: "warning",
                title: "Add at least one contact method",
                description: "Ensure potential collaborators or employers have an easy way to reach out."
            });
        }

        if (!hasLinkedIn) {
            suggestions.push({
                id: "linkedin_missing",
                category: "Contact",
                type: "recommendation",
                title: "Connect LinkedIn profile",
                description: "Adding your LinkedIn profile enhances professional credibility across all career paths."
            });
        }

        // 6. Profile Photo
        if (!photo) {
            suggestions.push({
                id: "photo_missing",
                category: "Visuals",
                type: "info",
                title: "Add a professional headshot",
                description: "A friendly, professional photo significantly increases engagement on modern portfolios."
            });
        }

        // 7. Work / Projects
        if (projects.length === 0 && experience.length === 0) {
            suggestions.push({
                id: "work_missing",
                category: "Work & Projects",
                type: "warning",
                title: "Add projects or professional work",
                description: "Showcasing tangible case studies, clinical cases, creative works, or projects makes your portfolio memorable."
            });
        }

        return res.status(200).json({
            message: "AI suggestions generated successfully",
            suggestions,
            count: suggestions.length
        });
    } catch (error) {
        console.error("Error generating AI suggestions:", error);
        return res.status(500).json({
            error: "Failed to generate AI suggestions",
            message: error.message
        });
    }
});

module.exports = router;
