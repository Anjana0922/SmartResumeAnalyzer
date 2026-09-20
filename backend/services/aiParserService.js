const { GoogleGenAI } = require("@google/genai");

// =========================================================
// 1. GEMINI RESPONSE SCHEMA
// =========================================================

const RESUME_RESPONSE_SCHEMA = {
    type: "object",

    required: [
        "metadata",
        "personal",
        "summary",
        "education",
        "experience",
        "skills",
        "projects",
        "certificates",
        "achievements",
        "languages",
        "custom_sections",
    ],

    properties: {
        metadata: {
            type: "object",

            required: [
                "version",
                "source",
                "user_category",
                "career_target",
                "last_updated",
            ],

            properties: {
                version: {
                    type: "string",
                },

                source: {
                    type: "string",
                },

                user_category: {
                    type: "string",
                },

                career_target: {
                    type: "string",
                },

                last_updated: {
                    type: "string",
                },
            },
        },

        // =====================================================
        // PERSONAL
        // =====================================================

        personal: {
            type: "object",

            required: [
                "name",
                "title",
                "email",
                "phone",
                "location",
                "github",
                "linkedin",
                "portfolio_url",
                "photo",
            ],

            properties: {
                name: {
                    type: "string",
                },

                title: {
                    type: "string",

                    description:
                        "Only the professional title or headline explicitly written in the resume. If no explicit title/headline exists, return an empty string. Never infer, guess, generate, derive, or list possible titles.",
                },

                email: {
                    type: "string",
                },

                phone: {
                    type: "string",
                },

                location: {
                    type: "string",
                },

                github: {
                    type: "string",
                },

                linkedin: {
                    type: "string",
                },

                portfolio_url: {
                    type: "string",
                },

                photo: {
                    type: "string",
                },
            },
        },

        // =====================================================
        // SUMMARY
        // =====================================================

        summary: {
            type: "string",
        },

        // =====================================================
        // EDUCATION
        // =====================================================

        education: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "degree",
                    "institution",
                    "board",
                    "location",
                    "year",
                    "start_year",
                    "end_year",
                    "score",
                    "coursework",
                    "additional_details",
                ],

                properties: {
                    degree: {
                        type: "string",
                    },

                    institution: {
                        type: "string",
                    },

                    board: {
                        type: "string",
                    },

                    location: {
                        type: "string",
                    },

                    year: {
                        type: "string",
                    },

                    start_year: {
                        type: "string",
                    },

                    end_year: {
                        type: "string",
                    },

                    score: {
                        type: "string",
                    },

                    coursework: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },

                    additional_details: {
                        type: "string",
                    },
                },
            },
        },

        // =====================================================
        // EXPERIENCE
        // =====================================================

        experience: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "role",
                    "company",
                    "location",
                    "duration",
                    "start_date",
                    "end_date",
                    "employment_type",
                    "is_current",
                    "is_internship",
                    "description",
                    "responsibilities",
                    "highlights",
                    "achievements",
                    "technologies",
                ],

                properties: {
                    role: {
                        type: "string",
                    },

                    company: {
                        type: "string",
                    },

                    location: {
                        type: "string",
                    },

                    duration: {
                        type: "string",
                    },

                    start_date: {
                        type: "string",
                    },

                    end_date: {
                        type: "string",
                    },

                    employment_type: {
                        type: "string",
                    },

                    is_current: {
                        type: "boolean",
                    },

                    is_internship: {
                        type: "boolean",
                    },

                    description: {
                        type: "string",
                    },

                    responsibilities: {
                        type: "string",
                    },

                    highlights: {
                        type: "array",

                        items: {
                            type: "string",
                        },
                    },

                    achievements: {
                        type: "string",
                    },

                    technologies: {
                        type: "array",

                        items: {
                            type: "string",
                        },
                    },
                },
            },
        },

        // =====================================================
        // SKILLS
        // =====================================================

        skills: {
            type: "object",

            required: [
                "professional",
                "technical",
                "frameworks",
                "tools",
                "soft",
                "all",
            ],

            properties: {
                professional: {
                    type: "array",

                    items: {
                        type: "string",
                    },
                },

                technical: {
                    type: "array",

                    items: {
                        type: "string",
                    },
                },

                frameworks: {
                    type: "array",

                    items: {
                        type: "string",
                    },
                },

                tools: {
                    type: "array",

                    items: {
                        type: "string",
                    },
                },

                soft: {
                    type: "array",

                    items: {
                        type: "string",
                    },
                },

                all: {
                    type: "array",

                    items: {
                        type: "string",
                    },
                },
            },
        },

        // =====================================================
        // PROJECTS
        // =====================================================

        projects: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "title",
                    "subtitle",
                    "role",
                    "organization",
                    "start_date",
                    "end_date",
                    "duration",
                    "description",
                    "responsibilities",
                    "outcomes",
                    "technologies",
                    "link",
                    "github",
                ],

                properties: {
                    title: {
                        type: "string",
                    },

                    subtitle: {
                        type: "string",
                    },

                    role: {
                        type: "string",
                    },

                    organization: {
                        type: "string",
                    },

                    start_date: {
                        type: "string",
                    },

                    end_date: {
                        type: "string",
                    },

                    duration: {
                        type: "string",
                    },

                    description: {
                        type: "string",
                    },

                    responsibilities: {
                        type: "string",
                    },

                    outcomes: {
                        type: "string",
                    },

                    technologies: {
                        type: "array",

                        items: {
                            type: "string",
                        },
                    },

                    link: {
                        type: "string",
                    },

                    github: {
                        type: "string",
                    },
                },
            },
        },

        // =====================================================
        // CERTIFICATES
        // =====================================================

        certificates: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "name",
                    "issuer",
                    "year",
                    "link",
                ],

                properties: {
                    name: {
                        type: "string",
                    },

                    issuer: {
                        type: "string",
                    },

                    year: {
                        type: "string",
                    },

                    link: {
                        type: "string",
                    },
                },
            },
        },

        // =====================================================
        // ACHIEVEMENTS
        // =====================================================

        achievements: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "title",
                    "description",
                ],

                properties: {
                    title: {
                        type: "string",
                    },

                    description: {
                        type: "string",
                    },
                },
            },
        },

        // =====================================================
        // LANGUAGES
        // =====================================================

        languages: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "name",
                    "level",
                ],

                properties: {
                    name: {
                        type: "string",
                    },

                    level: {
                        type: "string",
                    },
                },
            },
        },

        // =====================================================
        // CUSTOM SECTIONS
        // =====================================================

        custom_sections: {
            type: "array",

            items: {
                type: "object",

                required: [
                    "heading",
                    "items",
                ],

                properties: {
                    heading: {
                        type: "string",
                    },

                    items: {
                        type: "array",

                        items: {
                            type: "object",

                            required: [
                                "title",
                                "subtitle",
                                "date",
                                "description",
                            ],

                            properties: {
                                title: {
                                    type: "string",
                                },

                                subtitle: {
                                    type: "string",
                                },

                                date: {
                                    type: "string",
                                },

                                description: {
                                    type: "string",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

// =========================================================
// 2. GENERAL-PURPOSE SEMANTIC AI PROMPT
// =========================================================

const AI_PARSER_SYSTEM_PROMPT = `
You are a GENERAL-PURPOSE SEMANTIC RESUME UNDERSTANDING ENGINE.

Your task is to read the ENTIRE supplied resume and extract its factual information into the provided JSON schema.

The resume may belong to ANY profession.

Examples include:

students,
developers,
engineers,
doctors,
nurses,
teachers,
professors,
researchers,
scientists,
lawyers,
accountants,
designers,
architects,
managers,
analysts,
marketers,
sales professionals,
administrators,
consultants,
healthcare professionals,
finance professionals,
and other professions.

Do NOT assume the resume is a software-development resume.

=========================================================
CORE PRINCIPLE
=========================================================

Understand the meaning of the COMPLETE DOCUMENT before assigning information to fields.

Do not rely primarily on exact section headings.

Use combined evidence from:

- headings
- entry titles
- candidate name
- organizations
- institutions
- employers
- dates
- locations
- descriptions
- responsibilities
- achievements
- technologies
- tools
- scores
- grades
- links
- surrounding entries
- relationships between fields
- document context

Headings are contextual hints, NOT mandatory rules.

=========================================================
CONTACT INFORMATION
=========================================================

Identify:

- name
- email
- phone
- location
- GitHub
- LinkedIn
- portfolio URL

Use intrinsic patterns where possible.

An email-shaped value is an email.

A phone-number-shaped value is a phone number.

A URL-shaped value is a URL.

Do not classify contact information as:

- skills
- languages
- education
- experience
- projects
- certificates
- achievements

=========================================================
PERSONAL TITLE
=========================================================

personal.title MUST ONLY contain a professional title/headline explicitly written in the resume.

Examples:

Software Engineer
Medical Doctor
Assistant Professor
Data Analyst
Graphic Designer
Registered Nurse
Accountant

ONLY use the value when the resume explicitly presents it as a personal title/headline.

If no explicit personal title/headline exists:

return:

""

NEVER infer a title from:

- employment roles
- previous jobs
- projects
- skills
- education
- certifications
- achievements
- profession implied by the resume

NEVER generate possible titles.

NEVER list multiple titles.

=========================================================
PERSONAL LOCATION
=========================================================

personal.location means the candidate's own contact/location.

Do NOT automatically use:

- university location
- college location
- school location
- employer location
- hospital location
- company location
- certification provider location
- project organization location

Those locations belong to their respective entries.

=========================================================
EDUCATION
=========================================================

Recognize formal academic education based on meaning.

Possible education includes:

- school education
- higher secondary
- diploma
- undergraduate degree
- postgraduate degree
- doctorate
- formal academic qualifications

Preserve:

- degree
- qualification
- institution
- university
- board
- location
- dates
- year
- grade
- percentage
- GPA
- CGPA
- coursework
- additional details

Do not confuse:

institution with grade,
board with degree,
grade with organization,
date with phone number,
institution location with candidate location.

=========================================================
EXPERIENCE
=========================================================

Recognize practical or professional work based on what the person actually did.

Possible experience includes:

- full-time work
- part-time work
- internship
- apprenticeship
- traineeship
- clinical work
- teaching
- research
- legal practice
- engineering work
- consulting
- freelance work
- meaningful volunteering
- assistantships
- professional placements
- other practical roles

Use combined evidence from:

role,
organization,
dates,
description,
responsibilities,
achievements,
technologies,
and context.

Set is_internship=true when the resume explicitly indicates:

- internship
- intern
- trainee
- apprenticeship
- equivalent practical training

Do not require the heading "Experience".

=========================================================
PROJECTS
=========================================================

Recognize clearly defined pieces of work such as:

- software applications
- websites
- research implementations
- engineering work
- design work
- academic projects
- business projects
- case studies
- technical implementations
- portfolio work
- other defined work outputs

Use:

title,
description,
responsibilities,
technologies,
outcomes,
dates,
organizations,
links.

Do not classify an item as a project only because the heading contains the word "project".

Understand what the entry actually represents.

=========================================================
CERTIFICATES AND CREDENTIALS
=========================================================

Recognize:

- certificates
- certifications
- licenses
- completed course certificates
- professional credentials
- formal training credentials

Preserve:

- name
- issuer
- year/date
- link
- relevant factual information

Do not confuse:

certificate with degree,
certificate with project,
certificate with experience,
certificate with skill,
certificate with achievement.

=========================================================
ACHIEVEMENTS
=========================================================

Recognize factual accomplishments such as:

- awards
- honors
- recognitions
- competition results
- ranks
- distinctions
- scholarships
- selections
- leadership recognitions
- notable academic achievements
- professional achievements

Classify according to actual meaning.

=========================================================
LANGUAGES
=========================================================

languages means HUMAN spoken or written languages ONLY.

Examples:

English
Malayalam
Hindi
Arabic
French
German
Spanish
Tamil

Do NOT put these into languages:

Python
Java
C
C++
JavaScript
SQL
HTML
CSS
PHP
C#
React
Node.js
Docker
PostgreSQL

Programming languages, frameworks, libraries, databases and tools belong under skills.

=========================================================
SKILLS
=========================================================

Classify skills according to their ACTUAL meaning.

Use these categories:

professional
technical
frameworks
tools
soft

IMPORTANT:

Do NOT force every technology into "frameworks".

Use semantic meaning.

Examples:

Programming languages such as Python, Java, JavaScript, C, C++, PHP, SQL
→ technical

Web markup/style technologies such as HTML and CSS
→ technical

Application frameworks or libraries such as React, Angular, Vue, Django, Spring, Laravel
→ frameworks

Developer/productivity/software tools such as Git, GitHub, Docker, Figma, Jira
→ tools

Databases or database technologies such as PostgreSQL, MySQL, MongoDB
→ technical unless the resume clearly presents them as tools

APIs, REST APIs, GraphQL, testing technologies and technical methods
→ technical unless a more appropriate category is evident

Communication, leadership, teamwork, problem solving
→ soft

Profession-specific capabilities such as:

patient care,
financial analysis,
classroom management,
research methodology,
legal research,
clinical assessment,
graphic design,
laboratory techniques

→ professional or technical according to their meaning.

IMPORTANT:

These examples are semantic guidance, NOT a fixed list.

Do not assume the resume belongs to software development.

Preserve the original skill names.

Never invent skills.

The "all" array MUST contain every extracted skill exactly once.

=========================================================
COMBINED SECTIONS
=========================================================

A single section may contain multiple categories.

Examples:

Training & Certifications
Professional Development
Research & Projects
Achievements & Activities
Education & Awards
Career Highlights
Additional Qualifications

Classify EACH ENTRY independently.

For example:

internship → experience

certification → certificate

defined implementation → project

award → achievement

Do not classify an entire mixed section as one category.

=========================================================
UNUSUAL OR MISSING HEADINGS
=========================================================

Do not require standard headings.

Possible headings include:

My Journey
What I Do
Career Highlights
Selected Contributions
Professional Growth
Learning
Expertise
My Work
Background
Accomplishments
Development
Research
Professional Portfolio
Additional Details

Understand entries semantically.

Some resumes may have no useful headings.

Use:

structure,
patterns,
relationships,
dates,
entities,
meaning.

=========================================================
DIFFERENT FORMATS
=========================================================

Support:

- one-column
- two-column
- multi-column
- traditional
- modern
- minimalist
- graphical
- timeline
- table-based
- dense
- sparse
- unusual ordering
- reordered sections
- combined sections
- header/footer contact information

The extracted text may not preserve visual order.

Therefore do not assume adjacent lines necessarily belong together.

=========================================================
DATES
=========================================================

Recognize:

2024
2024-2025
2024 - 2025
Jan 2024
January 2024
Jan 2024 - Present
01/2024
2024/01
Present
Current
Ongoing

Associate dates with the correct entry.

Preserve original date information whenever possible.

=========================================================
SCORES AND GRADES
=========================================================

Recognize:

GPA
CGPA
percentage
marks
grade
distinction
class
score
rank

Associate scores with the correct entry.

=========================================================
HIGH-FIDELITY EXTRACTION
=========================================================

Preserve meaningful factual information.

Do not unnecessarily summarize or rewrite.

Preserve when present:

- names
- titles
- organizations
- institutions
- locations
- dates
- durations
- grades
- scores
- percentages
- descriptions
- responsibilities
- achievements
- technologies
- tools
- links
- certificates
- issuers
- publications
- research information
- training information
- project information
- language proficiency
- additional details

=========================================================
INFORMATION PRESERVATION
=========================================================

Every meaningful piece of information needs a destination.

If it clearly belongs to a standard category, place it there.

If it does not safely fit a standard category, preserve it in custom_sections.

NEVER delete meaningful information simply because classification is uncertain.

NEVER invent information to fill missing fields.

=========================================================
ANTI-HALLUCINATION
=========================================================

Never invent:

- names
- organizations
- degrees
- jobs
- dates
- skills
- projects
- certificates
- achievements
- locations
- technologies
- responsibilities
- links
- scores
- language proficiency

Only use information supported by the supplied resume.

=========================================================
SEMANTIC CLASSIFICATION
=========================================================

For each meaningful entry determine:

1. What does this information describe?
2. What structural pattern does it have?
3. What context surrounds it?
4. What entities are associated with it?
5. What dates are associated with it?
6. What descriptions/responsibilities are associated with it?
7. What other information confirms its meaning?
8. Which canonical field best represents it?
9. If it cannot safely fit a standard field, should it be preserved in custom_sections?

Do not use simple keyword matching as the primary classification method.

=========================================================
IMPORTANT DISTINCTIONS
=========================================================

Correctly distinguish:

human language vs programming language
email vs language
phone vs date
URL vs language
degree vs certificate
certificate vs experience
project vs job
achievement vs certificate
academic institution vs employer
institution location vs personal location
project technology vs project title
job title vs responsibility
academic grade vs institution
organization vs person
course vs degree
training vs employment
internship vs project

Use meaning + structure + context.

=========================================================
METADATA
=========================================================

metadata is application metadata.

Gemini MUST NOT invent a real-world date for last_updated.

For last_updated:

return an empty string unless an explicit resume update date is clearly present.

The application will generate the actual system timestamp during normalization.

Do not use:

graduation year,
employment year,
certificate year,
or any other resume date

as metadata.last_updated.

=========================================================
OUTPUT
=========================================================

Return ONLY valid JSON matching the provided response schema.

Do not return explanations.

Do not return markdown.

Do not return reasoning.

Do not return assumptions.

If a field is absent, return its appropriate empty value.

Preserve factual information.

The output must represent the actual supplied resume.
`;

// =========================================================
// 3. PERSONAL LOCATION VALIDATION
// =========================================================

function validatePersonalLocation(
    candidateLocation,
    rawText,
    education = [],
    experience = []
) {
    if (
        !candidateLocation ||
        typeof candidateLocation !== "string"
    ) {
        return "";
    }

    const location = candidateLocation.trim();

    if (!location) {
        return "";
    }

    // When normalization is happening without original text,
    // preserve the supplied location.
    if (
        !rawText ||
        typeof rawText !== "string"
    ) {
        return location;
    }

    const lines = rawText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const majorHeadingPattern =
        /^(education|academic|experience|work experience|employment|history|skills|technical skills|summary|profile|about|objective|projects|certifications|certificates|achievements|languages|additional)/i;

    const headerLines = [];

    for (
        let i = 0;
        i < Math.min(lines.length, 30);
        i++
    ) {
        const cleaned = lines[i]
            .replace(
                /[|•▪◾◆►:_-]/g,
                " "
            )
            .replace(/\s+/g, " ")
            .trim();

        if (
            i > 0 &&
            majorHeadingPattern.test(cleaned)
        ) {
            break;
        }

        headerLines.push(lines[i]);
    }

    const headerText =
        headerLines.join(" ").toLowerCase();

    const locationLower =
        location.toLowerCase();

    if (
        headerText.includes(
            locationLower
        )
    ) {
        return location;
    }

    const locationTokens =
        locationLower
            .split(/[,\s/-]+/)
            .map((token) => token.trim())
            .filter(
                (token) =>
                    token.length > 2
            );

    const matchingTokens =
        locationTokens.filter(
            (token) =>
                headerText.includes(token)
        );

    if (
        locationTokens.length >= 2 &&
        matchingTokens.length >= 2
    ) {
        return location;
    }

    const matchesEducationLocation =
        education.some(
            (entry) =>
                entry &&
                typeof entry.location ===
                    "string" &&
                entry.location
                    .toLowerCase() ===
                    locationLower
        );

    const matchesExperienceLocation =
        experience.some(
            (entry) =>
                entry &&
                typeof entry.location ===
                    "string" &&
                entry.location
                    .toLowerCase() ===
                    locationLower
        );

    if (
        matchesEducationLocation ||
        matchesExperienceLocation
    ) {
        return "";
    }

    return "";
}

// =========================================================
// 4. SOURCE EVIDENCE HELPERS
// =========================================================

function hasEmailEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
        text
    );
}

function hasPhoneEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    const phonePattern =
        /(?:\+?\d[\d\s().-]{7,}\d)/g;

    return phonePattern.test(text);
}

function hasEducationEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    return /\b(bachelor|master|doctorate|doctoral|phd|b\.?tech|m\.?tech|b\.?sc|m\.?sc|bca|mca|mba|llb|llm|diploma|degree|university|college|school|higher secondary|secondary education|academic)\b/i.test(
        text
    );
}

function hasExperienceEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    return /\b(experience|employment|professional experience|work history|internship|intern|trainee|apprentice|worked|employed|research experience|clinical experience|teaching experience)\b/i.test(
        text
    );
}

function hasProjectEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    return /\b(projects?|selected work|portfolio|case studies)\b/i.test(
        text
    );
}

function hasSkillEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    return /\b(skills?|technical skills|expertise|competencies|technologies|tools)\b/i.test(
        text
    );
}

