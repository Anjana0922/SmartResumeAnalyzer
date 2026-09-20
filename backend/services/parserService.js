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
// LEGACY RULE-BASED PARSER
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


    const lines = text
        .split("\n")
        .map((line) =>
            line
                .replace(/\r/g, "")
                .replace(/\t/g, " ")
                .trim()
        )
        .filter((line) => line.length > 0);


    const sections = detectSections(lines);


    console.log(
        "\n========== DETECTED SECTIONS =========="
    );

    console.log(sections);


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


    console.log(
        "\n========== PARSED RESUME =========="
    );


    console.log(
        JSON.stringify(result, null, 2)
    );


    return result;
}


// ==========================================
// MAIN RESUME PARSER
// ==========================================

async function parseResume(text) {

    if (!text || typeof text !== "string") {

        throw new Error(
            "Resume text is empty or invalid."
        );
    }


    try {

        console.log(
            "[Parser Service] Sending resume to AI parser..."
        );


        // ==========================================
        // PRIMARY PARSER
        // ==========================================

        const aiResult =
            await parseWithAI(text);


        console.log(
            "[Parser Service] AI parsing completed successfully."
        );


        return aiResult;


    } catch (error) {

        // ==========================================
        // IMPORTANT
        // ==========================================
        //
        // Do NOT automatically use the old
        // rule-based parser here.
        //
        // The rule-based parser does not understand
        // arbitrary resume layouts reliably and can
        // produce corrupted structured data.
        //
        // Saving that result to the database would
        // be worse than rejecting the upload.
        // ==========================================


        console.error(
            "[Parser Service] AI parsing failed."
        );


        console.error(
            "[Parser Service] Error:",
            error.message
        );


        const parserError =
            new Error(
                "AI resume parsing is temporarily unavailable. Please try uploading the resume again."
            );


        parserError.code =
            "AI_PARSER_UNAVAILABLE";


        parserError.originalError =
            error;


        throw parserError;
    }
}


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    parseResume,

    // Keep the legacy parser available for
    // testing/manual use, but do not automatically
    // use it when AI parsing fails.
    parseResumeRuleBased,

    normalizeResumeData,
};