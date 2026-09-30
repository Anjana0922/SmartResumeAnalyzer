/**
 * ATS-Friendly Resume Analyzer Service (Refactored & Calibrated)
 *
 * 100% Pure JavaScript Heuristic Scoring Engine
 * Zero external AI dependencies, zero network requests.
 * Evaluates resumes across 7 transparent ATS categories (0-100 scale).
 *
 * Fundamental Principles:
 * 1. Profession-independent: no software-developer keyword bias.
 * 2. Section-flexible: missing optional sections (e.g. Experience for a fresher) do NOT reduce the score.
 * 3. Zero hallucination: does not invent sections or candidate details.
 * 4. Custom section preservation: unrecognized/unique sections are preserved, never dropped.
 * 5. Glyph sanitization: normalizes bullet dingbats and PUA characters (\uF0B7, \uF0A7, \u25A0, etc.)
 */

// ==========================================================
// 1. Dingbat & Character Normalization Helpers
// ==========================================================

function normalizeGlyphs(text) {
    if (!text || typeof text !== "string") return "";

    return text
        // Replace Private Use Area and common dingbat bullets with standard bullet '•'
        .replace(/[\uF0B7\uF0A7\uF076\uF0D8\uF0A8\u25A0\u25A1\u25AA\u25AB\u25CF\u25CB\u25C6\u25C7\u25BA\u25B6\u25E6\u2023\u2043\u2219]/g, "•")
        // Remove corrupted unicode replacement character and control characters (except newline, tab)
        .replace(/\uFFFD/g, "")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
        // Normalize CRLF to LF
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");
}

function stripBullet(line) {
    if (!line) return "";
    return line.replace(/^[\s•\*\-\–\—\·\⁃\►\▸\▪\▫\u2022\uF0B7\uF0A7\u25A0\u25AA]+\s*/, "").trim();
}

function isBulletLine(line) {
    if (!line) return false;
    return /^[\s•\*\-\–\—\·\⁃\►\▸\▪\▫\u2022\uF0B7\uF0A7\u25A0\u25AA]\s+/.test(line);
}

// ==========================================================
// 2. Candidate Name & Identity Block Extraction
// ==========================================================

const RESUME_STOP_WORDS = new Set([
    "resume", "curriculum", "vitae", "cv", "page", "profile", "summary",
    "education", "skills", "experience", "projects", "contact", "email",
    "phone", "address", "objective", "certifications", "about", "portfolio",
    "languages", "language", "english", "malayalam", "hindi", "tamil", "telugu",
    "spanish", "french", "german", "working", "intermediate", "limited",
    "native", "bilingual", "fluent", "proficient", "competencies", "expertise"
]);

const LOCATION_KEYWORDS = [
    "india", "usa", "united states", "canada", "uk", "united kingdom", "australia",
    "germany", "france", "kerala", "thrissur", "kottayam", "ernakulam", "bangalore",
    "bengaluru", "hyderabad", "mumbai", "delhi", "chennai", "pune", "austin", "texas",
    "california", "new york", "london", "street", "road", "ave", "avenue", "lane",
    "pin", "zip", "nagar", "district", "post", "palakkad"
];