function hasCertificateEvidence(text) {
    if (
        !text ||
        typeof text !== "string"
    ) {
        return false;
    }

    return /\b(certifications?|certificates?|credentials?|licenses?|professional credentials)\b/i.test(
        text
    );
}

// =========================================================
// 5. AI RESULT COMPLETENESS VALIDATION
// =========================================================

function validateAIResult(
    raw,
    rawText
) {
    if (
        !raw ||
        typeof raw !== "object" ||
        Array.isArray(raw)
    ) {
        throw new Error(
            "[AI Parser] Gemini returned invalid JSON."
        );
    }

    const requiredTopLevel = [
        "metadata",
        "personal",
        "summary",
        "education",
        "experience",
        "skills",
        "projects",
        "certificates",
        "achievements",
        "languages",
        "custom_sections",
    ];

    for (
        const field of requiredTopLevel
    ) {
        if (!(field in raw)) {
            throw new Error(
                `[AI Parser] Gemini response missing required field: ${field}`
            );
        }
    }

    if (
        !raw.personal ||
        typeof raw.personal !== "object" ||
        Array.isArray(raw.personal)
    ) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid personal data."
        );
    }

    if (!Array.isArray(raw.education)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid education data."
        );
    }

    if (!Array.isArray(raw.experience)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid experience data."
        );
    }

    if (!Array.isArray(raw.projects)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid projects data."
        );
    }

    if (!Array.isArray(raw.certificates)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid certificates data."
        );
    }

    if (!Array.isArray(raw.achievements)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid achievements data."
        );
    }

    if (!Array.isArray(raw.languages)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid languages data."
        );
    }

    if (!Array.isArray(raw.custom_sections)) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid custom_sections data."
        );
    }

    if (
        !raw.skills ||
        typeof raw.skills !== "object" ||
        Array.isArray(raw.skills)
    ) {
        throw new Error(
            "[AI Parser] Gemini response contains invalid skills data."
        );
    }

    const source = String(
        rawText || ""
    );

    // ---------------------------------------------------------
    // Contact information checks
    // ---------------------------------------------------------

    if (
        hasEmailEvidence(source) &&
        !String(
            raw.personal.email || ""
        ).trim()
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract an email that is present in the resume."
        );
    }

    if (
        hasPhoneEvidence(source) &&
        !String(
            raw.personal.phone || ""
        ).trim()
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract a phone number that is present in the resume."
        );
    }

    // ---------------------------------------------------------
    // Semantic section checks
    // ---------------------------------------------------------

    if (
        hasEducationEvidence(source) &&
        raw.education.length === 0
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract education information that appears to exist in the resume."
        );
    }

    if (
        hasExperienceEvidence(source) &&
        raw.experience.length === 0
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract experience information that appears to exist in the resume."
        );
    }

    if (
        hasProjectEvidence(source) &&
        raw.projects.length === 0
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract project information that appears to exist in the resume."
        );
    }

    if (
        hasSkillEvidence(source) &&
        (
            !Array.isArray(
                raw.skills.all
            ) ||
            raw.skills.all.length === 0
        )
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract skills information that appears to exist in the resume."
        );
    }

    if (
        hasCertificateEvidence(source) &&
        raw.certificates.length === 0
    ) {
        throw new Error(
            "[AI Parser] Gemini failed to extract certificate information that appears to exist in the resume."
        );
    }

    return true;
}

