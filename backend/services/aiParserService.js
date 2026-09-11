const { GoogleGenAI } = require("@google/genai");

// =========================================================
// CANONICAL SCHEMA NORMALIZATION & VALIDATION
// =========================================================

/**
 * Normalizes any parsed resume data (from AI or rule-based fallback)
 * to strictly adhere to the agreed Canonical Resume JSON Schema.
 */
function normalizeResumeData(raw = {}, rawText = "") {
    const safeObj = typeof raw === "object" && raw !== null ? raw : {};

    // 1. Personal details
    const rawPersonal = typeof safeObj.personal === "object" && safeObj.personal !== null ? safeObj.personal : {};
    const personal = {
        name: String(rawPersonal.name || "").trim(),
        title: String(rawPersonal.title || "").trim(),
        email: String(rawPersonal.email || "").trim().toLowerCase(),
        phone: String(rawPersonal.phone || "").trim(),
        location: String(rawPersonal.location || rawPersonal.address || "").trim(),
        github: String(rawPersonal.github || "").trim(),
        linkedin: String(rawPersonal.linkedin || "").trim(),
        portfolio_url: String(rawPersonal.portfolio_url || rawPersonal.website || "").trim(),
    };

    // 2. Summary / About (ensuring dual-compatibility)
    const summary = String(safeObj.summary || safeObj.about || "").trim();
    const about = summary; // alias for backwards compatibility

    // 3. Education
    const rawEducation = Array.isArray(safeObj.education) ? safeObj.education : [];
    const education = rawEducation.map((item) => {
        const edu = typeof item === "object" && item !== null ? item : {};
        return {
            degree: String(edu.degree || edu.course || "").trim(),
            institution: String(edu.institution || edu.institute || edu.university || edu.college || "").trim(),
            location: String(edu.location || "").trim(),
            year: String(edu.year || edu.duration || "").trim(),
            score: String(edu.score?.value || edu.score || edu.gpa || edu.percentage || "").trim(),
            coursework: Array.isArray(edu.coursework) ? edu.coursework.map(String) : [],
        };
    }).filter((item) => item.degree || item.institution);

    // 4. Experience & Internships
    const rawExp = Array.isArray(safeObj.experience) ? safeObj.experience : [];
    const experience = rawExp.map((item) => {
        const exp = typeof item === "object" && item !== null ? item : {};
        const role = String(exp.role || exp.title || exp.position || "").trim();
        const company = String(exp.company || exp.organization || "").trim();
        const description = String(exp.description || "").trim();

        // Auto-detect internship status
        const isInternship = Boolean(
            exp.is_internship === true ||
            /intern(ship)?/i.test(role) ||
            /intern(ship)?/i.test(description)
        );

        return {
            role,
            company,
            location: String(exp.location || "").trim(),
            duration: String(exp.duration || exp.year || "").trim(),
            is_current: Boolean(exp.is_current || /present|current/i.test(exp.duration || "")),
            is_internship: isInternship,
            description,
            highlights: Array.isArray(exp.highlights) ? exp.highlights.map(String) : [],
            technologies: Array.isArray(exp.technologies) ? exp.technologies.map(String) : [],
        };
    }).filter((item) => item.role || item.company);

    // 5. Skills (both flat array for existing frontend compatibility and categorized)
    let flatSkills = [];
    let categorizedSkills = {
        technical: [],
        frameworks: [],
        tools: [],
        soft: [],
        all: [],
    };

    if (Array.isArray(safeObj.skills)) {
        flatSkills = safeObj.skills.map((s) => String(s).trim()).filter(Boolean);
        categorizedSkills.technical = [...flatSkills];
        categorizedSkills.all = [...flatSkills];
    } else if (typeof safeObj.skills === "object" && safeObj.skills !== null) {
        const rawSkills = safeObj.skills;
        for (const [key, val] of Object.entries(rawSkills)) {
            if (Array.isArray(val)) {
                const cleaned = val.map((s) => String(s).trim()).filter(Boolean);
                if (key in categorizedSkills) {
                    categorizedSkills[key] = cleaned;
                } else {
                    categorizedSkills.technical.push(...cleaned);
                }
                flatSkills.push(...cleaned);
            }
        }
        flatSkills = Array.from(new Set(flatSkills));
        categorizedSkills.all = flatSkills;
    }

    // 6. Projects
    const rawProjects = Array.isArray(safeObj.projects) ? safeObj.projects : [];
    const projects = rawProjects.map((item) => {
        const proj = typeof item === "object" && item !== null ? item : {};
        return {
            title: String(proj.title || proj.name || "").trim(),
            subtitle: String(proj.subtitle || "").trim(),
            description: String(proj.description || "").trim(),
            technologies: Array.isArray(proj.technologies) ? proj.technologies.map(String) : [],
            link: String(proj.link || proj.url || "").trim(),
            github: String(proj.github || "").trim(),
            duration: String(proj.duration || "").trim(),
        };
    }).filter((item) => item.title || item.description);

    // 7. Certificates
    const rawCerts = Array.isArray(safeObj.certificates || safeObj.certifications) ? (safeObj.certificates || safeObj.certifications) : [];
    const certificates = rawCerts.map((item) => {
        const cert = typeof item === "object" && item !== null ? item : {};
        return {
            name: String(cert.name || cert.title || "").trim(),
            issuer: String(cert.issuer || cert.organization || "").trim(),
            year: String(cert.year || cert.date || "").trim(),
            link: String(cert.link || cert.url || "").trim(),
        };
    }).filter((item) => item.name);

    // 8. Achievements
    const rawAchievements = Array.isArray(safeObj.achievements) ? safeObj.achievements : [];
    const achievements = rawAchievements.map((item) => {
        if (typeof item === "string") return item.trim();
        if (typeof item === "object" && item !== null) return String(item.title || item.description || "").trim();
        return String(item).trim();
    }).filter(Boolean);

    // 9. Languages
    const rawLanguages = Array.isArray(safeObj.languages) ? safeObj.languages : [];
    const languages = rawLanguages.map((item) => {
        if (typeof item === "string") {
            return { name: item.trim(), level: "" };
        }
        if (typeof item === "object" && item !== null) {
            return {
                name: String(item.name || item.language || "").trim(),
                level: String(item.level || item.proficiency || "").trim(),
            };
        }
        return { name: String(item).trim(), level: "" };
    }).filter((item) => item.name);

    // 10. Custom / Additional Sections
    const rawCustom = Array.isArray(safeObj.custom_sections) ? safeObj.custom_sections : [];
    const custom_sections = rawCustom.map((item) => {
        const sec = typeof item === "object" && item !== null ? item : {};
        return {
            heading: String(sec.heading || sec.title || "Additional Section").trim(),
            items: Array.isArray(sec.items)
                ? sec.items.map((i) => ({
                    title: String(i.title || "").trim(),
                    subtitle: String(i.subtitle || "").trim(),
                    date: String(i.date || "").trim(),
                    description: String(i.description || (typeof i === "string" ? i : "")).trim(),
                }))
                : [],
        };
    }).filter((sec) => sec.heading && sec.items.length > 0);

    return {
        metadata: {
            version: "1.0",
            source: safeObj.metadata?.source || "upload",
            user_category: safeObj.metadata?.user_category || "Student",
            last_updated: safeObj.metadata?.last_updated || new Date().toISOString(),
        },
        personal,
        summary,
        about,
        education,
        experience,
        skills: {
            technical: categorizedSkills.technical || [],
            frameworks: categorizedSkills.frameworks || [],
            tools: categorizedSkills.tools || [],
            soft: categorizedSkills.soft || [],
            all: categorizedSkills.all || flatSkills || [],
        },
        categorized_skills: categorizedSkills,
        flat_skills: flatSkills,
        projects,
        certificates,
        achievements,
        languages,
        custom_sections,
    };
}