function extractCandidateName(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const searchDepth = Math.min(35, lines.length);
    let bestCandidate = "";
    let bestScore = 0;
    let currentSection = "";

    for (let i = 0; i < searchDepth; i++) {
        const line = lines[i];

        const heading = detectSectionHeading(line);
        if (heading) {
            currentSection = heading.key;
            continue;
        }

        // Candidate names do not appear inside languages, skills, or certifications
        if (currentSection === "languages" || currentSection === "skills" || currentSection === "certifications") {
            continue;
        }

        if (/@/.test(line) || /https?:\/\//i.test(line) || /linkedin\.com/i.test(line) || /github\.com/i.test(line)) continue;
        if (/\+?\d{2,}/.test(line)) continue;
        if (/\b(?:19|20)\d{2}\b/.test(line)) continue;
        if (isBulletLine(line)) continue;

        const lower = line.toLowerCase();
        const words = lower.split(/\s+/).filter(Boolean);
        if (words.some(w => RESUME_STOP_WORDS.has(w))) continue;

        const isLocationLine = LOCATION_KEYWORDS.some(k => lower.includes(k));
        if (isLocationLine && words.length <= 4) continue;

        // Strip non-alpha characters except dot/apostrophe/hyphen
        let clean = line.replace(/[^a-zA-Z\s.'-]/g, " ").replace(/\s+/g, " ").trim();
        // If next line is a single-letter initial (e.g. "M"), combine
        if (i + 1 < lines.length && /^[A-Z]$/.test(lines[i + 1].trim())) {
            clean = clean + " " + lines[i + 1].trim();
        }

        const cleanWords = clean.split(/\s+/).filter(Boolean);

        // Reject noise tokens like single word <= 3 chars ("ree", "fa", "q")
        if (cleanWords.length === 1 && cleanWords[0].length <= 3) continue;
        if (cleanWords.length < 1 || cleanWords.length > 5 || clean.length < 3 || clean.length > 45) continue;

        let score = 0;
        const allCapitalized = cleanWords.every(w => /^[A-Z]/.test(w) || w.length === 1);
        if (allCapitalized) score += 5;
        if (cleanWords.length >= 2 && cleanWords.length <= 4) score += 6;
        if (i < 4) score += 3;
        if (i < 8) score += 1;

        if (score > bestScore) {
            bestScore = score;
            bestCandidate = clean;
            if (score >= 10) break;
        }
    }

    return bestCandidate;
}

function extractContactCoordinates(text, candidateName = "") {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const topLines = lines.slice(0, 10);

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";

    const phoneMatch = text.match(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/);
    let phone = phoneMatch ? phoneMatch[0].trim() : "";
    if (phone.length < 7 || phone.length > 22) phone = "";

    const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const linkedin = linkedInMatch ? (linkedInMatch[0].startsWith("http") ? linkedInMatch[0] : "https://" + linkedInMatch[0]) : "";

    const gitHubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const github = gitHubMatch ? (gitHubMatch[0].startsWith("http") ? gitHubMatch[0] : "https://" + gitHubMatch[0]) : "";

    let location = "";
    for (const line of topLines) {
        if (line === candidateName) continue;
        if (line.includes("@") || line.includes("linkedin") || line.includes("github")) {
            const parts = line.split(/[|•·]/).map(p => p.trim());
            for (const part of parts) {
                if (part.includes("@") || part.includes("http") || /\d{5,}/.test(part)) continue;
                if (LOCATION_KEYWORDS.some(k => part.toLowerCase().includes(k)) || /^[A-Z][a-zA-Z\s.-]+,\s*[A-Z][a-zA-Z\s.-]+/.test(part)) {
                    location = part;
                    break;
                }
            }
            if (location) break;
            continue;
        }

        const lower = line.toLowerCase();
        const hasLocKey = LOCATION_KEYWORDS.some(k => lower.includes(k));
        const isCityState = /^[A-Z][a-zA-Z\s.-]+,\s*[A-Z][a-zA-Z\s.-]+/i.test(line);

        if ((hasLocKey || isCityState) && !lower.includes("university") && !lower.includes("college") && !lower.includes("school")) {
            location = line;
            break;
        }
    }

    if (location && candidateName) {
        const regex = new RegExp(`^${candidateName.replace(/[^a-zA-Z0-9]/g, "\\$&")}\\s*`, "i");
        location = location.replace(regex, "").trim();
        location = location.replace(/^[|,\s-]+/, "").trim();
    }

    return { email, phone, location, linkedin, github };
}

// ==========================================================
// 3. Flexible Section Heading Recognition
// ==========================================================

const KNOWN_HEADING_PATTERNS = [
    {
        key: "summary",
        label: "Professional Summary",
        pattern: /^(?:professional\s+summary|summary|profile\s+summary|profile|about\s+me|career\s+objective|objective|executive\s+summary|overview)$/i
    },
    {
        key: "contact",
        label: "Contact Information",
        pattern: /^(?:contact\s+info(?:rmation)?|contact\s+details|contact)$/i
    },
    {
        key: "experience",
        label: "Work Experience",
        pattern: /^(?:(?:work|professional|career|employment)?\s*experience(?:\s*(?:&|and)\s*(?:work\s+history|employment|history))?|work\s+history|employment\s+history|career\s+history|employment)$/i
    },
    {
        key: "education",
        label: "Education",
        pattern: /^(?:medical\s+education(?:\s*(?:&|and)?\s*training)?|education|educational\s+qualifications|academic\s+background|academic\s+qualifications|academics|qualifications)$/i
    },
    {
        key: "skills",
        label: "Skills & Competencies",
        pattern: /^(?:technical\s+skills|skills(?:\s*(?:&|and)?\s*(?:competencies|expertise|proficiencies))?|skills|core\s+competencies|technologies|areas\s+of\s+expertise|key\s+skills|frameworks\s*(?:&|and)?\s*libraries|frameworks|libraries|tools\s*(?:&|and)?\s*systems|tools|platforms)$/i
    },
    {
        key: "projects",
        label: "Projects",
        pattern: /^(?:projects(?:\s*(?:&|and)?\s*(?:professional\s+work|work))?|personal\s+projects|academic\s+projects|key\s+projects|technical\s+projects)$/i
    },
    {
        key: "certifications",
        label: "Certifications & Honors",
        pattern: /^(?:medical\s+licenses(?:\s*(?:&|and)?\s*board\s+certifications)?|certifications(?:\s*(?:&|and)?\s*(?:credentials|honors|awards|licenses|training))?|certificates(?:\s*(?:&|and)?\s*(?:credentials|honors|awards|licenses|training))?|licenses|credentials)$/i
    },
    {
        key: "achievements",
        label: "Achievements & Awards",
        pattern: /^(?:achievements(?:\s*(?:&|and)?\s*(?:awards|honors))?|honors(?:\s*(?:&|and)?\s*(?:awards|achievements))?|awards(?:\s*(?:&|and)?\s*(?:achievements|honors))?|awards|accomplishments|honors)$/i
    },
    {
        key: "languages",
        label: "Languages",
        pattern: /^(?:languages|language\s+proficiency|languages\s+known)$/i
    },
    {
        key: "custom_internship",
        label: "Internship & Training",
        pattern: /^(?:internship(?:\/training)?(?:\s*(?:&|and)?\s*certifications)?|internships|training|industrial\s+training)$/i
    },
    {
        key: "custom_publications",
        label: "Publications & Research",
        pattern: /^(?:publications|research|research\s*(?:&|and)?\s*publications|papers)$/i
    },
    {
        key: "custom_clinical",
        label: "Clinical Experience",
        pattern: /^(?:clinical\s+experience|medical\s+training|rotations|residency)$/i
    },
    {
        key: "custom_volunteer",
        label: "Volunteer & Community Work",
        pattern: /^(?:volunteer\s+work|volunteer\s+experience|community\s+service|social\s+activities)$/i
    },
    {
        key: "custom_memberships",
        label: "Memberships & Affiliations",
        pattern: /^(?:memberships|professional\s+memberships|affiliations|associations)$/i
    }
];

function detectSectionHeading(line, candidateName = "") {
    if (!line) return null;
    const clean = line.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();
    if (clean.length < 2 || clean.length > 60) return null;
    if (isBulletLine(line)) return null;

    // Check if line matches candidate's name
    if (candidateName) {
        const lineAlpha = clean.replace(/[^a-zA-Z]/g, "").toLowerCase();
        const nameAlpha = candidateName.replace(/[^a-zA-Z]/g, "").toLowerCase();
        if (lineAlpha === nameAlpha || (nameAlpha.length > 3 && lineAlpha.includes(nameAlpha))) {
            return null;
        }
    }

    // Strip isolated leading decorative icon glyph/dingbat (e.g. '® ', '< ', 'Q ', 'Fa ', 'R ')
    const strippedIcon = clean.replace(/^(?:[®<>=%5QR]|\bfa\b)\s+/i, "").trim();

    // Check against known patterns
    for (const item of KNOWN_HEADING_PATTERNS) {
        if (item.pattern.test(clean)) {
            return { key: item.key, label: item.label, originalText: clean, isKnown: true };
        }
        if (strippedIcon && item.pattern.test(strippedIcon)) {
            return { key: item.key, label: item.label, originalText: strippedIcon, isKnown: true };
        }
    }

    // Check if line is a generic uppercase or distinct heading (avoiding short acronyms like MCA, MAE, AWS)
    const isUpper = clean === clean.toUpperCase() && /[A-Z]/.test(clean);
    const words = clean.split(/\s+/);
    if (isUpper && words.length <= 6 && (words.length > 1 || clean.length >= 5) && !clean.includes("@") && !clean.includes(":") && !/\d/.test(clean)) {
        return {
            key: "custom_" + clean.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
            label: clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
            originalText: clean,
            isKnown: false
        };
    }

    return null;
}

// ==========================================================
// 4. Redesigned 100-Point Heuristic Scoring Engine
// ==========================================================

function scoreContactInfo(text, candidateName) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    if (candidateName && candidateName.length >= 2) {
        score += 4;
        details.push("Name clearly isolated");
        strengths.push("Candidate name is prominently placed at the top of the resume.");
    } else {
        problems.push("Candidate name is not clearly isolated in the document header.");
    }

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
        score += 4;
        details.push("Email detected: " + emailMatch[0]);
        strengths.push("Professional email address is clearly readable.");
    } else {
        problems.push("No valid email address found in the resume header.");
    }

    const phoneMatch = text.match(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/);
    if (phoneMatch && phoneMatch[0].trim().length >= 7) {
        score += 3;
        details.push("Phone detected: " + phoneMatch[0].trim());
        strengths.push("Phone number is clearly formatted for automated dialers.");
    } else {
        problems.push("No telephone number detected in the header.");
    }

    const { location } = extractContactCoordinates(text, candidateName);
    if (location && location.length >= 3) {
        score += 2;
        details.push("Location: " + location);
        strengths.push("Geographic location/city is clearly stated.");
    } else {
        problems.push("Location/city not clearly identified in contact block.");
    }

    const first5Lines = text.split("\n").slice(0, 6).join(" ");
    const nameOccurrences = candidateName ? (first5Lines.match(new RegExp(candidateName.replace(/[^a-zA-Z0-9]/g, "\\$&"), "gi")) || []).length : 1;
    if (nameOccurrences <= 1) {
        score += 2;
        details.push("Clean contact block without repetition");
    } else {
        problems.push("Candidate name or contact text appears duplicated in the header block.");
    }

    return {
        score: Math.min(15, score),
        max: 15,
        details: details.join("; "),
        strengths,
        problems
    };
}

function scoreMachineReadability(rawText) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    const totalChars = rawText.length;
    const alphaNumChars = (rawText.match(/[a-zA-Z0-9\s]/g) || []).length;
    const ratio = totalChars > 0 ? alphaNumChars / totalChars : 0;

    if (ratio >= 0.88) {
        score += 6;
        strengths.push("High clean text density (" + Math.round(ratio * 100) + "% clean alphanumeric text).");
        details.push("Clean text ratio: " + Math.round(ratio * 100) + "%");
    } else if (ratio >= 0.75) {
        score += 4;
        details.push("Acceptable text ratio");
    } else {
        score += 2;
        problems.push("High proportion of non-standard symbols or encoding noise detected.");
    }

    const corruptedGlyphs = (rawText.match(/[\uFFFD\uF0B7\uF0A7\uF076\u25A0\u25AA]/g) || []).length;
    if (corruptedGlyphs === 0) {
        score += 4;
        strengths.push("Zero corrupted glyphs or unmapped font symbols detected.");
        details.push("No corrupted glyphs");
    } else if (corruptedGlyphs <= 5) {
        score += 2;
        problems.push("Detected " + corruptedGlyphs + " font dingbats/symbols that may render as square boxes in some parsers.");
    } else {
        problems.push("Multiple (" + corruptedGlyphs + ") unmapped font symbols detected. These render as strange boxes in ATS parsers.");
    }

    const words = rawText.split(/\s+/).filter(Boolean);
    const avgWordLen = words.length > 0 ? rawText.replace(/\s+/g, "").length / words.length : 0;
    if (avgWordLen >= 3.5 && avgWordLen <= 8.5) {
        score += 3;
        details.push("Natural word boundaries");
    } else {
        score += 1;
        problems.push("Unusual word length distribution detected (possible text concatenation or OCR spacing issues).");
    }

    if (words.length >= 80) {
        score += 2;
        details.push(words.length + " words indexed");
    } else {
        problems.push("Document text is very brief (" + words.length + " words).");
    }

    return {
        score: Math.min(15, score),
        max: 15,
        details: details.join("; "),
        strengths,
        problems
    };
}