// =========================================================
// 6. NORMALIZATION
// =========================================================

function normalizeResumeData(
    raw = {},
    rawText = ""
) {
    const safeObj =
        typeof raw === "object" &&
        raw !== null &&
        !Array.isArray(raw)
            ? raw
            : {};

    // ---------------------------------------------------------
    // Personal
    // ---------------------------------------------------------

    const rawPersonal =
        typeof safeObj.personal ===
            "object" &&
        safeObj.personal !== null &&
        !Array.isArray(
            safeObj.personal
        )
            ? safeObj.personal
            : {};

    const name = String(
        rawPersonal.name ||
            rawPersonal.full_name ||
            rawPersonal.candidate_name ||
            safeObj.name ||
            safeObj.full_name ||
            safeObj.candidate_name ||
            ""
    ).trim();

    const title = String(
        rawPersonal.title || ""
    ).trim();

    const email = String(
        rawPersonal.email ||
            rawPersonal.email_address ||
            safeObj.email ||
            safeObj.email_address ||
            ""
    )
        .trim()
        .toLowerCase();

    const phone = String(
        rawPersonal.phone ||
            rawPersonal.phone_number ||
            rawPersonal.mobile ||
            rawPersonal.contact ||
            safeObj.phone ||
            safeObj.mobile ||
            ""
    ).trim();

    const rawLocation = String(
        rawPersonal.location ||
            rawPersonal.address ||
            safeObj.location ||
            safeObj.address ||
            ""
    ).trim();

    const github = String(
        rawPersonal.github ||
            rawPersonal.github_url ||
            safeObj.github ||
            ""
    ).trim();

    const linkedin = String(
        rawPersonal.linkedin ||
            rawPersonal.linkedin_url ||
            safeObj.linkedin ||
            ""
    ).trim();

    const portfolio_url =
        String(
            rawPersonal.portfolio_url ||
                rawPersonal.website ||
                rawPersonal.portfolio ||
                safeObj.portfolio_url ||
                safeObj.website ||
                ""
        ).trim();

    const photo = String(
        rawPersonal.photo ||
            safeObj.photo_path ||
            safeObj.metadata?.photo_path ||
            ""
    ).trim();

    // ---------------------------------------------------------
    // Summary
    // ---------------------------------------------------------

    const summary = String(
        safeObj.summary ||
            safeObj.about ||
            safeObj.profile ||
            safeObj.objective ||
            safeObj.career_objective ||
            safeObj.professional_summary ||
            ""
    ).trim();

    const about = summary;

    // ---------------------------------------------------------
    // Education
    // ---------------------------------------------------------

    const rawEducation =
        Array.isArray(
            safeObj.education
        )
            ? safeObj.education
            : [];

    const education =
        rawEducation
            .map((item) => {
                const edu =
                    typeof item ===
                        "object" &&
                    item !== null &&
                    !Array.isArray(item)
                        ? item
                        : {};

                const start_year =
                    String(
                        edu.start_year ||
                            ""
                    ).trim();

                const end_year =
                    String(
                        edu.end_year ||
                            ""
                    ).trim();

                let year =
                    String(
                        edu.year ||
                            edu.duration ||
                            ""
                    ).trim();

                if (
                    !year &&
                    (start_year ||
                        end_year)
                ) {
                    year =
                        start_year &&
                        end_year
                            ? `${start_year} - ${end_year}`
                            : end_year ||
                              start_year;
                }

                return {
                    ...edu,

                    degree: String(
                        edu.degree ||
                            edu.qualification ||
                            edu.course ||
                            edu.program ||
                            ""
                    ).trim(),

                    institution:
                        String(
                            edu.institution ||
                                edu.university ||
                                edu.college ||
                                edu.school ||
                                edu.institute ||
                                ""
                        ).trim(),

                    board: String(
                        edu.board ||
                            edu.university_board ||
                            ""
                    ).trim(),

                    location: String(
                        edu.location ||
                            ""
                    ).trim(),

                    year,
                    start_year,
                    end_year,

                    score: String(
                        edu.score?.value ||
                            edu.score ||
                            edu.percentage ||
                            edu.cgpa ||
                            edu.gpa ||
                            edu.grade ||
                            ""
                    ).trim(),

                    coursework:
                        Array.isArray(
                            edu.coursework
                        )
                            ? edu.coursework
                                  .map(String)
                                  .map(
                                      (
                                          value
                                      ) =>
                                          value.trim()
                                  )
                                  .filter(
                                      Boolean
                                  )
                            : typeof edu.coursework ===
                                    "string" &&
                                edu.coursework.trim()
                            ? edu.coursework
                                  .split(",")
                                  .map(
                                      (
                                          value
                                      ) =>
                                          value.trim()
                                  )
                                  .filter(
                                      Boolean
                                  )
                            : [],

                    additional_details:
                        String(
                            edu.additional_details ||
                                edu.details ||
                                ""
                        ).trim(),
                };
            })
            .filter(
                (item) =>
                    item.degree ||
                    item.institution ||
                    item.board ||
                    item.additional_details
            );

    // ---------------------------------------------------------
    // Experience
    // ---------------------------------------------------------

    const rawExp =
        Array.isArray(
            safeObj.experience
        )
            ? safeObj.experience
            : [];

    const experience =
        rawExp
            .map((item) => {
                const exp =
                    typeof item ===
                        "object" &&
                    item !== null &&
                    !Array.isArray(item)
                        ? item
                        : {};

                const role =
                    String(
                        exp.role ||
                            exp.title ||
                            exp.position ||
                            exp.designation ||
                            exp.job_title ||
                            ""
                    ).trim();

                const company =
                    String(
                        exp.company ||
                            exp.organization ||
                            exp.employer ||
                            exp.client ||
                            exp.hospital ||
                            exp.school ||
                            ""
                    ).trim();

                const description =
                    String(
                        exp.description ||
                            ""
                    ).trim();

                const employment_type =
                    String(
                        exp.employment_type ||
                            exp.type ||
                            ""
                    ).trim();

                const start_date =
                    String(
                        exp.start_date ||
                            ""
                    ).trim();

                const end_date =
                    String(
                        exp.end_date ||
                            ""
                    ).trim();

                let duration =
                    String(
                        exp.duration ||
                            exp.dates ||
                            exp.year ||
                            ""
                    ).trim();

                if (
                    !duration &&
                    (start_date ||
                        end_date)
                ) {
                    duration =
                        start_date &&
                        end_date
                            ? `${start_date} - ${end_date}`
                            : start_date ||
                              end_date;
                }

                const isInternship =
                    Boolean(
                        exp.is_internship ===
                            true ||
                            /intern(ship)?/i.test(
                                employment_type
                            ) ||
                            /intern(ship)?/i.test(
                                role
                            ) ||
                            /intern(ship)?/i.test(
                                description
                            ) ||
                            /trainee|training/i.test(
                                role
                            ) ||
                            /trainee/i.test(
                                employment_type
                            )
                    );

                return {
                    ...exp,

                    role,
                    company,

                    location: String(
                        exp.location ||
                            ""
                    ).trim(),

                    duration,
                    start_date,
                    end_date,
                    employment_type,

                    is_current:
                        Boolean(
                            exp.is_current ||
                                /present|current|ongoing/i.test(
                                    duration ||
                                        end_date ||
                                        ""
                                )
                        ),

                    is_internship:
                        isInternship,

                    description,

                    responsibilities:
                        String(
                            exp.responsibilities ||
                                ""
                        ).trim(),

                    highlights:
                        Array.isArray(
                            exp.highlights
                        )
                            ? exp.highlights
                                  .map(String)
                                  .map(
                                      (
                                          value
                                      ) =>
                                          value.trim()
                                  )
                                  .filter(
                                      Boolean
                                  )
                            : typeof exp.highlights ===
                                    "string" &&
                                exp.highlights.trim()
                            ? [
                                  exp.highlights.trim(),
                              ]
                            : [],

                    achievements:
                        String(
                            exp.achievements ||
                                ""
                        ).trim(),

                    technologies:
                        Array.isArray(
                            exp.technologies
                        )
                            ? exp.technologies
                                  .map(String)
                                  .map(
                                      (
                                          value
                                      ) =>
                                          value.trim()
                                  )
                                  .filter(
                                      Boolean
                                  )
                            : typeof exp.technologies ===
                                    "string" &&
                                exp.technologies.trim()
                            ? exp.technologies
                                  .split(",")
                                  .map(
                                      (
                                          value
                                      ) =>
                                          value.trim()
                                  )
                                  .filter(
                                      Boolean
                                  )
                            : [],
                };
            })
            .filter(
                (item) =>
                    item.role ||
                    item.company ||
                    item.description ||
                    item.responsibilities
            );

    // ---------------------------------------------------------
    // Validate location
    // ---------------------------------------------------------

    const validatedLocation =
        validatePersonalLocation(
            rawLocation,
            rawText,
            education,
            experience
        );

    const personal = {
        name,
        title,
        email,
        phone,
        location:
            validatedLocation,
        github,
        linkedin,
        portfolio_url,
        photo,
    };

    // ---------------------------------------------------------
    // Skills
    // ---------------------------------------------------------

    let flatSkills = [];

    const categorizedSkills = {
        professional: [],
        technical: [],
        frameworks: [],
        tools: [],
        soft: [],
        industry: [],
        languages: [],
        other: [],
        all: [],
    };

    if (
        Array.isArray(
            safeObj.skills
        )
    ) {
        flatSkills =
            safeObj.skills
                .map((skill) =>
                    typeof skill ===
                        "string"
                        ? skill.trim()
                        : (
                              skill?.name ||
                              String(
                                  skill
                              )
                          ).trim()
                )
                .filter(Boolean);

        categorizedSkills.professional =
            [...flatSkills];

        categorizedSkills.all =
            [...flatSkills];
    } else if (
        typeof safeObj.skills ===
            "object" &&
        safeObj.skills !== null &&
        !Array.isArray(
            safeObj.skills
        )
    ) {
        const rawSkills =
            safeObj.skills;

        for (
            const [
                key,
                value,
            ] of Object.entries(
                rawSkills
            )
        ) {
            if (
                !Array.isArray(value)
            ) {
                continue;
            }

            const cleaned =
                value
                    .map((skill) =>
                        typeof skill ===
                            "string"
                            ? skill.trim()
                            : (
                                  skill?.name ||
                                  String(
                                      skill
                                  )
                              ).trim()
                    )
                    .filter(Boolean);

            if (
                Object.prototype.hasOwnProperty.call(
                    categorizedSkills,
                    key
                )
            ) {
                categorizedSkills[
                    key
                ] = cleaned;
            } else {
                categorizedSkills.other.push(
                    ...cleaned
                );
            }

            if (
                key !== "all"
            ) {
                flatSkills.push(
                    ...cleaned
                );
            }
        }

        flatSkills =
            Array.from(
                new Set(
                    flatSkills
                )
            );

        if (
            flatSkills.length ===
                0 &&
            Array.isArray(
                rawSkills.all
            )
        ) {
            flatSkills =
                rawSkills.all
                    .map(
                        (
                            skill
                        ) =>
                            typeof skill ===
                                "string"
                                ? skill.trim()
                                : (
                                      skill?.name ||
                                      String(
                                          skill
                                      )
                                  ).trim()
                    )
                    .filter(Boolean);
        }

        categorizedSkills.all =
            flatSkills;
    }

    // ---------------------------------------------------------
    // Projects
    // ---------------------------------------------------------

    const rawProjects =
        Array.isArray(
            safeObj.projects
        )
            ? safeObj.projects
            : [];

    const projects =
        rawProjects
            .map((item) => {
                const proj =
                    typeof item ===
                        "object" &&
                    item !== null &&
                    !Array.isArray(item)
                        ? item
                        : {};

                const title =
                    String(
                        proj.title ||
                            proj.name ||
                            proj.project_name ||
                            ""
                    ).trim();

                const start_date =
                    String(
                        proj.start_date ||
                            ""
                    ).trim();

                const end_date =
                    String(
                        proj.end_date ||
                            ""
                    ).trim();

                let duration =
                    String(
                        proj.duration ||
                            ""
                    ).trim();

                if (
                    !duration &&
                    (start_date ||
                        end_date)
                ) {
                    duration =
                        start_date &&
                        end_date
                            ? `${start_date} - ${end_date}`
                            : start_date ||
                              end_date;
                }

                const rawTech =
                    proj.technologies ||
                    proj.tools ||
                    proj.tech_stack ||
                    [];

                const technologies =
                    Array.isArray(
                        rawTech
                    )
                        ? rawTech
                              .map(String)
                              .map(
                                  (
                                      value
                                  ) =>
                                      value.trim()
                              )
                              .filter(
                                  Boolean
                              )
                        : typeof rawTech ===
                                "string" &&
                            rawTech.trim()
                        ? rawTech
                              .split(",")
                              .map(
                                  (
                                      value
                                  ) =>
                                      value.trim()
                              )
                              .filter(
                                  Boolean
                              )
                        : [];

                return {
                    ...proj,

                    title,

                    subtitle:
                        String(
                            proj.subtitle ||
                                ""
                        ).trim(),

                    role: String(
                        proj.role ||
                            ""
                    ).trim(),

                    organization:
                        String(
                            proj.organization ||
                                proj.client ||
                                proj.company ||
                                ""
                        ).trim(),

                    start_date,
                    end_date,
                    duration,

                    description:
                        String(
                            proj.description ||
                                ""
                        ).trim(),

                    responsibilities:
                        String(
                            proj.responsibilities ||
                                ""
                        ).trim(),

                    outcomes:
                        String(
                            proj.outcomes ||
                                proj.achievements ||
                                ""
                        ).trim(),

                    technologies,

                    link: String(
                        proj.link ||
                            proj.url ||
                            ""
                    ).trim(),

                    github: String(
                        proj.github ||
                            proj.github_url ||
                            proj.repo ||
                            ""
                    ).trim(),
                };
            })
            .filter(
                (item) =>
                    item.title ||
                    item.description ||
                    item.responsibilities
            );

    // ---------------------------------------------------------
    // Certificates
    // ---------------------------------------------------------

    const rawCerts =
        Array.isArray(
            safeObj.certificates
        )
            ? safeObj.certificates
            : Array.isArray(
                  safeObj.certifications
              )
            ? safeObj.certifications
            : [];

    const certificates =
        rawCerts
            .map((item) => {
                const cert =
                    typeof item ===
                        "object" &&
                    item !== null &&
                    !Array.isArray(item)
                        ? item
                        : {};

                return {
                    ...cert,

                    name: String(
                        cert.name ||
                            cert.title ||
                            cert.certification ||
                            cert.certification_name ||
                            cert.credential_name ||
                            cert.course ||
                            ""
                    ).trim(),

                    issuer: String(
                        cert.issuer ||
                            cert.organization ||
                            cert.issuing_organization ||
                            cert.authority ||
                            cert.institute ||
                            ""
                    ).trim(),

                    year: String(
                        cert.year ||
                            cert.date ||
                            cert.issue_date ||
                            ""
                    ).trim(),

                    link: String(
                        cert.link ||
                            cert.url ||
                            cert.credential_id ||
                            ""
                    ).trim(),
                };
            })
            .filter(
                (item) =>
                    item.name
            );

    // ---------------------------------------------------------
    // Achievements
    // ---------------------------------------------------------

    const rawAchievements =
        Array.isArray(
            safeObj.achievements
        )
            ? safeObj.achievements
            : [];

    const achievements =
        rawAchievements
            .map((item) => {
                if (
                    typeof item ===
                    "string"
                ) {
                    return {
                        title:
                            item.trim(),
                        description:
                            "",
                    };
                }

                if (
                    typeof item ===
                        "object" &&
                    item !== null &&
                    !Array.isArray(item)
                ) {
                    return {
                        ...item,

                        title: String(
                            item.title ||
                                item.name ||
                                item.award ||
                                item.award_name ||
                                ""
                        ).trim(),

                        description:
                            String(
                                item.description ||
                                    ""
                            ).trim(),

                        date: String(
                            item.date ||
                                item.year ||
                                ""
                        ).trim(),

                        organization:
                            String(
                                item.organization ||
                                    item.issuer ||
                                    ""
                            ).trim(),
                    };
                }

                return {
                    title: String(
                        item
                    ).trim(),

                    description:
                        "",
                };
            })
            .filter(
                (item) =>
                    item.title ||
                    item.description
            );

    // ---------------------------------------------------------
    // Languages
    // ---------------------------------------------------------

    const rawLanguages =
        Array.isArray(
            safeObj.languages
        )
            ? safeObj.languages
            : [];

    const languages =
        rawLanguages
            .map((item) => {
                if (
                    typeof item ===
                    "string"
                ) {
                    const name =
                        item.trim();

                    return {
                        name,

                        level:
                            "Proficient",

                        language:
                            name,

                        proficiency:
                            "Proficient",
                    };
                }

                if (
                    typeof item ===
                        "object" &&
                    item !== null &&
                    !Array.isArray(item)
                ) {
                    const name =
                        String(
                            item.name ||
                                item.language ||
                                ""
                        ).trim();

                    const level =
                        String(
                            item.level ||
                                item.proficiency ||
                                "Proficient"
                        ).trim();

                    return {
                        ...item,

                        name,
                        level,

                        language:
                            name,

                        proficiency:
                            level,
                    };
                }

                const name =
                    String(
                        item
                    ).trim();

                return {
                    name,

                    level:
                        "Proficient",

                    language:
                        name,

                    proficiency:
                        "Proficient",
                };
            })
            .filter(
                (item) =>
                    item.name
            );

    // ---------------------------------------------------------
    // Custom sections
    // ---------------------------------------------------------

    const rawCustom =
        Array.isArray(
            safeObj.custom_sections
        )
            ? safeObj.custom_sections
            : [];

    const custom_sections =
        rawCustom
            .map((section) => {
                const sectionObj =
                    typeof section ===
                        "object" &&
                    section !== null &&
                    !Array.isArray(
                        section
                    )
                        ? section
                        : {};

                const heading =
                    String(
                        sectionObj.heading ||
                            sectionObj.title ||
                            "Additional Section"
                    ).trim();

                const rawItems =
                    Array.isArray(
                        sectionObj.items
                    )
                        ? sectionObj.items
                        : typeof sectionObj.items ===
                                "string" &&
                            sectionObj.items.trim()
                        ? [
                              sectionObj.items,
                          ]
                        : sectionObj.content
                        ? [
                              sectionObj.content,
                          ]
                        : [];

                return {
                    ...sectionObj,

                    heading,

                    items:
                        rawItems.map(
                            (
                                item
                            ) => {
                                if (
                                    typeof item ===
                                        "object" &&
                                    item !==
                                        null &&
                                    !Array.isArray(
                                        item
                                    )
                                ) {
                                    return {
                                        ...item,

                                        title: String(
                                            item.title ||
                                                item.name ||
                                                ""
                                        ).trim(),

                                        subtitle:
                                            String(
                                                item.subtitle ||
                                                    item.role ||
                                                    ""
                                            ).trim(),

                                        date: String(
                                            item.date ||
                                                item.year ||
                                                ""
                                        ).trim(),

                                        description:
                                            String(
                                                item.description ||
                                                    item.text ||
                                                    item.content ||
                                                    ""
                                            ).trim(),
                                    };
                                }

                                return {
                                    title:
                                        "",

                                    subtitle:
                                        "",

                                    date:
                                        "",

                                    description:
                                        String(
                                            item ||
                                                ""
                                        ).trim(),
                                };
                            }
                        ),
                };
            })
            .filter(
                (section) =>
                    section.heading &&
                    section.items.length >
                        0
            );

    // ---------------------------------------------------------
    // FINAL CANONICAL OBJECT
    // ---------------------------------------------------------

    // IMPORTANT:
    // last_updated belongs to the APPLICATION, not Gemini.
    // Always create a fresh system timestamp.
    const systemTimestamp =
        new Date().toISOString();

    return {
        metadata: {
            version: "1.0",

            source:
                safeObj.metadata?.source ||
                "upload",

            user_category:
                safeObj.metadata?.user_category ||
                "Student",

            career_target:
                String(
                    safeObj.metadata?.career_target ||
                        ""
                ).trim(),

            title:
                personal.title,

            location:
                personal.location,

            portfolio_url:
                personal.portfolio_url,

            photo_path:
                personal.photo,

            last_updated:
                systemTimestamp,
        },

        personal,

        summary,
        about,

        education,
        experience,

        skills: {
            ...categorizedSkills,

            all:
                categorizedSkills.all ||
                flatSkills ||
                [],
        },

        categorized_skills:
            categorizedSkills,

        flat_skills:
            flatSkills,

        projects,
        certificates,
        achievements,
        languages,
        custom_sections,
    };
}

