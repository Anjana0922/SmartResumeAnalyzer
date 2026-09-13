import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

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

export default function ClassicTemplate({ resume }) {
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

  const photoUrl = personal.photo
    ? personal.photo.startsWith("http")
      ? personal.photo
      : `http://localhost:5000${personal.photo}`
    : null;

  return (
    <div className="resume-print-root bg-white text-slate-900 font-serif px-10 py-9 w-[794px] min-h-[1123px] mx-auto text-sm leading-normal box-border">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-5 flex flex-row items-center justify-between gap-4 resume-section-block pdf-avoid-break">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 uppercase font-sans">
            {personal.name || "Candidate Name"}
          </h1>
          {personal.title && (
            <p className="text-base text-slate-700 font-medium font-sans mt-0.5">
              {personal.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-sans mt-2.5">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} className="text-slate-500" />
                <a href={`mailto:${personal.email}`} className="hover:underline">{personal.email}</a>
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} className="text-slate-500" />
                {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-500" />
                {personal.location}
              </span>
            )}
            {personal.portfolio_url && (
              <span className="flex items-center gap-1">
                <Globe size={12} className="text-slate-500" />
                <a href={personal.portfolio_url} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline">
                  Portfolio
                </a>
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1">
                <ExternalLink size={12} className="text-slate-500" />
                <a href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline">
                  LinkedIn
                </a>
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1">
                <ExternalLink size={12} className="text-slate-500" />
                <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline">
                  GitHub
                </a>
              </span>
            )}
          </div>
        </div>

        {photoUrl && (
          <div className="shrink-0 ml-4">
            <img
              src={photoUrl}
              alt={personal.name || "Candidate"}
              crossOrigin="anonymous"
              className="w-24 h-24 object-cover rounded-lg border-2 border-slate-300 shadow-sm"
              style={{ width: "96px", height: "96px", objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      {/* Summary / About */}
      {summary && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans resume-section-header pdf-avoid-break">
            Professional Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-sans resume-section-header pdf-avoid-break">
            Experience & Work History
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => {
              const empType = exp.employment_type || (exp.is_internship ? "Internship" : null);
              return (
                <div key={idx} className="resume-entry pdf-avoid-break">
                  <div className="flex flex-row items-baseline justify-between font-sans">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {exp.role || "Role"}
                      </span>
                      {exp.company && (
                        <span className="text-slate-700 font-medium"> — {exp.company}</span>
                      )}
                      {empType && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                          {empType}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 shrink-0">
                      {exp.duration || ""}
                      {exp.location ? ` | ${exp.location}` : ""}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-slate-800 mt-1 text-xs leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && (
                    <div className="mt-1 text-xs text-slate-800">
                      {Array.isArray(exp.responsibilities) ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {exp.responsibilities.filter(Boolean).map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="leading-relaxed">{exp.responsibilities}</p>
                      )}
                    </div>
                  )}

                  {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-800">
                      {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}

                  {exp.achievements && (
                    <div className="mt-1 text-xs text-slate-800">
                      {Array.isArray(exp.achievements) ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {exp.achievements.filter(Boolean).map((ach, aIdx) => (
                            <li key={aIdx}><strong className="text-slate-900">Achievement:</strong> {ach}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="leading-relaxed"><strong className="text-slate-900">Key Achievement:</strong> {exp.achievements}</p>
                      )}
                    </div>
                  )}

                  {exp.technologies && (
                    <p className="text-xs text-slate-600 font-sans mt-1">
                      <strong className="text-slate-700">Skills / Tools:</strong>{" "}
                      {Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-sans resume-section-header pdf-avoid-break">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break font-sans">
                <div className="flex flex-row items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {edu.degree || "Degree"}
                    </span>
                    {edu.institution && (
                      <span className="text-slate-700 font-medium">, {edu.institution}</span>
                    )}
                    {edu.board && (
                      <span className="text-slate-600 text-xs ml-1.5">(Board/Council: {edu.board})</span>
                    )}
                    {edu.score && (
                      <span className="text-slate-600 text-xs ml-2">Grade: {edu.score}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 shrink-0">
                    {edu.year || ""}
                    {edu.location ? ` | ${edu.location}` : ""}
                  </div>
                </div>

                {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Coursework / Specialization:</strong> {edu.coursework.join(", ")}
                  </p>
                )}

                {edu.additional_details && (
                  <p className="text-xs text-slate-700 font-serif mt-0.5 leading-relaxed">
                    {edu.additional_details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(flatSkills.length > 0 || skillCategories.length > 0) && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans resume-section-header pdf-avoid-break">
            Skills & Expertise
          </h2>
          <div className="space-y-1.5 font-sans text-xs text-slate-800">
            {skillCategories.length > 0 ? (
              skillCategories.map(([catKey, skills]) => (
                <p key={catKey}>
                  <strong className="text-slate-900">{formatCategoryTitle(catKey)}:</strong>{" "}
                  {skills.join(", ")}
                </p>
              ))
            ) : flatSkills.length > 0 ? (
              <p>
                <strong className="text-slate-900">Skills:</strong>{" "}
                {flatSkills.join(", ")}
              </p>
            ) : null}
          </div>
        </section>
      )}

      {/* Projects / Professional Work */}
      {projects.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-sans resume-section-header pdf-avoid-break">
            Projects & Professional Work
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break">
                <div className="flex flex-row items-baseline justify-between font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {proj.title || "Project Title"}
                    </span>
                    {proj.subtitle && (
                      <span className="text-xs text-slate-600">({proj.subtitle})</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3 shrink-0">
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline inline-flex items-center gap-0.5">
                        Link <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline inline-flex items-center gap-0.5">
                        Code <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.duration && <span>{proj.duration}</span>}
                  </div>
                </div>

                {(proj.role || proj.organization) && (
                  <p className="text-xs font-medium text-slate-700 font-sans mt-0.5">
                    {proj.role}
                    {proj.role && proj.organization && " — "}
                    {proj.organization}
                  </p>
                )}

                {proj.description && (
                  <p className="text-slate-800 text-xs mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {proj.responsibilities && (
                  <div className="mt-1 text-xs text-slate-800">
                    {Array.isArray(proj.responsibilities) ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {proj.responsibilities.filter(Boolean).map((resp, rIdx) => (
                          <li key={rIdx}>{resp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="leading-relaxed">{proj.responsibilities}</p>
                    )}
                  </div>
                )}

                {proj.outcomes && (
                  <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                    <strong className="text-slate-900 font-sans">Outcomes / Impact:</strong> {proj.outcomes}
                  </p>
                )}

                {proj.technologies && (
                  <p className="text-xs text-slate-600 font-sans mt-0.5">
                    <strong className="text-slate-700">Tools / Methodologies:</strong>{" "}
                    {Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements in two columns */}
      {(certificates.length > 0 || achievements.length > 0) && (
        <div className="flex flex-row gap-6 mb-5 resume-section-block">
          {certificates.length > 0 && (
            <section className="flex-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans resume-section-header pdf-avoid-break">
                Certifications & Credentials
              </h2>
              <ul className="space-y-1.5 font-sans text-xs text-slate-800">
                {certificates.map((cert, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold">{cert.name || "Certification"}</span>
                      {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                    </div>
                    {cert.year && <span className="text-xs text-slate-500 shrink-0">{cert.year}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {achievements.length > 0 && (
            <section className="flex-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans resume-section-header pdf-avoid-break">
                Honors & Achievements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{typeof ach === "string" ? ach : ach?.title || ""}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Languages & Custom Sections */}
      {languages.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans resume-section-header pdf-avoid-break">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4 font-sans text-xs text-slate-800">
            {languages.map((lang, idx) => (
              <span key={idx}>
                <strong>{lang.name}</strong> {lang.level && `(${lang.level})`}
              </span>
            ))}
          </div>
        </section>
      )}

      {customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((sec, sIdx) => (
            <section key={sIdx} className="resume-section-block">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans resume-section-header pdf-avoid-break">
                {sec.heading}
              </h2>
              <div className="space-y-2">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx} className="font-sans text-xs resume-entry pdf-avoid-break">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{it.title}</span>
                      {it.date && <span className="text-xs text-slate-500 font-normal shrink-0">{it.date}</span>}
                    </div>
                    {it.subtitle && <p className="text-slate-600 text-xs">{it.subtitle}</p>}
                    {it.description && <p className="text-slate-800 font-serif mt-0.5">{it.description}</p>}
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