function scoreLayoutSafety(text) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    const lines = text.split("\n");
    const excessiveTabs = lines.filter(l => (l.match(/\t/g) || []).length >= 3).length;
    const excessivePipes = lines.filter(l => (l.match(/\|/g) || []).length >= 4).length;

    if (excessiveTabs === 0 && excessivePipes <= 2) {
        score += 7;
        strengths.push("Clean single-column reading order without complex table structures.");
        details.push("Single-column flow");
    } else if (excessiveTabs <= 3 && excessivePipes <= 5) {
        score += 4;
        details.push("Minor table/column artifacts");
    } else {
        score += 2;
        problems.push("Potential multi-column or table formatting detected. ATS systems read tables horizontally across cells.");
    }

    const decorativeCount = (text.match(/[\u25C6\u25C7\u25BA\u25B6\u27A4\u27A2\u2605\u2714\u2713]/g) || []).length;
    if (decorativeCount === 0) {
        score += 5;
        strengths.push("No decorative icons, stars, or arrows that confuse automated parsers.");
        details.push("No decorative icons");
    } else {
        score += 2;
        problems.push("Decorative symbols detected (" + decorativeCount + "). Keep bullet points simple and standard.");
    }

    const longParagraphs = lines.filter(l => l.trim().length > 350);
    if (longParagraphs.length === 0) {
        score += 4;
        strengths.push("Information is concise and easily readable; no dense walls of text.");
        details.push("Concise paragraphs");
    } else {
        score += 2;
        problems.push("Contains " + longParagraphs.length + " dense paragraph(s) (>350 chars). Break these into concise bullet points.");
    }

    const emptyLines = lines.filter(l => l.trim() === "").length;
    if (emptyLines >= 4 && emptyLines <= 50) {
        score += 4;
        details.push("Clean vertical spacing");
    } else {
        score += 2;
    }

    return {
        score: Math.min(20, score),
        max: 20,
        details: details.join("; "),
        strengths,
        problems
    };
}

function scoreSectionClarity(sectionsFound) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    const totalSections = sectionsFound.length;

    if (totalSections >= 3) {
        score += 5;
        strengths.push("Document contains " + totalSections + " clearly delineated sections.");
        details.push(totalSections + " sections found");
    } else if (totalSections >= 2) {
        score += 3;
        details.push(totalSections + " sections found");
    } else {
        score += 1;
        problems.push("Few distinct sections detected. Clearly label your resume sections with distinct headings.");
    }

    const standardHeadings = sectionsFound.filter(s => s.isKnown);
    const standardRatio = totalSections > 0 ? standardHeadings.length / totalSections : 0;

    if (standardRatio >= 0.7) {
        score += 5;
        strengths.push("Section headings use standard, widely recognized titles (" + standardHeadings.map(s => s.label).slice(0, 4).join(", ") + ").");
        details.push("Standard heading conventions used");
    } else {
        score += 3;
        details.push("Some non-standard section titles");
    }

    const emptySections = sectionsFound.filter(s => !s.content || s.content.trim().length === 0);
    if (emptySections.length === 0 && totalSections >= 2) {
        score += 5;
        strengths.push("All detected sections contain well-defined content blocks.");
        details.push("Clean section segmentation");
    } else {
        score += 2;
        problems.push("Some section headings appear to have empty or poorly segmented content.");
    }

    return {
        score: Math.min(15, score),
        max: 15,
        details: details.join("; "),
        strengths,
        problems
    };
}

function scoreReadabilityAndStructure(text) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    const lines = text.split("\n");
    const bulletLines = lines.filter(l => isBulletLine(l));

    if (bulletLines.length >= 4) {
        score += 5;
        strengths.push("Consistent use of bullet points (" + bulletLines.length + " bullets detected) for clear scanning.");
        details.push(bulletLines.length + " bullets detected");
    } else if (bulletLines.length >= 1) {
        score += 3;
        details.push(bulletLines.length + " bullets detected");
    } else {
        score += 2;
        problems.push("Few or no bullet points detected. ATS screeners prefer bulleted lists for role descriptions and skills.");
    }

    if (bulletLines.length > 0) {
        const bulletWordCounts = bulletLines.map(b => stripBullet(b).split(/\s+/).length);
        const avgBulletWords = bulletWordCounts.reduce((a, b) => a + b, 0) / bulletWordCounts.length;

        if (avgBulletWords >= 6 && avgBulletWords <= 45) {
            score += 5;
            strengths.push("Bullet points have ideal concise length (average " + Math.round(avgBulletWords) + " words per bullet).");
            details.push("Ideal bullet length");
        } else if (avgBulletWords < 6) {
            score += 3;
            problems.push("Bullet points are very short/fragmented (average " + Math.round(avgBulletWords) + " words). Add more detail to your points.");
        } else {
            score += 3;
            problems.push("Bullet points are long and wordy (average " + Math.round(avgBulletWords) + " words). Keep bullets under 40 words.");
        }
    } else {
        score += 2;
    }

    const uppercaseLines = lines.filter(l => {
        const t = l.trim();
        return t.length >= 3 && t.length <= 40 && t === t.toUpperCase() && /[A-Z]/.test(t) && !isBulletLine(t);
    });

    if (uppercaseLines.length >= 2) {
        score += 5;
        strengths.push("Clear typographic hierarchy with uppercase headings distinguishing sections.");
        details.push("Clear heading hierarchy");
    } else {
        score += 3;
    }

    return {
        score: Math.min(15, score),
        max: 15,
        details: details.join("; "),
        strengths,
        problems
    };
}

function scoreConsistency(text, sectionsFound) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    const dateMatches = text.match(/\b(?:(?:19|20)\d{2}\s*(?:–|-|to)\s*(?:(?:19|20)\d{2}|present|current)|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/gi) || [];
    if (dateMatches.length >= 2) {
        score += 4;
        strengths.push("Dates follow a consistent chronological format throughout the document.");
        details.push("Consistent dates (" + dateMatches.length + " found)");
    } else if (dateMatches.length === 1) {
        score += 3;
        details.push("Single date range detected");
    } else {
        score += 2;
    }

    const lines = text.split("\n");
    const bulletMarkers = new Set();
    lines.forEach(l => {
        const m = l.match(/^\s*([•\*\-\–\—\·\⁃\►\▸\▪\▫\u2022\uF0B7\uF0A7\u25A0\u25AA])\s+/);
        if (m) bulletMarkers.add(m[1]);
    });

    if (bulletMarkers.size <= 1) {
        score += 3;
        strengths.push("Uniform bullet point styling used across all sections.");
        details.push("Uniform bullet styling");
    } else if (bulletMarkers.size === 2) {
        score += 2;
        details.push("Minor variation in bullet markers");
    } else {
        score += 1;
        problems.push("Multiple different bullet styles detected. Use a single consistent bullet style.");
    }

    if (sectionsFound.length >= 2) {
        const allUpper = sectionsFound.every(s => s.originalText === s.originalText.toUpperCase());
        const allTitle = sectionsFound.every(s => s.originalText !== s.originalText.toUpperCase());

        if (allUpper || allTitle) {
            score += 3;
            strengths.push("Section headings follow consistent capitalization.");
            details.push("Consistent heading casing");
        } else {
            score += 2;
        }
    } else {
        score += 2;
    }

    return {
        score: Math.min(10, score),
        max: 10,
        details: details.join("; "),
        strengths,
        problems
    };
}

function scoreAtsRisks(text, candidateName) {
    let score = 0;
    const details = [];
    const strengths = [];
    const problems = [];

    const first500 = text.slice(0, 500);
    const nameMatches = candidateName ? (first500.match(new RegExp(candidateName.replace(/[^a-zA-Z0-9]/g, "\\$&"), "gi")) || []).length : 1;
    if (nameMatches <= 1) {
        score += 3;
        strengths.push("No duplicated name headers or redundant identity tags.");
        details.push("No duplicate headers");
    } else {
        score += 1;
        problems.push("Candidate name appears multiple times in the top section.");
    }

    const lines = text.split("\n");
    const pipeCollision = lines.some(l => (l.match(/\|/g) || []).length >= 4 && l.length > 80);
    if (!pipeCollision) {
        score += 3;
        strengths.push("No multi-column pipe collisions detected.");
        details.push("No multi-column collisions");
    } else {
        score += 1;
        problems.push("Multiple pipe delimiters found across lines, which can cause column-reading errors in ATS parsers.");
    }

    if (text.length >= 200) {
        score += 2;
        details.push("Valid text layer");
    } else {
        score += 0;
        problems.push("Extracted text is under 200 characters. Document may be a scanned image.");
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 100 && wordCount <= 1400) {
        score += 2;
        details.push("Proportional word count (" + wordCount + " words)");
    } else if (wordCount > 1400) {
        score += 1;
        problems.push("Resume is very lengthy (" + wordCount + " words). Consider condensing to under 1,000 words.");
    } else {
        score += 1;
    }

    return {
        score: Math.min(10, score),
        max: 10,
        details: details.join("; "),
        strengths,
        problems
    };
}