// =========================================================
// AI PARSER IMPLEMENTATION (GEMINI)
// =========================================================

const AI_PARSER_SYSTEM_PROMPT = `
You are an expert resume parsing intelligence. Your task is to analyze resume plaintext and extract all professional, academic, and personal information into an accurate, complete JSON document adhering strictly to the canonical schema.

Guidelines:
1. Candidate Identity: Extract full name, email, phone, location, LinkedIn URL, GitHub URL, portfolio URL, and a professional headline/title.
2. Summary/About: Extract or synthesize a compelling 2-4 sentence professional summary (for Job Seekers) or career objective (for Students).
3. Education: Extract degree, institution, location, graduation year/range, GPA/percentage, and notable coursework.
4. Experience & Internships: Extract work history and internships. For each, capture role, company, location, duration, and bullet points/descriptions. Flag internships explicitly with "is_internship": true.
5. Skills: Extract all skills. Separate them into technical, frameworks, tools, soft skills, and provide a comprehensive "all" array.
6. Projects: Extract project title, subtitle, description, technologies used (as string array), live link, and GitHub repository URL.
7. Certifications: Extract certification name, issuing organization, and year.
8. Achievements: Extract honors, awards, publications, and notable milestones as bullet strings.
9. Languages: Extract spoken/written languages and proficiency level (Native, Fluent, Intermediate, Basic) if mentioned.
10. Dynamic/Additional Sections: If the resume contains custom sections (e.g., Volunteer Work, Publications, Extracurricular Activities, Hackathons, Leadership), capture them under "custom_sections" with heading and structured item objects.
11. Output: Return pure JSON without markdown code fences or conversational text.
`;

/**
 * Invokes Gemini AI to parse resume text into the canonical schema.
 * Throws an error if API key is missing or call fails.
 */
async function parseWithAI(resumeText) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Please parse the following resume text into canonical JSON format:

--- RESUME TEXT START ---
${resumeText}
--- RESUME TEXT END ---
`;

    console.log(`[AI Parser] Sending text to Gemini model (${modelName})...`);

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            systemInstruction: AI_PARSER_SYSTEM_PROMPT,
            responseMimeType: "application/json",
        },
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("Empty response received from Gemini model.");
    }

    // Clean any accidental markdown code fences
    const cleanedJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

    const rawParsed = JSON.parse(cleanedJson);
    console.log("[AI Parser] Successfully parsed resume with AI.");

    return normalizeResumeData(rawParsed, resumeText);
}

module.exports = {
    parseWithAI,
    normalizeResumeData,
};
