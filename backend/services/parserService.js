const {
    detectSections,
} = require("./sectionDetector");

const {
    parsePersonal,
} = require("./parsers/personalParser");

const {
    parseEducation,
} = require("./parsers/educationParser");

const {
    parseSkills,
} = require("./parsers/skillsParser");

const {
    parseProjects,
} = require("./parsers/projectsParser");

const {
    parseCertificates,
} = require("./parsers/certificatesParser");

const {
    parseAchievements,
} = require("./parsers/achievementsParser");

const {
    parseLanguages,
} = require("./parsers/languagesParser");

const {
    parseExperience,
} = require("./parsers/experienceParser");

const {
    parseWithAI,
    normalizeResumeData,
} = require("./aiParserService");

// ==========================================
// LEGACY RULE-BASED PARSER (FALLBACK)
// ==========================================

function parseResumeRuleBased(text) {
    if (!text || typeof text !== "string") {
        return {
            personal: {
                name: "",
                email: "",
                phone: "",
                address: "",
                github: "",
                linkedin: "",
            },

            about: "",

            education: [],
            experience: [],
            skills: [],
            projects: [],
            certificates: [],
            achievements: [],
            languages: [],
        };
    }

    // ==========================================
    // CLEAN TEXT
    // ==========================================

    const lines = text
        .split("\n")
        .map((line) =>
            line
                .replace(/\r/g, "")
                .replace(/\t/g, " ")
                .trim()
        )
        .filter((line) => line.length > 0);

    // ==========================================
    // DETECT SECTIONS
    // ==========================================

    const sections = detectSections(lines);

    console.log(
        "\n========== DETECTED SECTIONS =========="
    );

    console.log(sections);

    // ==========================================
    // PARSE EACH SECTION
    // ==========================================

    const personal =
        parsePersonal(lines, sections);

    const education =
        parseEducation(lines, sections);

    const skills =
        parseSkills(lines, sections);

    const projects =
        parseProjects(lines, sections);

    const certificates =
        parseCertificates(lines, sections);

    const achievements =
        parseAchievements(lines, sections);

    const languages =
        parseLanguages(lines, sections);

    const experience =
        parseExperience(lines, sections);

    // ==========================================
    // ABOUT / SUMMARY
    // ==========================================

    let about = "";

    if (sections.about !== undefined) {
        const start = sections.about;

        const nextSections = Object.values(sections)
            .filter((index) => index > start)
            .sort((a, b) => a - b);

        const end =
            nextSections.length > 0
                ? nextSections[0]
                : lines.length;

        about = lines
            .slice(start + 1, end)
            .join(" ");
    }

    // ==========================================
    // FINAL STANDARDIZED OBJECT
    // ==========================================

    const result = {
        personal,

        about,

        education,

        experience,

        skills,

        projects,

        certificates,

        achievements,

        languages,
    };

    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
        "\n========== PARSED RESUME =========="
    );

    console.log(
        JSON.stringify(result, null, 2)
    );

    return result;
}

// ==========================================
// MAIN ASYNC PARSER (AI + FALLBACK)
// ==========================================

async function parseResume(text) {
    if (!text || typeof text !== "string") {
        return normalizeResumeData({}, "");
    }

    try {
        const aiResult = await parseWithAI(text);
        return aiResult;
    } catch (error) {
        console.warn(`[Parser Service] AI Parser note: ${error.message}`);
        console.warn("[Parser Service] Falling back to rule-based parser...");

        const ruleBasedResult = parseResumeRuleBased(text);
        return normalizeResumeData(ruleBasedResult, text);
    }
}

module.exports = {
    parseResume,
    parseResumeRuleBased,
    normalizeResumeData,
};