// ==========================================================
// 5. Main Analysis Function
// ==========================================================

function analyzeResumeText(rawText) {
    const text = normalizeGlyphs(rawText || "");

    if (!text || text.trim().length === 0) {
        return {
            overall_score: 0,
            score_label: "Needs Improvement",
            is_ats_friendly: false,
            breakdown: {},
            strengths: [],
            problems: ["No readable text could be extracted from this document. It may be a scanned image."],
            suggestions: ["Upload a clean, text-based PDF or Word document (.docx)."]
        };
    }

    const candidateName = extractCandidateName(text);

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const sectionsFound = [];
    let currentSec = null;

    for (const line of lines) {
        const heading = detectSectionHeading(line, candidateName);
        if (heading) {
            if (currentSec) sectionsFound.push(currentSec);
            currentSec = {
                ...heading,
                content: "",
                lines: []
            };
        } else if (currentSec) {
            currentSec.lines.push(line);
            currentSec.content += (currentSec.content ? "\n" : "") + line;
        }
    }
    if (currentSec) sectionsFound.push(currentSec);

    const contact = scoreContactInfo(text, candidateName);
    const readability = scoreMachineReadability(text);
    const layout = scoreLayoutSafety(text);
    const clarity = scoreSectionClarity(sectionsFound);
    const structure = scoreReadabilityAndStructure(text);
    const consistency = scoreConsistency(text, sectionsFound);
    const risks = scoreAtsRisks(text, candidateName);

    const overallScore = Math.min(100, Math.max(0,
        contact.score +
        readability.score +
        layout.score +
        clarity.score +
        structure.score +
        consistency.score +
        risks.score
    ));

    let scoreLabel = "Needs Improvement";
    if (overallScore >= 90) scoreLabel = "Excellent";
    else if (overallScore >= 75) scoreLabel = "Good";
    else if (overallScore >= 50) scoreLabel = "Average";

    const allStrengths = [
        ...contact.strengths,
        ...readability.strengths,
        ...layout.strengths,
        ...clarity.strengths,
        ...structure.strengths,
        ...consistency.strengths,
        ...risks.strengths
    ];

    const allProblems = [
        ...contact.problems,
        ...readability.problems,
        ...layout.problems,
        ...clarity.problems,
        ...structure.problems,
        ...consistency.problems,
        ...risks.problems
    ];

    const suggestions = [];

    if (overallScore < 75) {
        suggestions.push("Convert your resume to a clean, single-column ATS-friendly format to eliminate formatting parsing errors.");
    }

    if (contact.score < 12) {
        suggestions.push("Ensure your full name, email, phone number, and city/state are in the top identity header.");
    }

    if (readability.score < 12) {
        suggestions.push("Remove non-standard font symbols or dingbats that can cause square box artifacts in ATS parsers.");
    }

    if (layout.score < 16) {
        suggestions.push("Avoid multi-column tables, text boxes, and dense paragraphs (>300 words). Use standard vertical flow.");
    }

    if (structure.score < 12) {
        suggestions.push("Use concise bullet points (8 to 40 words) for descriptive items rather than unbroken paragraphs.");
    }

    if (clarity.score < 12) {
        suggestions.push("Clearly separate your resume sections with standard uppercase headings.");
    }

    return {
        overall_score: overallScore,
        score_label: scoreLabel,
        is_ats_friendly: overallScore >= 75,
        breakdown: {
            contact: { name: "Contact Information Readability", score: contact.score, max: 15, details: contact.details },
            readability: { name: "Machine-Readable Text Quality", score: readability.score, max: 15, details: readability.details },
            layout: { name: "Formatting & Layout Safety", score: layout.score, max: 20, details: layout.details },
            clarity: { name: "Section Clarity & Organization", score: clarity.score, max: 15, details: clarity.details },
            structure: { name: "Readability & Structure", score: structure.score, max: 15, details: structure.details },
            consistency: { name: "Formatting Consistency", score: consistency.score, max: 10, details: consistency.details },
            risks: { name: "ATS-Risk Elements", score: risks.score, max: 10, details: risks.details }
        },
        strengths: allStrengths,
        problems: allProblems,
        suggestions: suggestions
    };
}

// ==========================================================
// 6. Section-Flexible Extraction for ATS Conversion
// ==========================================================

