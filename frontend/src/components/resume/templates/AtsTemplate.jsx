import React from "react";

const formatCategoryTitle = (key) => {
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
};

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

  const skillCategories = typeof skillsObj === "object" && !Array.isArray(skillsObj)
    ? Object.entries(skillsObj).filter(
        ([key, val]) => key !== "all" && Array.isArray(val) && val.length > 0
      )
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
    <div className="resume-print-root bg-white text-black font-sans px-10 py-8 w-[794px] min-h-[1123px] mx-auto text-xs leading-relaxed box-border">
      {/* Header - Centered & Clean (No Photo for ATS) */}
      <header className="text-center pb-3 mb-4 border-b border-black resume-section-block pdf-avoid-break">
        <h1 className="text-2xl font-bold tracking-normal uppercase text-black">
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
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 resume-section-header pdf-avoid-break">
            Professional Summary
          </h2>
          <p className="text-black text-justify leading-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Skills & Competencies */}
      {(flatSkills.length > 0 || skillCategories.length > 0) && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 resume-section-header pdf-avoid-break">
            Skills & Competencies
          </h2>
          <div className="space-y-1 text-black">
            {skillCategories.length > 0 ? (
              skillCategories.map(([catKey, skills]) => (
                <p key={catKey}>
                  <strong>{formatCategoryTitle(catKey)}:</strong> {skills.join(", ")}
                </p>
              ))
            ) : flatSkills.length > 0 ? (
              <p>
                <strong>Skills:</strong> {flatSkills.join(", ")}
              </p>
            ) : null}
          </div>
        </section>
      )}

      {/* Experience & Work History */}
      {experience.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 resume-section-header pdf-avoid-break">
            Professional Experience & Work History
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => {
              const empType = exp.employment_type || (exp.is_internship ? "Internship" : null);
              return (
                <div key={idx} className="resume-entry pdf-avoid-break">
                  <div className="flex flex-row items-baseline justify-between font-bold text-black">
                    <span>
                      {exp.role || "Role"}
                      {exp.company && <span> — {exp.company}</span>}
                      {empType && <span> ({empType})</span>}
                    </span>
                    <span className="shrink-0">{exp.duration || ""}</span>
                  </div>

                  {exp.location && (
                    <p className="text-xs italic text-black">{exp.location}</p>
                  )}

                  {exp.description && (
                    <p className="text-black mt-1 text-justify">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && (
                    <div className="mt-1">
                      {Array.isArray(exp.responsibilities) ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {exp.responsibilities.filter(Boolean).map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{exp.responsibilities}</p>
                      )}
                    </div>
                  )}

                  {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}

                  {exp.achievements && (
                    <div className="mt-1">
                      {Array.isArray(exp.achievements) ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {exp.achievements.filter(Boolean).map((a, aIdx) => (
                            <li key={aIdx}><strong>Key Achievement:</strong> {a}</li>
                          ))}
                        </ul>
                      ) : (
                        <p><strong>Key Achievement:</strong> {exp.achievements}</p>
                      )}
                    </div>
                  )}

                  {exp.technologies && (
                    <p className="text-xs mt-1">
                      <strong>Skills & Tools:</strong>{" "}
                      {Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects / Professional Work */}
      {projects.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 resume-section-header pdf-avoid-break">
            Projects & Professional Work
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break">
                <div className="flex flex-row items-baseline justify-between font-bold text-black">
                  <span>
                    {proj.title}
                    {proj.subtitle && <span className="font-normal text-xs"> — {proj.subtitle}</span>}
                  </span>
                  <span className="text-xs font-normal shrink-0">
                    {proj.link && (
                      <a href={proj.link} className="underline mr-2" target="_blank" rel="noreferrer">
                        Link
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

                {(proj.role || proj.organization) && (
                  <p className="text-xs text-black font-semibold mt-0.5">
                    {proj.role}{proj.role && proj.organization ? " — " : ""}{proj.organization}
                  </p>
                )}

                {proj.description && (
                  <p className="text-black text-justify mt-0.5">
                    {proj.description}
                  </p>
                )}

                {proj.responsibilities && (
                  <div className="mt-0.5">
                    {Array.isArray(proj.responsibilities) ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {proj.responsibilities.filter(Boolean).map((r, rIdx) => (
                          <li key={rIdx}>{r}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{proj.responsibilities}</p>
                    )}
                  </div>
                )}

                {proj.outcomes && (
                  <p className="text-xs mt-0.5">
                    <strong>Outcomes:</strong> {proj.outcomes}
                  </p>
                )}

                {proj.technologies && (
                  <p className="text-xs mt-0.5">
                    <strong>Tools / Methods:</strong>{" "}
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
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 resume-section-header pdf-avoid-break">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break">
                <div className="flex flex-row items-baseline justify-between font-bold text-black">
                  <span>
                    {edu.degree || "Degree"}
                    {edu.institution && <span>, {edu.institution}</span>}
                    {edu.board && <span> (Board: {edu.board})</span>}
                  </span>
                  <span className="shrink-0">{edu.year || ""}</span>
                </div>
                {edu.location && <p className="text-xs italic">{edu.location}</p>}
                {edu.score && <p className="text-xs">Grade/Score: {edu.score}</p>}
                {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                  <p className="text-xs">
                    <strong>Relevant Coursework:</strong> {edu.coursework.join(", ")}
                  </p>
                )}
                {edu.additional_details && (
                  <p className="text-xs mt-0.5">{edu.additional_details}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {(certificates.length > 0 || achievements.length > 0) && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 resume-section-header pdf-avoid-break">
            Certifications & Honors
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-black">
            {certificates.map((cert, idx) => (
              <li key={`cert-${idx}`} className="resume-entry pdf-avoid-break">
                <strong>{cert.name}</strong>
                {cert.issuer && ` — ${cert.issuer}`}
                {cert.year && ` (${cert.year})`}
              </li>
            ))}
            {achievements.map((ach, idx) => (
              <li key={`ach-${idx}`} className="resume-entry pdf-avoid-break">
                {typeof ach === "string" ? ach : ach?.title || ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 resume-section-header pdf-avoid-break">
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
            <section key={sIdx} className="resume-section-block">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 resume-section-header pdf-avoid-break">
                {sec.heading}
              </h2>
              <div className="space-y-2">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx} className="resume-entry pdf-avoid-break">
                    <div className="flex flex-row items-baseline justify-between font-semibold">
                      <span>{it.title}</span>
                      {it.date && <span className="font-normal text-xs shrink-0">{it.date}</span>}
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
