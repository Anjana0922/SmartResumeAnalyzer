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

export default function TwoColumnTemplate({ resume }) {
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
    <div className="resume-print-root bg-white text-slate-800 font-sans w-[794px] min-h-[1123px] mx-auto text-sm leading-normal flex flex-row box-border">
      {/* Left Sidebar (270px) */}
      <aside className="w-[270px] shrink-0 bg-slate-50 border-r border-slate-200 p-6 flex flex-col justify-between box-border">
        <div className="space-y-5">
          {/* Photo */}
          {photoUrl && (
            <div className="flex justify-center mb-3">
              <img
                src={photoUrl}
                alt={personal.name || "Candidate"}
                crossOrigin="anonymous"
                className="w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-md"
                style={{ width: "112px", height: "112px", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Contact Details */}
          <div className="resume-section-block">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-2.5 resume-section-header pdf-avoid-break">
              Contact Info
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {personal.email && (
                <li className="flex items-start gap-2 break-all">
                  <Mail size={13} className="text-slate-500 shrink-0 mt-0.5" />
                  <a href={`mailto:${personal.email}`} className="hover:text-purple-700">{personal.email}</a>
                </li>
              )}
              {personal.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-500 shrink-0" />
                  <span>{personal.phone}</span>
                </li>
              )}
              {personal.location && (
                <li className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-500 shrink-0" />
                  <span>{personal.location}</span>
                </li>
              )}
              {personal.portfolio_url && (
                <li className="flex items-center gap-2">
                  <Globe size={13} className="text-slate-500 shrink-0" />
                  <a href={personal.portfolio_url} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline truncate">
                    Portfolio
                  </a>
                </li>
              )}
              {personal.linkedin && (
                <li className="flex items-center gap-2">
                  <ExternalLink size={13} className="text-slate-500 shrink-0" />
                  <a href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline truncate">
                    LinkedIn
                  </a>
                </li>
              )}
              {personal.github && (
                <li className="flex items-center gap-2">
                  <ExternalLink size={13} className="text-slate-500 shrink-0" />
                  <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline truncate">
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Categorized Skills */}
          {(flatSkills.length > 0 || skillCategories.length > 0) && (
            <div className="resume-section-block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-2.5 resume-section-header pdf-avoid-break">
                Skills & Expertise
              </h3>
              <div className="space-y-2.5 text-xs">
                {skillCategories.length > 0 ? (
                  skillCategories.map(([catKey, skills]) => (
                    <div key={catKey} className="resume-entry pdf-avoid-break">
                      <span className="font-semibold text-slate-900 block mb-1">
                        {formatCategoryTitle(catKey)}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : flatSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1 resume-entry pdf-avoid-break">
                    {flatSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="resume-section-block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-2 resume-section-header pdf-avoid-break">
                Languages
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                {languages.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium text-slate-900">{l.name}</span>
                    {l.level && <span className="text-slate-500 text-[11px]">{l.level}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in sidebar */}
          {certificates.length > 0 && (
            <div className="resume-section-block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-2 resume-section-header pdf-avoid-break">
                Certifications
              </h3>
              <div className="space-y-2 text-xs">
                {certificates.map((c, i) => (
                  <div key={i} className="resume-entry pdf-avoid-break">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-slate-500 text-[11px]">{c.issuer} {c.year && `· ${c.year}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 text-[10px] text-slate-500 border-t border-slate-200">
          Generated via SmartResume
        </div>
      </aside>

      {/* Right Content Area (524px) */}
      <main className="w-[524px] flex-1 p-7 space-y-5 box-border">
        {/* Name & Title Header */}
        <div className="border-b-2 border-purple-600 pb-3 resume-section-block pdf-avoid-break">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            {personal.name || "Candidate Name"}
          </h1>
          {personal.title && (
            <p className="text-base text-purple-700 font-semibold mt-0.5">
              {personal.title}
            </p>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <section className="resume-section-block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 resume-section-header pdf-avoid-break">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Professional Profile
            </h2>
            <p className="text-slate-700 text-xs leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5 resume-section-header pdf-avoid-break">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Experience & Work History
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp, idx) => {
                const empType = exp.employment_type || (exp.is_internship ? "Intern" : null);
                return (
                  <div key={idx} className="relative pl-3 border-l-2 border-purple-200 resume-entry pdf-avoid-break">
                    <div className="flex flex-row items-baseline justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {exp.role || "Role"}
                        </span>
                        {exp.company && (
                          <span className="text-slate-600 text-xs font-medium"> @ {exp.company}</span>
                        )}
                        {empType && (
                          <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                            {empType}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">
                        {exp.duration || ""}
                        {exp.location ? ` | ${exp.location}` : ""}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {exp.responsibilities && (
                      <div className="mt-1 text-xs text-slate-700">
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
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-700">
                        {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                          <li key={hIdx}>{hl}</li>
                        ))}
                      </ul>
                    )}

                    {exp.achievements && (
                      <div className="mt-1 text-xs text-slate-700">
                        {Array.isArray(exp.achievements) ? (
                          <ul className="list-disc list-inside space-y-0.5">
                            {exp.achievements.filter(Boolean).map((ach, aIdx) => (
                              <li key={aIdx}><strong className="text-slate-900">Achievement:</strong> {ach}</li>
                            ))}
                          </ul>
                        ) : (
                          <p><strong className="text-slate-900">Achievement:</strong> {exp.achievements}</p>
                        )}
                      </div>
                    )}

                    {exp.technologies && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        <strong>Skills / Tools:</strong>{" "}
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
          <section className="resume-section-block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5 resume-section-header pdf-avoid-break">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="relative pl-3 border-l-2 border-purple-200 resume-entry pdf-avoid-break">
                  <div className="flex flex-row items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {edu.degree || "Degree"}
                      </span>
                      {edu.institution && (
                        <span className="text-slate-600 text-xs font-medium">, {edu.institution}</span>
                      )}
                      {edu.board && (
                        <span className="text-slate-500 text-xs ml-1">(Board: {edu.board})</span>
                      )}
                      {edu.score && (
                        <span className="text-xs text-slate-500 ml-1.5">Grade: {edu.score}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{edu.year || ""}</span>
                  </div>
                  {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      Coursework: {edu.coursework.join(", ")}
                    </p>
                  )}
                  {edu.additional_details && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {edu.additional_details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Professional Work */}
        {projects.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5 resume-section-header pdf-avoid-break">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Projects & Professional Work
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 resume-entry pdf-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">
                      {proj.title}
                    </span>
                    <div className="flex gap-2 text-xs shrink-0">
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-purple-700 font-medium hover:underline inline-flex items-center gap-0.5 text-[11px]">
                          Link <ExternalLink size={9} />
                        </a>
                      )}
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-purple-700 font-medium hover:underline inline-flex items-center gap-0.5 text-[11px]">
                          Code <ExternalLink size={9} />
                        </a>
                      )}
                      {proj.duration && <span className="text-slate-500 text-[11px]">{proj.duration}</span>}
                    </div>
                  </div>
                  {(proj.role || proj.organization) && (
                    <p className="text-xs text-purple-700 font-medium mt-0.5">
                      {proj.role}{proj.role && proj.organization ? " — " : ""}{proj.organization}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                  {proj.responsibilities && (
                    <div className="mt-1 text-xs text-slate-600">
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
                    <p className="text-xs text-slate-800 mt-1">
                      <strong className="text-slate-900">Outcomes:</strong> {proj.outcomes}
                    </p>
                  )}
                  {proj.technologies && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      {Array.isArray(proj.technologies) ? proj.technologies.join(" · ") : proj.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 resume-section-header pdf-avoid-break">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Honors & Achievements
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              {achievements.map((ach, idx) => (
                <li key={idx}>{typeof ach === "string" ? ach : ach?.title || ""}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Custom Sections */}
        {customSections.length > 0 && (
          <div className="space-y-4">
            {customSections.map((sec, sIdx) => (
              <section key={sIdx} className="resume-section-block">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 resume-section-header pdf-avoid-break">
                  <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
                  {sec.heading}
                </h2>
                <div className="space-y-2">
                  {sec.items?.map((it, iIdx) => (
                    <div key={iIdx} className="text-xs resume-entry pdf-avoid-break">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{it.title}</span>
                        {it.date && <span className="text-slate-500 font-normal shrink-0">{it.date}</span>}
                      </div>
                      {it.subtitle && <p className="text-slate-600">{it.subtitle}</p>}
                      {it.description && <p className="text-slate-700 mt-0.5">{it.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