function extractCleanATSData(rawText) {
    const text = normalizeGlyphs(rawText || "");
    const candidateName = extractCandidateName(text);
    const { email, phone, location, linkedin, github } = extractContactCoordinates(text, candidateName);

    const personal = {
        name: candidateName || "Candidate Name",
        title: "",
        email: email || "",
        phone: phone || "",
        location: location || "",
        linkedin: linkedin || "",
        github: github || "",
        portfolio_url: ""
    };

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let nameIdx = -1;
    for (let i = 0; i < Math.min(6, lines.length); i++) {
        const cleanL = lines[i].replace(/[^a-zA-Z\s]/g, "").trim().toLowerCase();
        if (candidateName && (cleanL === candidateName.toLowerCase() || candidateName.toLowerCase().startsWith(cleanL))) {
            nameIdx = i;
            if (i + 1 < lines.length && /^[A-Z]$/i.test(lines[i + 1].trim())) {
                nameIdx = i + 1; // skip initial
            }
            break;
        }
    }
    if (nameIdx !== -1 && nameIdx + 1 < lines.length) {
        for (let j = nameIdx + 1; j < Math.min(nameIdx + 4, lines.length); j++) {
            const nextLine = lines[j].replace(/^[^\w]+|[^\w]+$/g, "").trim();
            if (
                nextLine &&
                !nextLine.includes("@") &&
                !nextLine.includes("http") &&
                !/\d/.test(nextLine) &&
                !LOCATION_KEYWORDS.some(k => nextLine.toLowerCase().includes(k)) &&
                nextLine.length >= 2 &&
                nextLine.length <= 60 &&
                !detectSectionHeading(nextLine, candidateName)
            ) {
                personal.title = nextLine;
                break;
            }
        }
    }

    const sectionMap = {};
    const customSections = [];
    let currentKey = "header";
    let currentCustomHeading = "";
    sectionMap[currentKey] = [];

    for (const line of lines) {
        const heading = detectSectionHeading(line, candidateName);
        if (heading && line !== candidateName && line !== personal.title) {
            if (heading.isKnown) {
                currentKey = heading.key;
                currentCustomHeading = "";
                if (!sectionMap[currentKey]) sectionMap[currentKey] = [];
                // If this is a skills subcategory heading (e.g. Tools & Systems, Frameworks & Libraries), preserve it inside sectionMap.skills
                if (currentKey === "skills" && heading.originalText) {
                    sectionMap[currentKey].push(heading.originalText);
                }
            } else {
                currentKey = "custom";
                currentCustomHeading = heading.originalText;
                customSections.push({
                    heading: currentCustomHeading,
                    items: [],
                    lines: []
                });
            }
        } else {
            if (currentKey === "contact") {
                // Parse contact details if missing
                if (!personal.email && line.includes("@")) {
                    const em = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                    if (em) personal.email = em[0];
                }
                if (!personal.phone) {
                    const ph = line.match(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/);
                    if (ph && ph[0].trim().length >= 7) personal.phone = ph[0].trim();
                }
                if (!personal.location) {
                    const lowerL = line.toLowerCase();
                    if (LOCATION_KEYWORDS.some(k => lowerL.includes(k)) && !lowerL.includes("university") && !lowerL.includes("college") && !lowerL.includes("school")) {
                        personal.location = line.replace(/^[|,\s-]+|[|,\s-]+$/g, "").trim();
                    }
                }
            } else if (currentKey === "custom" && customSections.length > 0) {
                const activeCustom = customSections[customSections.length - 1];
                activeCustom.lines.push(line);
            } else {
                if (!sectionMap[currentKey]) sectionMap[currentKey] = [];
                sectionMap[currentKey].push(line);
            }
        }
    }

    // Process Summary
    let summary = "";
    if (sectionMap.summary && sectionMap.summary.length > 0) {
        summary = sectionMap.summary.join(" ").trim();
    }

    // Process Education
    const education = [];
    if (sectionMap.education && sectionMap.education.length > 0) {
        const eduLines = sectionMap.education;
        let currentEdu = null;

        for (const l of eduLines) {
            const cleanLine = stripBullet(l);
            if (!cleanLine) continue;

            const isDegreeLine = /\b(?:bachelor|master|b\.?s\.?c?|m\.?s\.?c?|b\.?tech|m\.?tech|bca|mca|bba|mba|ph\.?d|diploma|secondary|examination|degree)\b/i.test(cleanLine);
            const isInstitutionLine = /\b(?:university|college|collehe|institute|school|academy|vidya)\b/i.test(cleanLine);
            const hasDateRange = /\b(?:19|20)\d{2}\s*(?:–|-|to|\/)\s*(?:(?:19|20)\d{2}|present|current|\d{2,4})?\b/i.test(cleanLine);
            const isScoreLine = /\b(?:ccpa|gpa|cgpa|percentage|score|grade|marks):\s*[\d.]+%?/i.test(cleanLine);
            const isCourseworkLine = /^(?:relevant\s+coursework|coursework|courses):/i.test(cleanLine);

            if (isCourseworkLine && currentEdu) {
                currentEdu.coursework.push(cleanLine.replace(/^(?:relevant\s+coursework|coursework|courses):\s*/i, "").trim());
            } else if (/^coursework:?$/i.test(cleanLine)) {
                // Next line is coursework
                continue;
            } else if (isInstitutionLine || (isDegreeLine && !currentEdu)) {
                if (currentEdu) education.push(currentEdu);

                let inst = cleanLine;
                let deg = "";
                let yr = "";
                let sc = "";

                if (isDegreeLine && isInstitutionLine) {
                    const DEGREE_REGEX = /\b(b\.?s\.?c?\.?\s*(?:nursing|cs|it|computer\s+science)?|m\.?s\.?c?\.?|b\.?tech|m\.?tech|bca|mca|bba|mba|bachelor(?:\s+of\s+[a-z\s]+)?|master(?:\s+of\s+[a-z\s]+)?|diploma)\b/i;
                    const degMatch = cleanLine.match(DEGREE_REGEX);
                    deg = degMatch ? degMatch[0].trim() : "";
                    let remaining = degMatch ? cleanLine.replace(degMatch[0], "").replace(/^[.,–\-|:\s]+/, "").trim() : cleanLine;

                    const dateMatch = remaining.match(/\b(?:19|20)\d{2}\s*(?:–|-|to|\/)\s*(?:(?:19|20)\d{2}|present|current)?\b/i);
                    if (dateMatch) {
                        yr = dateMatch[0].trim();
                        remaining = remaining.replace(dateMatch[0], "").trim();
                    }
                    inst = remaining.replace(/\b(?:grade|score|marks|ccpa|cgpa):\s*$/i, "").replace(/[.,–\-|:\s]+$/, "").trim();
                } else {
                    const parts = cleanLine.split(/[–\-|]/).map(p => p.trim());
                    if (parts.length >= 2) {
                        if (isInstitutionLine && isDegreeLine) {
                            inst = parts[0];
                            deg = parts[1];
                            if (parts.length >= 3) {
                                if (/\b(?:19|20)\d{2}\b/.test(parts[2])) yr = parts[2];
                                else sc = parts[2];
                            }
                        }
                    }
                }

                currentEdu = {
                    institution: inst,
                    degree: deg,
                    year: yr,
                    score: sc,
                    coursework: []
                };

                if (!currentEdu.year && hasDateRange) {
                    const dateMatch = cleanLine.match(/\b(?:19|20)\d{2}\s*(?:–|-|to|\/)\s*(?:(?:19|20)\d{2}|present|current)?\b/i);
                    if (dateMatch) {
                        currentEdu.year = dateMatch[0].trim();
                        currentEdu.institution = currentEdu.institution.replace(dateMatch[0], "").replace(/[–\-|,\s]+$/, "").trim();
                    }
                }
            } else if (currentEdu) {
                if (/^[\d.]+%?$/.test(cleanLine)) {
                    if (!currentEdu.score) currentEdu.score = cleanLine;
                } else if (hasDateRange || isScoreLine) {
                    const parts = cleanLine.split(/[|•·]/).map(p => p.trim());
                    for (const part of parts) {
                        if (/\b(?:19|20)\d{2}\b/.test(part) && !currentEdu.year) {
                            currentEdu.year = part;
                        } else if (/\b(?:ccpa|gpa|cgpa|percentage|score|grade|marks)/i.test(part) && !currentEdu.score) {
                            currentEdu.score = part;
                        } else if (!currentEdu.score && /[\d.]+%?/.test(part)) {
                            currentEdu.score = part;
                        }
                    }
                } else if (isDegreeLine && !currentEdu.degree) {
                    currentEdu.degree = cleanLine;
                } else if (!currentEdu.degree && !isInstitutionLine && cleanLine.length > 2 && !/^[\d.,\s]+$/.test(cleanLine)) {
                    currentEdu.degree = cleanLine;
                } else if (!currentEdu.institution && isInstitutionLine) {
                    currentEdu.institution = cleanLine;
                } else if (currentEdu.coursework && currentEdu.coursework.length === 0 && !isDegreeLine && !isInstitutionLine && cleanLine.length < 50) {
                    currentEdu.coursework.push(cleanLine);
                }
            } else {
                currentEdu = {
                    institution: cleanLine,
                    degree: "",
                    year: "",
                    score: "",
                    coursework: []
                };
            }
        }
        if (currentEdu) education.push(currentEdu);
    }

    // Process Skills
    const KNOWN_TECH_KEYWORDS = new Set([
        "html", "css", "python", "javascript", "typescript", "react", "node", "java", "c++", "c#",
        "sql", "mysql", "mongodb", "postgresql", "git", "github", "docker", "kubernetes", "aws", "azure",
        "linux", "php", "mern", "mean", "django", "flask", "spring", "boot", "express", "tailwind", "bootstrap",
        "c", "ruby", "rust", "go", "golang", "flutter", "dart", "kotlin", "swift", "angular", "vue"
    ]);

    const KNOWN_SOFT_SKILLS = new Set([
        "communication", "teamwork", "leadership", "problem solving", "critical thinking",
        "adaptability", "time management", "learning", "collaboration", "creativity",
        "work ethic", "interpersonal", "conflict resolution", "emotional intelligence",
        "negotiation", "decision making", "presentation", "public speaking"
    ]);

    function isTechLine(str) {
        if (!str) return false;
        const words = str.toLowerCase().split(/[\s,\-|/]+/).filter(Boolean);
        if (words.length === 0) return false;
        const techWords = words.filter(w => KNOWN_TECH_KEYWORDS.has(w));
        return techWords.length >= 2 || (techWords.length > 0 && techWords.length / words.length >= 0.5);
    }

    function detectProjectCandidate(lines, startIndex) {
        const rawLine = lines[startIndex];
        const line = stripBullet(rawLine);
        if (!line || line.length < 3 || line.length > 90) return null;

        // Must not be a known skill category header
        if (/^(?:technical\s+skills|frameworks(?:\s*(?:&|and)?\s*libraries)?|tools(?:\s*(?:&|and)?\s*systems)?|core\s+competencies|soft\s+skills|programming\s+languages):?$/i.test(line)) {
            return null;
        }

        // Must not be a single standalone tech keyword (e.g. "java", "Git", "React")
        const words = line.split(/\s+/);
        if (words.length === 1 && KNOWN_TECH_KEYWORDS.has(line.toLowerCase())) {
            return null;
        }

        // Must not be a known soft skill (e.g. "Learning", "Teamwork")
        if (KNOWN_SOFT_SKILLS.has(line.toLowerCase())) {
            return null;
        }

        const nextLine = startIndex + 1 < lines.length ? stripBullet(lines[startIndex + 1]) : "";
        const nextNextLine = startIndex + 2 < lines.length ? stripBullet(lines[startIndex + 2]) : "";

        const hasProjectVerbs = /\b(?:managing|managed|developing|developed|building|built|powered|based|platform|system|application|web|service|api|tracking|portal|designing|designed|implemented|created)\b/i;

        const isNextLineDesc = hasProjectVerbs.test(nextLine) || isBulletLine(lines[startIndex + 1]);
        const isNextLineTech = isTechLine(nextLine) || /^(?:tech\s*stack|technologies|tools):\s*/i.test(nextLine);
        const isNextNextLineTech = isTechLine(nextNextLine) || /^(?:tech\s*stack|technologies|tools):\s*/i.test(nextNextLine);

        const looksLikeProject = (isNextLineDesc && (isNextNextLineTech || nextNextLine.length === 0 || startIndex + 2 >= lines.length)) ||
                                 (isNextLineTech && words.length >= 2);

        if (looksLikeProject) {
            const project = {
                title: line,
                subtitle: "",
                description: "",
                technologies: [],
                link: "",
                highlights: []
            };

            let consumed = 1;
            // Check next line for description
            if (startIndex + consumed < lines.length) {
                const nextL = lines[startIndex + consumed];
                const cleanNext = stripBullet(nextL);
                if (isBulletLine(nextL) || hasProjectVerbs.test(cleanNext) || (!isTechLine(cleanNext) && !/^(?:tech\s*stack|technologies|tools):\s*/i.test(cleanNext))) {
                    if (isBulletLine(nextL)) {
                        project.highlights.push(cleanNext);
                    }
                    project.description = cleanNext;
                    consumed++;
                }
            }

            // Check following line for technologies or additional description
            if (startIndex + consumed < lines.length) {
                const folL = lines[startIndex + consumed];
                const cleanFol = stripBullet(folL);
                if (/^(?:tech\s*stack|technologies|tools):\s*/i.test(cleanFol)) {
                    const techStr = cleanFol.replace(/^(?:tech\s*stack|technologies|tools):\s*/i, "");
                    project.technologies = techStr.split(/[,|]/).map(t => t.trim()).filter(Boolean);
                    consumed++;
                } else if (isTechLine(cleanFol)) {
                    const foundTech = cleanFol.split(/[\s,\-|/]+/).filter(w => KNOWN_TECH_KEYWORDS.has(w.toLowerCase()));
                    project.technologies = foundTech.length > 0 ? foundTech : cleanFol.split(/[,|]/).map(t => t.trim()).filter(Boolean);
                    consumed++;
                }
            }

            return { project, consumed };
        }

        return null;
    }

    const skills = {
        technical: [],
        frameworks: [],
        tools: [],
        soft: [],
        all: []
    };
    const extractedProjectsFromSkills = [];

    if (sectionMap.skills && sectionMap.skills.length > 0) {
        const skillLines = sectionMap.skills;
        let currentCat = "technical";
        let i = 0;

        while (i < skillLines.length) {
            const l = skillLines[i];
            const clean = stripBullet(l);
            if (!clean) { i++; continue; }

            // Check if line is a subcategory header
            const subcatMatch = clean.match(/^(?:skills(?:\s*(?:&|and)?\s*(?:competencies|expertise|proficiencies))?|technical\s+skills|frameworks(?:\s*(?:&|and)?\s*libraries)?|tools(?:\s*(?:&|and)?\s*systems)?|core\s+competencies|soft\s+skills|programming\s+languages|languages(?:\s*(?:&|and)?\s*technologies)?):?$/i);
            if (subcatMatch) {
                const lower = clean.toLowerCase();
                if (lower.includes("framework") || lower.includes("librar")) currentCat = "frameworks";
                else if (lower.includes("tool") || lower.includes("system") || lower.includes("platform")) currentCat = "tools";
                else if (lower.includes("soft") || lower.includes("competenc")) currentCat = "soft";
                else currentCat = "technical";
                i++;
                continue;
            }

            // Check if line is decorative glyph artifact
            if (clean.length <= 1 && !/[a-zA-Z0-9]/.test(clean)) {
                i++;
                continue;
            }

            // Check for project candidate in skills stream
            const projCandidate = detectProjectCandidate(skillLines, i);
            if (projCandidate) {
                extractedProjectsFromSkills.push(projCandidate.project);
                i += projCandidate.consumed;
                continue;
            }

            // Check for Category: item1, item2 format
            const catMatch = clean.match(/^([A-Za-z\s&]+):\s*(.+)$/);
            if (catMatch) {
                const catName = catMatch[1].trim().toLowerCase();
                const catSkills = catMatch[2].split(/[,|•]/).map(s => s.trim()).filter(Boolean);

                if (catName.includes("tool") || catName.includes("platform") || catName.includes("system")) {
                    skills.tools.push(...catSkills);
                } else if (catName.includes("framework") || catName.includes("librar")) {
                    skills.frameworks.push(...catSkills);
                } else if (catName.includes("soft") || catName.includes("competenc")) {
                    skills.soft.push(...catSkills);
                } else {
                    skills.technical.push(...catSkills);
                }
                skills.all.push(...catSkills);
            } else {
                // Plain line without colon
                const items = clean.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
                for (const item of items) {
                    const itemLower = item.toLowerCase();
                    if (currentCat === "tools" || itemLower === "git" || itemLower === "docker" || itemLower === "kubernetes") {
                        skills.tools.push(item);
                    } else if (currentCat === "frameworks" || itemLower === "react" || itemLower === "angular" || itemLower === "vue" || itemLower === "django" || itemLower === "flask") {
                        skills.frameworks.push(item);
                    } else if (currentCat === "soft" || KNOWN_SOFT_SKILLS.has(itemLower)) {
                        skills.soft.push(item);
                    } else {
                        skills.technical.push(item);
                    }
                    skills.all.push(item);
                }
            }
            i++;
        }

        skills.technical = [...new Set(skills.technical)];
        skills.frameworks = [...new Set(skills.frameworks)];
        skills.tools = [...new Set(skills.tools)];
        skills.soft = [...new Set(skills.soft)];
        skills.all = [...new Set(skills.all)];
    }

    // Process Experience
    const experience = [];
    if (sectionMap.experience && sectionMap.experience.length > 0) {
        const expLines = sectionMap.experience;
        let currentExp = null;

        for (const l of expLines) {
            const isBullet = isBulletLine(l);
            const clean = stripBullet(l);
            if (!clean || (clean.length <= 1 && !/[a-zA-Z0-9]/.test(clean))) continue;
            if (/^(?:skills\s*(?:\/|&|and)?\s*tools|technologies):?$/i.test(clean)) continue;

            const dateOnlyMatch = clean.match(/^(?:(?:19|20)\d{2}\s*(?:–|-|to)\s*(?:(?:19|20)\d{2}|present|current)|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);

            // If currentExp exists and lacks duration, and this line is primarily a date, assign duration
            if (!isBullet && dateOnlyMatch && currentExp && !currentExp.duration) {
                currentExp.duration = clean;
            } else if (!isBullet) {
                // New experience entry boundary
                if (currentExp) experience.push(currentExp);
                const parts = clean.split(/[–\-|@]/).map(p => p.trim());
                const dateInLine = (clean.match(/\b(?:19|20)\d{2}\s*(?:–|-|to)\s*(?:(?:19|20)\d{2}|present|current)\b|\b(?:19|20)\d{2}\b/i) || [""])[0];
                let comp = parts[1] || "";
                comp = comp.replace(/INTERNSHIP/gi, "").replace(/\b(?:19|20)\d{2}\b/g, "").replace(/[–\-|,\s]+$/, "").trim();

                currentExp = {
                    role: parts[0] || clean,
                    company: comp,
                    duration: dateInLine || "",
                    location: "",
                    description: "",
                    highlights: [],
                    is_internship: /internship|intern\b/i.test(clean)
                };
            } else if (currentExp) {
                if (isBullet) {
                    currentExp.highlights.push(clean);
                } else if (!currentExp.description) {
                    currentExp.description = clean;
                } else if (currentExp.highlights.length > 0) {
                    currentExp.highlights[currentExp.highlights.length - 1] += " " + clean;
                } else {
                    currentExp.description += " " + clean;
                }
            }
        }
        if (currentExp) experience.push(currentExp);
    }

    // Process Projects
    const projects = [];
    if (sectionMap.projects && sectionMap.projects.length > 0) {
        const projLines = sectionMap.projects;
        let currentProj = null;

        for (const l of projLines) {
            const isBullet = isBulletLine(l);
            const clean = stripBullet(l);
            if (!clean) continue;
            const words = clean.split(/\s+/);
            const isTechStackLine = /^(?:tech\s*stack|technologies|tools):\s*/i.test(clean);
            const isDescPhrase = /\b(?:based|powered|using|with|via)\b/i.test(clean);
            const isSingleTech = words.length === 1 && KNOWN_TECH_KEYWORDS.has(clean.toLowerCase());
            const isTech = isTechStackLine || isTechLine(clean) || isSingleTech;

            const isNewProjectTitle = !isBullet && clean.length < 90 && !isTech && !isDescPhrase;

            if (isNewProjectTitle && !currentProj) {
                currentProj = {
                    title: clean,
                    subtitle: "",
                    description: "",
                    technologies: [],
                    link: "",
                    highlights: []
                };
            } else if (isNewProjectTitle && currentProj && currentProj.description) {
                currentProj.technologies = [...new Set(currentProj.technologies)];
                projects.push(currentProj);
                currentProj = {
                    title: clean,
                    subtitle: "",
                    description: "",
                    technologies: [],
                    link: "",
                    highlights: []
                };
            } else if (currentProj) {
                if (isTechStackLine) {
                    const techStr = clean.replace(/^(?:tech\s*stack|technologies|tools):\s*/i, "").trim();
                    currentProj.technologies.push(...techStr.split(/[,|]/).map(t => t.trim()).filter(Boolean));
                } else if (isTech) {
                    const foundTech = clean.split(/[\s,\-|/]+/).filter(w => KNOWN_TECH_KEYWORDS.has(w.toLowerCase()));
                    currentProj.technologies.push(...(foundTech.length > 0 ? foundTech : [clean]));
                } else if (isBullet) {
                    currentProj.highlights.push(clean);
                    currentProj.description = (currentProj.description ? currentProj.description + " " : "") + clean;
                } else if (currentProj.highlights.length > 0) {
                    currentProj.highlights[currentProj.highlights.length - 1] += " " + clean;
                    currentProj.description = (currentProj.description ? currentProj.description + " " : "") + clean;
                } else {
                    currentProj.description = (currentProj.description ? currentProj.description + " " : "") + clean;
                }
            }
        }
        if (currentProj) {
            currentProj.technologies = [...new Set(currentProj.technologies)];
            projects.push(currentProj);
        }
    }
    if (extractedProjectsFromSkills.length > 0) {
        projects.push(...extractedProjectsFromSkills);
    }

    // Process Certifications
    const certificates = [];
    if (sectionMap.certifications && sectionMap.certifications.length > 0) {
        let currentCert = null;
        for (const rawLine of sectionMap.certifications) {
            const isBullet = isBulletLine(rawLine);
            const clean = stripBullet(rawLine);
            if (!clean) continue;

            const isDescriptionStart = /^(?:completed|successfully\s+completed|gained|learned|focused\s+on|conducted\s+by|participated|awarded|presented|explored|built|developed|designed|covered|trained|certified\s+in)\b/i.test(clean);
            const startsWithLower = /^[a-z]/.test(clean);

            const looksLikeNewTitle = !startsWithLower && !isDescriptionStart && (
                isBullet ||
                (clean.length < 80 && (
                    /certification|certificate|program|course|bootcamp|specialization|training|nanodegree|license|foundation|associate|professional|expert/i.test(clean) ||
                    clean.includes(" - ") || clean.includes(" – ") || clean.includes(" | ") ||
                    !currentCert ||
                    (currentCert && currentCert.description)
                ))
            );

            if (looksLikeNewTitle) {
                if (currentCert) certificates.push(currentCert);

                let name = clean;
                let issuer = "";
                let year = (clean.match(/\b(?:19|20)\d{2}\b/) || [""])[0];

                const parts = clean.split(/\s*[-–|]\s*/);
                if (parts.length >= 2) {
                    name = parts[0].trim();
                    issuer = parts[1].replace(/^[,\s]+|[,\s]+$/g, "").trim();
                    if (parts.length >= 3 && !year) {
                        year = (parts[2].match(/\b(?:19|20)\d{2}\b/) || [""])[0];
                    }
                }

                currentCert = {
                    name,
                    issuer,
                    year,
                    description: ""
                };
            } else if (currentCert) {
                if (currentCert.description) {
                    currentCert.description += " " + clean;
                } else {
                    currentCert.description = clean;
                }
            } else {
                currentCert = {
                    name: clean,
                    issuer: "",
                    year: (clean.match(/\b(?:19|20)\d{2}\b/) || [""])[0],
                    description: ""
                };
            }
        }
        if (currentCert) certificates.push(currentCert);
    }

    // Process Achievements
    const achievements = [];
    if (sectionMap.achievements && sectionMap.achievements.length > 0) {
        let currentAch = null;
        for (const rawLine of sectionMap.achievements) {
            const isBullet = isBulletLine(rawLine);
            const clean = stripBullet(rawLine);
            if (!clean) continue;

            const startsWithLower = /^[a-z]/.test(clean);
            const isContinuation = startsWithLower || (!isBullet && currentAch && !currentAch.title.endsWith("."));

            if (isContinuation && currentAch) {
                currentAch.title += " " + clean;
            } else {
                if (currentAch) achievements.push(currentAch);
                currentAch = { title: clean };
            }
        }
        if (currentAch) achievements.push(currentAch);
    }

    // Process Languages
    const languages = [];
    if (sectionMap.languages && sectionMap.languages.length > 0) {
        for (const l of sectionMap.languages) {
            const clean = stripBullet(l);
            if (!clean) continue;
            const langs = clean.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
            for (const lang of langs) {
                const m = lang.match(/^([A-Za-z]+)(?:\s*\(([^)]+)\))?$/);
                if (m) {
                    languages.push({ name: m[1], level: m[2] || "" });
                } else {
                    languages.push({ name: lang, level: "" });
                }
            }
        }
    }

    // Process Custom Sections
    for (const [key, linesArr] of Object.entries(sectionMap)) {
        if (key.startsWith("custom_") && linesArr.length > 0) {
            const headingObj = KNOWN_HEADING_PATTERNS.find(h => h.key === key);
            const headingName = headingObj ? headingObj.label : key.replace(/^custom_/, "").toUpperCase();

            customSections.push({
                heading: headingName,
                items: linesArr.map(l => ({
                    title: stripBullet(l),
                    subtitle: "",
                    date: (l.match(/\b(?:19|20)\d{2}\s*(?:–|-|to)\s*(?:(?:19|20)\d{2}|present|current)\b/i) || [""])[0],
                    description: ""
                })),
                rawText: linesArr.join("\n")
            });
        }
    }

    const formattedCustomSections = customSections.map(cs => {
        if (cs.items && cs.items.length > 0) return cs;
        const linesList = cs.lines || [];
        return {
            heading: cs.heading,
            items: linesList.map(l => ({
                title: stripBullet(l),
                subtitle: "",
                date: (l.match(/\b(?:19|20)\d{2}\s*(?:–|-|to)\s*(?:(?:19|20)\d{2}|present|current)\b/i) || [""])[0],
                description: ""
            })),
            rawText: linesList.join("\n")
        };
    }).filter(cs => cs.items.length > 0 || (cs.rawText && cs.rawText.trim().length > 0));

    return {
        personal,
        summary,
        education,
        skills,
        experience,
        projects,
        certificates,
        achievements,
        languages,
        custom_sections: formattedCustomSections
    };
}

