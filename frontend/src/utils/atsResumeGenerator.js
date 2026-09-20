/**
 * ATS Resume Generator Utilities
 *
 * Generates:
 * 1. Plain text format (optimized for ATS copy-paste fields)
 * 2. Standalone ATS HTML document (single-column, clean typography, safely escaped)
 * 3. Pure Vector Text ATS PDF (machine-readable text layer, selectable, copyable, no html2canvas/image)
 */

import { jsPDF } from "jspdf";

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generatePlainText(resume) {
  if (!resume) return "";

  const personal = resume.personal || {};
  const summary = resume.summary || resume.about || "";
  const education = Array.isArray(resume.education) ? resume.education : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const certificates = Array.isArray(resume.certificates)
    ? resume.certificates
    : Array.isArray(resume.certifications)
    ? resume.certifications
    : [];
  const achievements = Array.isArray(resume.achievements) ? resume.achievements : [];
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const customSections = Array.isArray(resume.custom_sections) ? resume.custom_sections : [];

  const skillsObj = resume.skills || {};
  const flatSkills = Array.isArray(resume.skills)
    ? resume.skills
    : Array.isArray(skillsObj.all)
    ? skillsObj.all
    : [];

  const lines = [];

  // Candidate Name & Contact
  if (personal.name) lines.push(personal.name.toUpperCase());
  if (personal.title) lines.push(personal.title);

  // Clean location (remove duplicate candidate name if present)
  let cleanLocation = personal.location || "";
  if (personal.name && cleanLocation.toLowerCase().startsWith(personal.name.toLowerCase())) {
    cleanLocation = cleanLocation.slice(personal.name.length).replace(/^[,\s|-]+/, "").trim();
  }

  const contact = [
    personal.email,
    personal.phone,
    cleanLocation,
    personal.linkedin,
    personal.github,
    personal.portfolio_url
  ].filter(Boolean);

  if (contact.length) lines.push(contact.join(" | "));
  lines.push("");

  // Summary (Only if present)
  if (summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("--------------------");
    lines.push(summary);
    lines.push("");
  }

  // Education (Only if present)
  if (education.length > 0) {
    lines.push("EDUCATION");
    lines.push("---------");
    education.forEach((edu) => {
      const header = [edu.degree, edu.institution].filter(Boolean).join(" - ");
      lines.push(header + (edu.year ? ` (${edu.year})` : ""));
      if (edu.location) lines.push(edu.location);
      if (edu.score) lines.push(`Score/Grade: ${edu.score}`);
      if (Array.isArray(edu.coursework) && edu.coursework.length > 0) {
        lines.push(`Relevant Coursework: ${edu.coursework.join(", ")}`);
      }
      lines.push("");
    });
  }

  // Skills (Only if present)
  if (flatSkills.length > 0 || Object.keys(skillsObj).length > 0) {
    lines.push("SKILLS & COMPETENCIES");
    lines.push("---------------------");
    let hasCategorized = false;
    if (typeof skillsObj === "object" && !Array.isArray(skillsObj)) {
      for (const [key, val] of Object.entries(skillsObj)) {
        if (key !== "all" && Array.isArray(val) && val.length > 0) {
          lines.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.join(", ")}`);
          hasCategorized = true;
        }
      }
    }
    if (!hasCategorized && flatSkills.length > 0) {
      lines.push(flatSkills.join(", "));
    }
    lines.push("");
  }

  // Experience (Only if present)
  if (experience.length > 0) {
    lines.push("PROFESSIONAL EXPERIENCE");
    lines.push("-----------------------");
    experience.forEach((exp) => {
      const header = [exp.role, exp.company].filter(Boolean).join(" - ");
      lines.push(header + (exp.duration ? ` (${exp.duration})` : ""));
      if (exp.location) lines.push(exp.location);
      if (exp.description) lines.push(exp.description);
      if (Array.isArray(exp.highlights)) {
        exp.highlights.forEach((h) => lines.push(`• ${h}`));
      }
      lines.push("");
    });
  }

  // Projects (Only if present)
  if (projects.length > 0) {
    lines.push("PROJECTS");
    lines.push("--------");
    projects.forEach((proj) => {
      lines.push(proj.title + (proj.subtitle ? ` - ${proj.subtitle}` : ""));
      if (proj.description) lines.push(proj.description);
      if (Array.isArray(proj.highlights)) {
        proj.highlights.forEach((h) => lines.push(`• ${h}`));
      }
      if (Array.isArray(proj.technologies) && proj.technologies.length > 0) {
        lines.push(`Technologies: ${proj.technologies.join(", ")}`);
      }
      lines.push("");
    });
  }

  // Certifications & Achievements (Only if present)
  if (certificates.length > 0 || achievements.length > 0) {
    lines.push("CERTIFICATIONS & ACHIEVEMENTS");
    lines.push("-----------------------------");
    certificates.forEach((c) => {
      const header = [c.name, c.issuer].filter(Boolean).join(" - ");
      lines.push(`${header}${c.year ? ` (${c.year})` : ""}`);
      if (c.description) lines.push(`  ${c.description}`);
    });
    achievements.forEach((a) => {
      lines.push(`• ${typeof a === "string" ? a : a.title || ""}`);
    });
    lines.push("");
  }

  // Languages (Only if present)
  if (languages.length > 0) {
    lines.push("LANGUAGES");
    lines.push("---------");
    lines.push(languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(", "));
    lines.push("");
  }

  // Custom Sections (Only if present)
  if (customSections.length > 0) {
    customSections.forEach((sec) => {
      lines.push(sec.heading.toUpperCase());
      lines.push("-".repeat(sec.heading.length));
      if (Array.isArray(sec.items) && sec.items.length > 0) {
        sec.items.forEach((it) => {
          lines.push(`• ${it.title}${it.date ? ` (${it.date})` : ""}`);
          if (it.description) lines.push(`  ${it.description}`);
        });
      } else if (sec.rawText) {
        lines.push(sec.rawText);
      }
      lines.push("");
    });
  }

  return lines.join("\n").trim();
}

export function generateATSHTML(resume) {
  if (!resume) return "";

  const personal = resume.personal || {};
  const summary = resume.summary || resume.about || "";
  const education = Array.isArray(resume.education) ? resume.education : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const certificates = Array.isArray(resume.certificates)
    ? resume.certificates
    : Array.isArray(resume.certifications)
    ? resume.certifications
    : [];
  const achievements = Array.isArray(resume.achievements) ? resume.achievements : [];
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const customSections = Array.isArray(resume.custom_sections) ? resume.custom_sections : [];

  const skillsObj = resume.skills || {};
  const flatSkills = Array.isArray(resume.skills)
    ? resume.skills
    : Array.isArray(skillsObj.all)
    ? skillsObj.all
    : [];

  let cleanLocation = personal.location || "";
  if (personal.name && cleanLocation.toLowerCase().startsWith(personal.name.toLowerCase())) {
    cleanLocation = cleanLocation.slice(personal.name.length).replace(/^[,\s|-]+/, "").trim();
  }

  const contact = [
    personal.email ? `<a href="mailto:${escapeHtml(personal.email)}">${escapeHtml(personal.email)}</a>` : "",
    personal.phone ? escapeHtml(personal.phone) : "",
    cleanLocation ? escapeHtml(cleanLocation) : "",
    personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}">${escapeHtml(personal.linkedin.replace(/^https?:\/\//, ""))}</a>` : "",
    personal.github ? `<a href="${escapeHtml(personal.github)}">${escapeHtml(personal.github.replace(/^https?:\/\//, ""))}</a>` : ""
  ].filter(Boolean).join(" &bull; ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(personal.name || "Candidate")} - ATS Resume</title>
  <style>
    @page { margin: 15mm; size: letter portrait; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #111111;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    header { text-align: center; margin-bottom: 16px; border-bottom: 1.5px solid #111; padding-bottom: 10px; }
    h1 { font-size: 19pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3px 0; letter-spacing: 0.5px; }
    .title { font-size: 11pt; font-weight: 600; margin: 0 0 6px 0; color: #333; }
    .contact { font-size: 9.5pt; color: #333; margin: 0; }
    .contact a { color: #111; text-decoration: underline; }
    section { margin-bottom: 14px; }
    h2 {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #111;
      padding-bottom: 2px;
      margin: 12px 0 6px 0;
    }
    p { margin: 3px 0; }
    ul { margin: 3px 0 8px 18px; padding: 0; }
    li { margin-bottom: 2px; }
    .entry-header { display: flex; justify-content: space-between; font-weight: bold; }
    .entry-sub { font-style: italic; font-size: 9.5pt; color: #333; margin-bottom: 3px; }
    @media print {
      body { padding: 0; }
      a { text-decoration: none; color: #000; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(personal.name || "Candidate Name")}</h1>
    ${personal.title ? `<div class="title">${escapeHtml(personal.title)}</div>` : ""}
    <div class="contact">${contact}</div>
  </header>

  ${summary ? `
  <section>
    <h2>Professional Summary</h2>
    <p>${escapeHtml(summary)}</p>
  </section>` : ""}

  ${education.length > 0 ? `
  <section>
    <h2>Education</h2>
    ${education.map((edu) => `
      <div style="margin-bottom: 8px;">
        <div class="entry-header">
          <span>${escapeHtml(edu.degree || edu.institution || "Degree")}${edu.degree && edu.institution ? ` &mdash; ${escapeHtml(edu.institution)}` : ""}</span>
          <span>${escapeHtml(edu.year || "")}</span>
        </div>
        ${edu.location ? `<div class="entry-sub">${escapeHtml(edu.location)}</div>` : ""}
        ${edu.score ? `<p style="font-size: 9.5pt;">${escapeHtml(edu.score)}</p>` : ""}
        ${Array.isArray(edu.coursework) && edu.coursework.length > 0 ? `
          <p style="font-size: 9.5pt;"><strong>Relevant Coursework:</strong> ${escapeHtml(edu.coursework.join(", "))}</p>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${flatSkills.length > 0 ? `
  <section>
    <h2>Skills & Competencies</h2>
    <p>${escapeHtml(flatSkills.join(", "))}</p>
  </section>` : ""}

  ${experience.length > 0 ? `
  <section>
    <h2>Professional Experience</h2>
    ${experience.map((exp) => `
      <div style="margin-bottom: 10px;">
        <div class="entry-header">
          <span>${escapeHtml(exp.role || "Role")}${exp.company ? ` &mdash; ${escapeHtml(exp.company)}` : ""}${exp.is_internship ? " (Internship)" : ""}</span>
          <span>${escapeHtml(exp.duration || "")}</span>
        </div>
        ${exp.location ? `<div class="entry-sub">${escapeHtml(exp.location)}</div>` : ""}
        ${exp.description ? `<p>${escapeHtml(exp.description)}</p>` : ""}
        ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
          <ul>
            ${exp.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${projects.length > 0 ? `
  <section>
    <h2>Projects</h2>
    ${projects.map((proj) => `
      <div style="margin-bottom: 8px;">
        <div class="entry-header">
          <span>${escapeHtml(proj.title || "Project")}${proj.subtitle ? ` &mdash; ${escapeHtml(proj.subtitle)}` : ""}</span>
          <span>${escapeHtml(proj.duration || "")}</span>
        </div>
        ${proj.description ? `<p>${escapeHtml(proj.description)}</p>` : ""}
        ${Array.isArray(proj.highlights) && proj.highlights.length > 0 ? `
          <ul>
            ${proj.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>` : ""}
        ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `
          <p style="font-size: 9.5pt;"><strong>Tech Stack:</strong> ${escapeHtml(proj.technologies.join(", "))}</p>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${certificates.length > 0 || achievements.length > 0 ? `
  <section>
    <h2>Certifications & Honors</h2>
    ${certificates.length > 0 ? certificates.map((c) => `
      <div style="margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between;">
          <strong>${escapeHtml(c.name)}${c.issuer ? ` &mdash; ${escapeHtml(c.issuer)}` : ""}</strong>
          <span>${escapeHtml(c.year || "")}</span>
        </div>
        ${c.description ? `<p style="margin: 2px 0 0 0; text-align: justify;">${escapeHtml(c.description)}</p>` : ""}
      </div>
    `).join("") : ""}
    ${achievements.length > 0 ? `
      <ul>
        ${achievements.map((a) => `<li>${escapeHtml(typeof a === "string" ? a : a.title || "")}</li>`).join("")}
      </ul>
    ` : ""}
  </section>` : ""}

  ${languages.length > 0 ? `
  <section>
    <h2>Languages</h2>
    <p>${languages.map((l) => `${escapeHtml(l.name)}${l.level ? ` (${escapeHtml(l.level)})` : ""}`).join(", ")}</p>
  </section>` : ""}

  ${customSections.length > 0 ? customSections.map((sec) => `
  <section>
    <h2>${escapeHtml(sec.heading)}</h2>
    ${Array.isArray(sec.items) && sec.items.length > 0 ? `
      <ul>
        ${sec.items.map((it) => `<li><strong>${escapeHtml(it.title)}</strong>${it.date ? ` (${escapeHtml(it.date)})` : ""}${it.description ? ` &mdash; ${escapeHtml(it.description)}` : ""}</li>`).join("")}
      </ul>` : `<p style="white-space: pre-line;">${escapeHtml(sec.rawText || "")}</p>`}
  </section>`).join("") : ""}
</body>
</html>`;
}

function formatCategoryTitle(key) {
  const k = key.toLowerCase().trim();
  if (k === "professional") return "Professional Skills";
  if (k === "technical") return "Technical Skills";
  if (k === "tools") return "Tools & Systems";
  if (k === "soft") return "Core Competencies";
  if (k === "industry") return "Industry Knowledge";
  if (k === "frameworks") return "Frameworks & Libraries";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generates a pure vector text ATS-friendly PDF.
 * - Uses native jsPDF text rendering (doc.text(), doc.setFont())
 * - 100% extractable, selectable, copyable text layer
 * - Zero rasterization / NO html2canvas / NO images
 * - Standard Helvetica typography ensuring zero character corruption
 * - Clean single-column format with zero browser headers/footers/timestamps
 */
export function generateAtsTextPDF(resume, filename = "resume-ats.pdf") {
  console.log("USING NEW generateAtsTextPDF");
  if (!resume) throw new Error("No resume data provided for PDF generation");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    compress: true
  });

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36; // 0.5 in (36 pt)
  const contentWidth = pageWidth - margin * 2; // 523.28 pt
  const bottomMargin = 36;

  let y = margin;

  // Space management / pagination helper
  function checkPageBreak(neededHeight) {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  // Section header helper
  function renderSectionHeader(title) {
    checkPageBreak(32);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), margin, y);
    y += 3;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.75);
    doc.line(margin, y, margin + contentWidth, y);
    y += 9;
  }

  // Helper for entry header: Left text bold, Right text normal/bold
  function renderEntryHeader(leftText, rightText = "") {
    checkPageBreak(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);

    if (rightText) {
      const rightWidth = doc.getTextWidth(rightText);
      const maxLeftWidth = contentWidth - rightWidth - 10;
      const leftLines = doc.splitTextToSize(leftText, maxLeftWidth);
      doc.text(leftLines[0], margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(rightText, margin + contentWidth, y, { align: "right" });
      y += 11.5;
      for (let i = 1; i < leftLines.length; i++) {
        checkPageBreak(11.5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text(leftLines[i], margin, y);
        y += 11.5;
      }
    } else {
      const leftLines = doc.splitTextToSize(leftText, contentWidth);
      for (const line of leftLines) {
        checkPageBreak(11.5);
        doc.text(line, margin, y);
        y += 11.5;
      }
    }
  }

  // Helper for subtitle / location (italic)
  function renderSubHeader(text) {
    if (!text) return;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      checkPageBreak(11);
      doc.text(line, margin, y);
      y += 11;
    }
    y += 1;
  }

  // Helper for paragraph text
  function renderParagraph(text) {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      checkPageBreak(11.5);
      doc.text(line, margin, y);
      y += 11.5;
    }
    y += 2;
  }

  // Helper for bullet items
  function renderBullet(text) {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    const bulletIndent = 12;
    const textWidth = contentWidth - bulletIndent;
    const lines = doc.splitTextToSize(text, textWidth);
    for (let i = 0; i < lines.length; i++) {
      checkPageBreak(11.5);
      if (i === 0) {
        doc.text("•", margin + 2, y);
        doc.text(lines[i], margin + bulletIndent, y);
      } else {
        doc.text(lines[i], margin + bulletIndent, y);
      }
      y += 11.5;
    }
    y += 1;
  }

  // 1. Personal / Header
  const personal = resume.personal || {};
  const candidateName = personal.name || "Candidate Name";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(candidateName.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 15;

  if (personal.title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(personal.title, pageWidth / 2, y, { align: "center" });
    y += 12;
  }

  // Clean location (remove duplicate candidate name if present)
  let cleanLocation = personal.location || "";
  if (personal.name && cleanLocation.toLowerCase().startsWith(personal.name.toLowerCase())) {
    cleanLocation = cleanLocation.slice(personal.name.length).replace(/^[,\s|-]+/, "").trim();
  }

  const contactItems = [
    personal.email,
    personal.phone,
    cleanLocation,
    personal.linkedin,
    personal.github,
    personal.portfolio_url
  ].filter(Boolean);

  if (contactItems.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const contactStr = contactItems.join("  |  ");
    const contactLines = doc.splitTextToSize(contactStr, contentWidth);
    for (const line of contactLines) {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 11;
    }
  }

  // Divider line under header
  y += 2;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // 2. Professional Summary (Only if present)
  const summary = resume.summary || resume.about || "";
  if (summary) {
    renderSectionHeader("Professional Summary");
    renderParagraph(summary);
  }

  // 3. Education (Only if present)
  const education = Array.isArray(resume.education) ? resume.education : [];
  if (education.length > 0) {
    renderSectionHeader("Education");
    education.forEach((edu) => {
      const header = [edu.degree, edu.institution].filter(Boolean).join(" — ");
      const board = edu.board ? ` (Board: ${edu.board})` : "";
      renderEntryHeader(header ? `${header}${board}` : edu.degree || edu.institution || "Degree", edu.year || "");
      if (edu.location) renderSubHeader(edu.location);
      if (edu.score) renderParagraph(`Score/Grade: ${edu.score}`);
      if (Array.isArray(edu.coursework) && edu.coursework.length > 0) {
        renderParagraph(`Relevant Coursework: ${edu.coursework.join(", ")}`);
      }
      if (edu.additional_details) {
        renderParagraph(edu.additional_details);
      }
      y += 2;
    });
  }

  // 4. Skills & Competencies (Only if present)
  const skillsObj = resume.skills || resume.categorized_skills || {};
  const flatSkills = Array.isArray(resume.skills)
    ? resume.skills
    : Array.isArray(resume.flat_skills)
    ? resume.flat_skills
    : Array.isArray(skillsObj.all)
    ? skillsObj.all
    : [];

  const skillCategories = typeof skillsObj === "object" && !Array.isArray(skillsObj)
    ? Object.entries(skillsObj).filter(
        ([key, val]) => key !== "all" && Array.isArray(val) && val.length > 0
      )
    : [];

  if (skillCategories.length > 0 || flatSkills.length > 0) {
    renderSectionHeader("Skills & Competencies");
    if (skillCategories.length > 0) {
      skillCategories.forEach(([catKey, skills]) => {
        renderParagraph(`${formatCategoryTitle(catKey)}: ${skills.join(", ")}`);
      });
    } else if (flatSkills.length > 0) {
      renderParagraph(flatSkills.join(", "));
    }
    y += 2;
  }

  // 5. Professional Experience (Only if present)
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  if (experience.length > 0) {
    renderSectionHeader("Professional Experience");
    experience.forEach((exp) => {
      const empType = exp.employment_type || (exp.is_internship ? "Internship" : null);
      const header = [exp.role, exp.company].filter(Boolean).join(" — ") + (empType ? ` (${empType})` : "");
      renderEntryHeader(header || exp.role || "Role", exp.duration || "");
      if (exp.location) renderSubHeader(exp.location);
      if (exp.description) renderParagraph(exp.description);
      if (Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0) {
        exp.responsibilities.filter(Boolean).forEach((r) => renderBullet(r));
      } else if (exp.responsibilities && typeof exp.responsibilities === "string") {
        renderParagraph(exp.responsibilities);
      }
      if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
        exp.highlights.filter(Boolean).forEach((hl) => renderBullet(hl));
      }
      if (exp.achievements) {
        renderParagraph(`Key Achievement: ${Array.isArray(exp.achievements) ? exp.achievements.join("; ") : exp.achievements}`);
      }
      if (exp.technologies) {
        renderParagraph(`Skills & Tools: ${Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies}`);
      }
      y += 3;
    });
  }

  // 6. Projects (Only if present)
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  if (projects.length > 0) {
    renderSectionHeader("Projects");
    projects.forEach((proj) => {
      const title = proj.title + (proj.subtitle ? ` — ${proj.subtitle}` : "");
      renderEntryHeader(title || "Project", proj.duration || "");
      if (proj.role || proj.organization) {
        renderSubHeader([proj.role, proj.organization].filter(Boolean).join(" — "));
      }
      if (proj.description) renderParagraph(proj.description);
      if (Array.isArray(proj.highlights) && proj.highlights.length > 0) {
        proj.highlights.filter(Boolean).forEach((hl) => renderBullet(hl));
      }
      if (Array.isArray(proj.responsibilities) && proj.responsibilities.length > 0) {
        proj.responsibilities.filter(Boolean).forEach((r) => renderBullet(r));
      }
      if (proj.technologies && proj.technologies.length > 0) {
        renderParagraph(`Tech Stack: ${Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}`);
      }
      y += 3;
    });
  }

  // 7. Certifications & Honors (Only if present)
  const certificates = Array.isArray(resume.certificates)
    ? resume.certificates
    : Array.isArray(resume.certifications)
    ? resume.certifications
    : [];
  const achievements = Array.isArray(resume.achievements) ? resume.achievements : [];

  if (certificates.length > 0 || achievements.length > 0) {
    renderSectionHeader("Certifications & Honors");
    certificates.forEach((c) => {
      const header = [c.name, c.issuer].filter(Boolean).join(" — ");
      renderEntryHeader(header || c.name, c.year || "");
      if (c.description) {
        renderParagraph(c.description);
      }
      y += 1.5;
    });
    achievements.forEach((a) => {
      const achTitle = typeof a === "string" ? a : a?.title || "";
      if (achTitle) renderBullet(achTitle);
    });
    y += 2;
  }

  // 8. Languages (Only if present)
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  if (languages.length > 0) {
    renderSectionHeader("Languages");
    renderParagraph(languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(", "));
    y += 2;
  }

  // 9. Custom Sections (Only if present)
  const customSections = Array.isArray(resume.custom_sections) ? resume.custom_sections : [];
  if (customSections.length > 0) {
    customSections.forEach((sec) => {
      renderSectionHeader(sec.heading);
      if (Array.isArray(sec.items) && sec.items.length > 0) {
        sec.items.forEach((it) => {
          renderEntryHeader(it.title + (it.date ? ` (${it.date})` : ""), "");
          if (it.subtitle) renderSubHeader(it.subtitle);
          if (it.description) renderParagraph(it.description);
        });
      } else if (sec.rawText) {
        renderParagraph(sec.rawText);
      }
      y += 2;
    });
  }

  // Browser download trigger
  if (typeof window !== "undefined" && typeof doc.save === "function") {
    doc.save(filename);
  }

  return doc;
}