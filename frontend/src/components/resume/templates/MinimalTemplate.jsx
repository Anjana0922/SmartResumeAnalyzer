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

export default function MinimalTemplate({ resume }) {
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
    <div className="resume-print-root bg-zinc-50 text-zinc-900 font-sans px-10 py-9 w-[794px] min-h-[1123px] mx-auto text-sm leading-relaxed box-border">
      {/* Header */}
      <header className="pb-6 mb-6 border-b border-zinc-200 flex flex-row items-start justify-between gap-6 resume-section-block pdf-avoid-break">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
            <span className="text-xs uppercase tracking-widest text-zinc-600 font-medium">
              Curriculum Vitae
            </span>
          </div>

          <h1 className="text-3xl font-light tracking-tight text-zinc-950">
            {personal.name ? (
              <>
                <span className="font-semibold">{personal.name.split(" ")[0]}</span>{" "}
                {personal.name.split(" ").slice(1).join(" ")}
              </>
            ) : (
              "Candidate Name"
            )}
          </h1>

          {personal.title && (
            <p className="text-base text-zinc-600 font-normal mt-1 tracking-wide">
              {personal.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 mt-3.5">
            {personal.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={12} className="text-zinc-600" />
                <a href={`mailto:${personal.email}`} className="hover:text-zinc-900">{personal.email}</a>
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={12} className="text-zinc-600" />
                {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-zinc-600" />
                {personal.location}
              </span>
            )}
            {personal.portfolio_url && (
              <span className="flex items-center gap-1.5">
                <Globe size={12} className="text-zinc-600" />
                <a href={personal.portfolio_url} target="_blank" rel="noreferrer" className="text-zinc-900 hover:underline">
                  Portfolio
                </a>
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-zinc-600" />
                <a href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="text-zinc-900 hover:underline">
                  LinkedIn
                </a>
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-zinc-600" />
                <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="text-zinc-900 hover:underline">
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
              className="w-24 h-24 object-cover rounded-2xl border border-zinc-200 shadow-sm"
              style={{ width: "96px", height: "96px", objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      {/* Summary / About */}
      {summary && (
        <section className="mb-6 resume-section-block">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2 resume-section-header pdf-avoid-break">
            Professional Overview
          </h2>
          <p className="text-zinc-700 leading-relaxed text-sm font-normal text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6 resume-section-block">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3 resume-section-header pdf-avoid-break">
            Experience & Work History
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => {
              const empType = exp.employment_type || (exp.is_internship ? "Intern" : null);
              return (
                <div key={idx} className="relative pl-4 border-l border-zinc-200 resume-entry pdf-avoid-break">
                  <div className="flex flex-row items-baseline justify-between gap-1">
                    <div>
                      <span className="font-semibold text-zinc-900 text-sm">
                        {exp.role || "Role"}
                      </span>
                      {exp.company && (
                        <span className="text-zinc-500 font-normal"> · {exp.company}</span>
                      )}
                      {empType && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                          {empType}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">
                      {exp.duration || ""}
                      {exp.location ? ` | ${exp.location}` : ""}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-zinc-600 text-xs mt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && (
                    <div className="mt-1 text-xs text-zinc-600">
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
                    <ul className="mt-1.5 space-y-0.5 text-xs text-zinc-600 list-disc list-inside">
                      {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}

                  {exp.achievements && (
                    <div className="mt-1 text-xs text-zinc-600">
                      {Array.isArray(exp.achievements) ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {exp.achievements.filter(Boolean).map((ach, aIdx) => (
                            <li key={aIdx}><strong className="text-zinc-800">Achievement:</strong> {ach}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="leading-relaxed"><strong className="text-zinc-800">Achievement:</strong> {exp.achievements}</p>
                      )}
                    </div>
                  )}

                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(Array.isArray(exp.technologies)
                        ? exp.technologies
                        : exp.technologies.split(",")
                      ).map((t, tIdx) => (
                        <span key={tIdx} className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                          {String(t).trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6 resume-section-block">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3 resume-section-header pdf-avoid-break">
            Education
          </h2>
          <div className="space-y-3.5">
            {education.map((edu, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break">
                <div className="flex flex-row items-baseline justify-between">
                  <div>
                    <span className="font-semibold text-zinc-900 text-sm">
                      {edu.degree || "Degree"}
                    </span>
                    {edu.institution && (
                      <span className="text-zinc-600">, {edu.institution}</span>
                    )}
                    {edu.board && (
                      <span className="text-xs text-zinc-500 ml-1.5">(Board: {edu.board})</span>
                    )}
                    {edu.score && (
                      <span className="text-xs text-zinc-600 ml-2">Grade: {edu.score}</span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">
                    {edu.year || ""}
                    {edu.location ? ` · ${edu.location}` : ""}
                  </span>
                </div>

                {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Focus: {edu.coursework.join(", ")}
                  </p>
                )}

                {edu.additional_details && (
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
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
        <section className="mb-6 resume-section-block">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3 resume-section-header pdf-avoid-break">
            Core Competencies & Skills
          </h2>
          <div className="flex flex-row flex-wrap gap-4 text-xs">
            {skillCategories.length > 0 ? (
              skillCategories.map(([catKey, skills]) => (
                <div key={catKey} className="w-[340px] p-3 rounded-xl bg-white border border-zinc-200 resume-entry pdf-avoid-break">
                  <p className="font-semibold text-zinc-900 mb-1.5">{formatCategoryTitle(catKey)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : flatSkills.length > 0 ? (
              <div className="w-full p-3 rounded-xl bg-white border border-zinc-200 resume-entry pdf-avoid-break">
                <div className="flex flex-wrap gap-1.5">
                  {flatSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Projects / Professional Work */}
      {projects.length > 0 && (
        <section className="mb-6 resume-section-block">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3 resume-section-header pdf-avoid-break">
            Projects & Professional Work
          </h2>
          <div className="flex flex-row flex-wrap gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="w-[348px] p-4 rounded-xl bg-white border border-zinc-200 flex flex-col justify-between resume-entry pdf-avoid-break">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-zinc-900 text-sm">
                      {proj.title || "Project Title"}
                    </span>
                    {proj.duration && <span className="text-[11px] text-zinc-600 shrink-0">{proj.duration}</span>}
                  </div>
                  {proj.subtitle && (
                    <p className="text-xs text-zinc-500 mb-1">{proj.subtitle}</p>
                  )}
                  {(proj.role || proj.organization) && (
                    <p className="text-xs font-medium text-zinc-700 mb-1.5">
                      {proj.role}{proj.role && proj.organization ? " — " : ""}{proj.organization}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-zinc-600 text-xs leading-relaxed mb-2">
                      {proj.description}
                    </p>
                  )}
                  {proj.responsibilities && (
                    <div className="mb-2 text-xs text-zinc-600">
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
                    <p className="text-xs text-zinc-700 mb-2 leading-relaxed">
                      <strong className="text-zinc-900">Outcomes:</strong> {proj.outcomes}
                    </p>
                  )}
                </div>

                <div>
                  {proj.technologies && (
                    <p className="text-[11px] text-zinc-600 mb-2">
                      {Array.isArray(proj.technologies) ? proj.technologies.join(" · ") : proj.technologies}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs">
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-zinc-900 font-medium hover:underline inline-flex items-center gap-1">
                        Link <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1">
                        Code <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {(certificates.length > 0 || achievements.length > 0) && (
        <div className="flex flex-row gap-6 mb-6 resume-section-block">
          {certificates.length > 0 && (
            <section className="flex-1">
              <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2.5 resume-section-header pdf-avoid-break">
                Certifications & Credentials
              </h2>
              <div className="space-y-2 text-xs">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-baseline border-b border-zinc-100 pb-1">
                    <div>
                      <span className="font-medium text-zinc-800">{cert.name}</span>
                      {cert.issuer && <span className="text-zinc-500 text-[11px]"> · {cert.issuer}</span>}
                    </div>
                    <span className="text-zinc-600 shrink-0">{cert.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {achievements.length > 0 && (
            <section className="flex-1">
              <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2.5 resume-section-header pdf-avoid-break">
                Honors & Achievements
              </h2>
              <ul className="space-y-1.5 text-xs text-zinc-600 list-disc list-inside">
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
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2 resume-section-header pdf-avoid-break">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-700">
            {languages.map((l, i) => (
              <span key={i}>
                <span className="font-medium text-zinc-900">{l.name}</span>{" "}
                {l.level && <span className="text-zinc-600">({l.level})</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {customSections.length > 0 && (
        <div className="space-y-5">
          {customSections.map((sec, sIdx) => (
            <section key={sIdx} className="resume-section-block">
              <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2.5 resume-section-header pdf-avoid-break">
                {sec.heading}
              </h2>
              <div className="space-y-2.5">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx} className="text-xs resume-entry pdf-avoid-break">
                    <div className="flex justify-between font-medium text-zinc-800">
                      <span>{it.title}</span>
                      {it.date && <span className="text-zinc-600 shrink-0">{it.date}</span>}
                    </div>
                    {it.subtitle && <p className="text-zinc-600">{it.subtitle}</p>}
                    {it.description && <p className="text-zinc-700 mt-0.5">{it.description}</p>}
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
