import React from "react";

export default function AtsTemplate({ resume }) {
  if (!resume) return null;

  const personal = resume.personal || {};
  const metadata = resume.metadata || {};
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

  const skillsObj = resume.skills || resume.categorized_skills || {};
  const flatSkills = Array.isArray(resume.skills)
    ? resume.skills
    : Array.isArray(resume.flat_skills)
    ? resume.flat_skills
    : Array.isArray(skillsObj.all)
    ? skillsObj.all
    : [];

  // Contact line items
  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.portfolio_url,
    personal.linkedin,
    personal.github,
  ].filter(Boolean);

  return (
    <div className="bg-white text-black font-sans p-8 sm:p-12 max-w-4xl mx-auto shadow-none print:p-0 print:max-w-none text-xs sm:text-sm leading-relaxed">
      {/* Header - Centered & Clean (No Photo for ATS) */}
      <header className="text-center pb-3 mb-4 border-b border-black">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-normal uppercase text-black">
          {personal.name || "Candidate Name"}
        </h1>

        {personal.title && (
          <p className="text-sm font-semibold text-black mt-0.5">
            {personal.title}
          </p>
        )}

        {contactItems.length > 0 && (
          <p className="text-xs text-black mt-1.5 space-x-2">
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && <span className="text-black mx-1">|</span>}
                {item.startsWith("http") || item.includes("@") ? (
                  <a
                    href={item.includes("@") ? `mailto:${item}` : item}
                    className="text-black underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                ) : (
                  <span>{item}</span>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-black text-justify leading-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills */}
      {(flatSkills.length > 0 || Object.values(skillsObj).some((arr) => arr?.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1 text-black">
            {skillsObj.technical?.length > 0 && (
              <p>
                <strong>Languages:</strong> {skillsObj.technical.join(", ")}
              </p>
            )}
            {skillsObj.frameworks?.length > 0 && (
              <p>
                <strong>Frameworks & Libraries:</strong> {skillsObj.frameworks.join(", ")}
              </p>
            )}
            {skillsObj.tools?.length > 0 && (
              <p>
                <strong>Developer Tools & Platforms:</strong> {skillsObj.tools.join(", ")}
              </p>
            )}
            {skillsObj.soft?.length > 0 && (
              <p>
                <strong>Core Competencies:</strong> {skillsObj.soft.join(", ")}
              </p>
            )}
            {!skillsObj.technical?.length && flatSkills.length > 0 && (
              <p>
                <strong>Skills:</strong> {flatSkills.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Work Experience & Internships */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-black">
                  <span>
                    {exp.role || "Role"}
                    {exp.company && <span> — {exp.company}</span>}
                    {exp.is_internship && <span> (Internship)</span>}
                  </span>
                  <span>{exp.duration || ""}</span>
                </div>

                {exp.location && (
                  <p className="text-xs italic text-black">{exp.location}</p>
                )}

                {exp.description && (
                  <p className="text-black mt-1 text-justify">
                    {exp.description}
                  </p>
                )}

                {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                )}

                {exp.technologies && (
                  <p className="text-xs mt-1">
                    <strong>Technologies:</strong>{" "}
                    {Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Technical Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-black">
                  <span>
                    {proj.title}
                    {proj.subtitle && <span className="font-normal text-xs"> — {proj.subtitle}</span>}
                  </span>
                  <span className="text-xs font-normal">
                    {proj.link && (
                      <a href={proj.link} className="underline mr-2" target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} className="underline mr-2" target="_blank" rel="noreferrer">
                        Code
                      </a>
                    )}
                    {proj.duration || ""}
                  </span>
                </div>

                {proj.description && (
                  <p className="text-black text-justify mt-0.5">
                    {proj.description}
                  </p>
                )}

                {proj.technologies && (
                  <p className="text-xs mt-0.5">
                    <strong>Tech Stack:</strong>{" "}
                    {Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-black">
                  <span>
                    {edu.degree || "Degree"}
                    {edu.institution && <span>, {edu.institution}</span>}
                  </span>
                  <span>{edu.year || ""}</span>
                </div>
                {edu.location && <p className="text-xs italic">{edu.location}</p>}
                {edu.score && <p className="text-xs">Grade/GPA: {edu.score}</p>}
                {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                  <p className="text-xs">
                    <strong>Key Coursework:</strong> {edu.coursework.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {(certificates.length > 0 || achievements.length > 0) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Certifications & Honors
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-black">
            {certificates.map((cert, idx) => (
              <li key={`cert-${idx}`}>
                <strong>{cert.name}</strong>
                {cert.issuer && ` — ${cert.issuer}`}
                {cert.year && ` (${cert.year})`}
              </li>
            ))}
            {achievements.map((ach, idx) => (
              <li key={`ach-${idx}`}>
                {typeof ach === "string" ? ach : ach?.title || ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Languages
          </h2>
          <p className="text-black">
            {languages.map((l, i) => (
              <span key={i}>
                {i > 0 && ", "}
                <strong>{l.name}</strong> {l.level && `(${l.level})`}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.length > 0 && (
        <div className="space-y-3">
          {customSections.map((sec, sIdx) => (
            <section key={sIdx}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                {sec.heading}
              </h2>
              <div className="space-y-2">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx}>
                    <div className="flex justify-between font-semibold">
                      <span>{it.title}</span>
                      {it.date && <span className="font-normal text-xs">{it.date}</span>}
                    </div>
                    {it.subtitle && <p className="text-xs italic">{it.subtitle}</p>}
                    {it.description && <p className="text-xs mt-0.5">{it.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