// =========================================================
// 7. GEMINI AI PARSER
// =========================================================

async function parseWithAI(
    resumeText
) {
    const apiKey =
        process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured in environment variables."
        );
    }

    if (
        !resumeText ||
        typeof resumeText !==
            "string" ||
        !resumeText.trim()
    ) {
        throw new Error(
            "[AI Parser] Resume text is empty."
        );
    }

    const modelName =
        process.env.GEMINI_MODEL ||
        "gemini-3.6-flash";

    const ai =
        new GoogleGenAI({
            apiKey,
        });

    console.log(
        `[AI Parser] Resume text length: ${resumeText.length} characters.`
    );

    const prompt = `
Extract information ONLY from the resume text between BEGIN RESUME TEXT and END RESUME TEXT.

Return ONLY JSON matching the provided response schema.

Do not add explanations.
Do not add reasoning.
Do not invent missing information.

IMPORTANT:

personal.title must contain only an explicitly written professional title/headline.

If the resume has no explicit professional title/headline,
personal.title MUST be an empty string.

Do not infer personal.title from employment roles, projects, skills, education, certifications, or profession.

Every meaningful factual item must either be placed into the appropriate canonical field or preserved in custom_sections.

For skills, classify according to semantic meaning rather than simply placing every technology into frameworks.

The "all" skills array must contain every extracted skill exactly once.

metadata.last_updated should be an empty string unless the resume itself explicitly contains an update date.

Do not use graduation dates, employment dates, certificate dates, or other resume dates as metadata.last_updated.

The application will generate the actual system timestamp.

BEGIN RESUME TEXT

${resumeText}

END RESUME TEXT
`;

    console.log(
        `[AI Parser] Sending text to Gemini model (${modelName}) with responseSchema...`
    );

    let response;
    let lastError;

    const maxRetries = 3;

    for (
        let attempt = 1;
        attempt <= maxRetries;
        attempt++
    ) {
        try {
            response =
                await ai.models.generateContent(
                    {
                        model:
                            modelName,

                        contents:
                            prompt,

                        config: {
                            systemInstruction:
                                AI_PARSER_SYSTEM_PROMPT,

                            responseMimeType:
                                "application/json",

                            responseSchema:
                                RESUME_RESPONSE_SCHEMA,

                            thinkingConfig: {
                                thinkingBudget: 0,
                            },
                        },
                    }
                );

            if (
                response &&
                response.text
            ) {
                break;
            }
        } catch (err) {
            lastError = err;

            console.warn(
                `[AI Parser] Attempt ${attempt} failed: ${err.message}`
            );

            const isTransient =
                err.status === 503 ||
                err.status === 429 ||
                err.message?.includes(
                    "503"
                ) ||
                err.message?.includes(
                    "429"
                ) ||
                err.message?.includes(
                    "high demand"
                ) ||
                err.message?.includes(
                    "UNAVAILABLE"
                );

            if (
                attempt <
                    maxRetries &&
                isTransient
            ) {
                const delay =
                    attempt *
                    2000;

                console.log(
                    `[AI Parser] Retrying in ${delay}ms...`
                );

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            delay
                        )
                );
            } else {
                throw err;
            }
        }
    }

    const responseText =
        response?.text;

    if (!responseText) {
        throw new Error(
            "Empty response received from Gemini model." +
                (lastError
                    ? ` Last error: ${lastError.message}`
                    : "")
        );
    }

    const cleanedJson =
        responseText
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /```\s*$/i,
                ""
            )
            .trim();

    let rawParsed;

    try {
        rawParsed =
            JSON.parse(
                cleanedJson
            );
    } catch (error) {
        throw new Error(
            `[AI Parser] Gemini returned invalid JSON: ${error.message}`
        );
    }

    console.log(
        "========== GEMINI RAW OUTPUT =========="
    );

    console.log(
        JSON.stringify(
            rawParsed,
            null,
            2
        )
    );

    // ---------------------------------------------------------
    // Validate before normalization
    // ---------------------------------------------------------

    validateAIResult(
        rawParsed,
        resumeText
    );

    console.log(
        "[AI Parser] Gemini response passed structural and completeness validation."
    );

    // ---------------------------------------------------------
    // Normalize
    // ---------------------------------------------------------

    const normalized =
        normalizeResumeData(
            rawParsed,
            resumeText
        );

    // ---------------------------------------------------------
    // Final normalized validation
    // ---------------------------------------------------------

    if (
        !normalized.personal
            .name &&
        rawParsed.personal?.name
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed the candidate name."
        );
    }

    if (
        hasEmailEvidence(
            resumeText
        ) &&
        !normalized.personal
            .email
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed the candidate email."
        );
    }

    if (
        hasPhoneEvidence(
            resumeText
        ) &&
        !normalized.personal
            .phone
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed the candidate phone number."
        );
    }

    // ---------------------------------------------------------
    // Verify that extracted information was not accidentally
    // discarded during normalization.
    // ---------------------------------------------------------

    if (
        Array.isArray(
            rawParsed.skills?.all
        ) &&
        rawParsed.skills.all.length >
            0 &&
        normalized.skills.all
            .length === 0
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed all extracted skills."
        );
    }

    if (
        Array.isArray(
            rawParsed.education
        ) &&
        rawParsed.education.length >
            0 &&
        normalized.education
            .length === 0
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed education information."
        );
    }

    if (
        Array.isArray(
            rawParsed.experience
        ) &&
        rawParsed.experience.length >
            0 &&
        normalized.experience
            .length === 0
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed experience information."
        );
    }

    if (
        Array.isArray(
            rawParsed.projects
        ) &&
        rawParsed.projects.length >
            0 &&
        normalized.projects
            .length === 0
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed project information."
        );
    }

    if (
        Array.isArray(
            rawParsed.certificates
        ) &&
        rawParsed.certificates.length >
            0 &&
        normalized.certificates
            .length === 0
    ) {
        throw new Error(
            "[AI Parser] Normalization unexpectedly removed certificate information."
        );
    }

    console.log(
        "========== NORMALIZED OUTPUT =========="
    );

    console.log(
        JSON.stringify(
            normalized,
            null,
            2
        )
    );

    console.log(
        "[AI Parser] Successfully parsed and normalized resume with AI."
    );

    return normalized;
}

// =========================================================
// 8. EXPORTS
// =========================================================

module.exports = {
    parseWithAI,
    normalizeResumeData,
    RESUME_RESPONSE_SCHEMA,
    validatePersonalLocation,
    validateAIResult,
};