/**
 * Converts SQLite Resume_Details row directly into canonical cleanATSData schema.
 * Reuses the validated structured data generated by the unified resume parser.
 */
function convertResumeDetailsToATSData(detailsRow) {
    if (!detailsRow) return null;

    let metadata = {};
    try {
        metadata = typeof detailsRow.metadata === "string" ? JSON.parse(detailsRow.metadata || "{}") : (detailsRow.metadata || {});
    } catch (e) {
        metadata = {};
    }

    const safeParse = (val, defaultVal = []) => {
        if (!val) return defaultVal;
        if (typeof val !== "string") return val;
        try {
            return JSON.parse(val);
        } catch {
            return defaultVal;
        }
    };

    const education = safeParse(detailsRow.education, []);
    const experience = safeParse(detailsRow.experience, []);
    const projects = safeParse(detailsRow.projects, []);
    const certifications = safeParse(detailsRow.certifications, []);
    const achievements = safeParse(detailsRow.achievements, []);
    const languages = safeParse(detailsRow.languages, []);
    const customSections = safeParse(detailsRow.custom_sections, []);

    // Skills normalization
    let rawSkills = safeParse(detailsRow.skills, {});
    let skills = {
        technical: [],
        frameworks: [],
        tools: [],
        soft: [],
        all: []
    };

    if (Array.isArray(rawSkills)) {
        skills.all = [...rawSkills];
        skills.technical = [...rawSkills];
    } else if (typeof rawSkills === "object" && rawSkills !== null) {
        skills.technical = Array.isArray(rawSkills.technical) ? rawSkills.technical : (Array.isArray(rawSkills.professional) ? rawSkills.professional : []);
        skills.frameworks = Array.isArray(rawSkills.frameworks) ? rawSkills.frameworks : [];
        skills.tools = Array.isArray(rawSkills.tools) ? rawSkills.tools : [];
        skills.soft = Array.isArray(rawSkills.soft) ? rawSkills.soft : [];
        skills.all = Array.isArray(rawSkills.all) && rawSkills.all.length > 0
            ? rawSkills.all
            : [...new Set([...skills.technical, ...skills.frameworks, ...skills.tools, ...skills.soft])];
    }

    // Format custom sections cleanly
    const formattedCustom = customSections.map(cs => {
        if (typeof cs === "string") {
            return { heading: "Additional Information", items: [{ title: cs, subtitle: "", date: "", description: "" }], rawText: cs };
        }
        const items = Array.isArray(cs.items) ? cs.items : (Array.isArray(cs.rawItems) ? cs.rawItems : []);
        return {
            heading: cs.heading || "Additional Information",
            items: items.map(it => {
                if (typeof it === "string") return { title: it, subtitle: "", date: "", description: "" };
                return {
                    title: it.title || it.name || "",
                    subtitle: it.subtitle || it.role || "",
                    date: it.date || it.year || "",
                    description: it.description || it.text || it.content || ""
                };
            }),
            rawText: cs.rawText || ""
        };
    }).filter(cs => (cs.items && cs.items.length > 0) || (cs.rawText && cs.rawText.trim().length > 0));

    return {
        personal: {
            name: detailsRow.name || "Candidate Name",
            title: metadata.title || "",
            email: detailsRow.email || "",
            phone: detailsRow.phone || "",
            location: metadata.location || detailsRow.address || "",
            linkedin: detailsRow.linkedin || "",
            github: detailsRow.github || "",
            portfolio_url: metadata.portfolio_url || ""
        },
        summary: detailsRow.about || "",
        education: education.map(e => ({
            degree: e.degree || "",
            institution: e.institution || "",
            board: e.board || "",
            location: e.location || "",
            year: e.year || (e.start_year && e.end_year ? `${e.start_year}-${e.end_year}` : (e.end_year || e.start_year || "")),
            score: e.score || e.grade || "",
            coursework: Array.isArray(e.coursework) ? e.coursework : (e.coursework ? [e.coursework] : []),
            additional_details: e.additional_details || ""
        })),
        skills,
        experience: experience.map(exp => ({
            role: exp.role || exp.title || "",
            company: exp.company || exp.organization || "",
            location: exp.location || "",
            duration: exp.duration || (exp.start_date && exp.end_date ? `${exp.start_date} - ${exp.end_date}` : (exp.end_date || exp.start_date || "")),
            description: exp.description || exp.responsibilities || "",
            highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
            is_internship: Boolean(exp.is_internship || /internship|intern\b/i.test(exp.role || "") || exp.employment_type === "Internship")
        })),
        projects: projects.map(p => ({
            title: p.title || p.name || "",
            subtitle: p.subtitle || "",
            description: p.description || "",
            technologies: Array.isArray(p.technologies) ? p.technologies : (p.technologies ? p.technologies.split(/[,|]/).map(t => t.trim()) : []),
            link: p.link || "",
            highlights: Array.isArray(p.highlights) ? p.highlights : []
        })),
        certificates: certifications.map(c => ({
            name: c.name || c.title || "",
            issuer: c.issuer || c.organization || "",
            year: c.year || c.date || "",
            description: c.description || ""
        })),
        achievements: achievements.map(a => ({
            title: a.title || a.name || (typeof a === "string" ? a : "")
        })),
        languages: languages.map(l => ({
            name: l.name || l.language || (typeof l === "string" ? l : ""),
            level: l.level || l.proficiency || ""
        })),
        custom_sections: formattedCustom.filter(cs => {
            const headingLower = (cs.heading || "").toLowerCase();
            if (headingLower.includes("contact")) return false;
            const isDuplicate = cs.items && cs.items.length > 0 && cs.items.every(it => {
                const t = (it.title || "").toLowerCase().trim();
                return experience.some(exp => (exp.role || exp.title || "").toLowerCase().trim() === t) ||
                       education.some(edu => (edu.degree || "").toLowerCase().trim() === t || (edu.institution || "").toLowerCase().trim() === t) ||
                       projects.some(pr => (pr.title || "").toLowerCase().trim() === t);
            });
            return !isDuplicate;
        })
    };
}

/**
 * Reconstructs clean, standard-order text from structured cleanATSData for accurate ATS scoring.
 */
function generateNormalizedTextFromData(cleanATSData) {
    if (!cleanATSData) return "";
    const p = cleanATSData.personal || {};
    const lines = [];

    if (p.name) lines.push(p.name);
    if (p.title) lines.push(p.title);
    const contacts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
    if (contacts.length) lines.push(contacts.join(" | "));

    if (cleanATSData.summary) {
        lines.push("\nPROFESSIONAL SUMMARY\n" + cleanATSData.summary);
    }
    if (cleanATSData.experience && cleanATSData.experience.length) {
        lines.push("\nWORK EXPERIENCE");
        cleanATSData.experience.forEach(e => {
            lines.push(`${e.role} at ${e.company} ${e.duration}`);
            if (e.description) lines.push(e.description);
            if (e.highlights && e.highlights.length) e.highlights.forEach(h => lines.push(`• ${h}`));
        });
    }
    if (cleanATSData.education && cleanATSData.education.length) {
        lines.push("\nEDUCATION");
        cleanATSData.education.forEach(e => {
            lines.push(`${e.degree} - ${e.institution} ${e.year}`);
            if (e.score) lines.push(`Score: ${e.score}`);
            if (e.coursework && e.coursework.length) lines.push(`Coursework: ${e.coursework.join(", ")}`);
        });
    }
    if (cleanATSData.skills) {
        lines.push("\nSKILLS & COMPETENCIES");
        const sk = cleanATSData.skills;
        if (sk.technical && sk.technical.length) lines.push(`Technical Skills: ${sk.technical.join(", ")}`);
        if (sk.tools && sk.tools.length) lines.push(`Tools & Systems: ${sk.tools.join(", ")}`);
        if (sk.frameworks && sk.frameworks.length) lines.push(`Frameworks & Libraries: ${sk.frameworks.join(", ")}`);
        if (sk.soft && sk.soft.length) lines.push(`Core Competencies: ${sk.soft.join(", ")}`);
        if (sk.all && sk.all.length && !sk.technical.length && !sk.tools.length) lines.push(sk.all.join(", "));
    }
    if (cleanATSData.certificates && cleanATSData.certificates.length) {
        lines.push("\nCERTIFICATIONS");
        cleanATSData.certificates.forEach(c => lines.push(`${c.name} - ${c.issuer} ${c.year}`));
    }
    if (cleanATSData.projects && cleanATSData.projects.length) {
        lines.push("\nPROJECTS");
        cleanATSData.projects.forEach(pr => {
            lines.push(pr.title);
            if (pr.description) lines.push(pr.description);
            if (pr.technologies && pr.technologies.length) lines.push(`Technologies: ${pr.technologies.join(", ")}`);
        });
    }
    if (cleanATSData.achievements && cleanATSData.achievements.length) {
        lines.push("\nACHIEVEMENTS");
        cleanATSData.achievements.forEach(a => lines.push(`• ${a.title}`));
    }
    if (cleanATSData.languages && cleanATSData.languages.length) {
        lines.push("\nLANGUAGES");
        cleanATSData.languages.forEach(l => lines.push(`${l.name} (${l.level || "Proficient"})`));
    }
    return lines.join("\n").trim();
}

module.exports = {
    normalizeGlyphs,
    stripBullet,
    isBulletLine,
    extractCandidateName,
    extractContactCoordinates,
    detectSectionHeading,
    analyzeResumeText,
    extractCleanATSData,
    convertResumeDetailsToATSData,
    generateNormalizedTextFromData,
    scoreContactInfo,
    scoreMachineReadability,
    scoreLayoutSafety,
    scoreSectionClarity,
    scoreReadabilityAndStructure,
    scoreConsistency,
    scoreAtsRisks
};
