import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, Briefcase, GraduationCap, Award, FolderGit2, Languages as LanguagesIcon } from "lucide-react";

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

export default function CreativeTemplate({ resume }) {
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
    <div className="resume-print-root bg-white text-slate-800 font-sans w-[794px] min-h-[1123px] mx-auto text-sm leading-normal box-border">
      {/* Vibrant Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white px-8 py-7 relative resume-section-block pdf-avoid-break">
        <div className="flex flex-row items-center justify-between gap-6">
          <div className="text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
              <Sparkles size={12} />
              <span>{metadata.career_target || metadata.user_category || "Professional"}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {personal.name || "Candidate Name"}
            </h1>

            {personal.title && (
              <p className="text-base text-purple-200 font-medium mt-1">
                {personal.title}
              </p>
            )}

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-200">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5">
                  <Mail size={12} className="text-purple-300" />
                  {personal.email}
                </a>
              )}
              {personal.phone && (
                <span className="px-3 py-1 rounded-lg bg-white/10 flex items-center gap-1.5">
                  <Phone size={12} className="text-purple-300" />
                  {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className="px-3 py-1 rounded-lg bg-white/10 flex items-center gap-1.5">
                  <MapPin size={12} className="text-purple-300" />
                  {personal.location}
                </span>
              )}
              {personal.portfolio_url && (
                <a href={personal.portfolio_url} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 font-medium transition flex items-center gap-1.5">
                  <Globe size={12} />
                  Portfolio
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-purple-300" />
                  LinkedIn
                </a>
              )}
              {personal.github && (
                <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-purple-300" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {photoUrl && (
            <div className="shrink-0 ml-4">
              <img
                src={photoUrl}
                alt={personal.name || "Candidate"}
                crossOrigin="anonymous"
                className="w-28 h-28 object-cover rounded-2xl border-4 border-white/20 shadow-xl"
                style={{ width: "108px", height: "108px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="px-8 py-6 space-y-5 box-border">
        {/* Summary */}
        {summary && (
          <section className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 resume-section-block pdf-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1.5 flex items-center gap-1.5 resume-section-header">
              <Sparkles size={14} className="text-purple-600" />
              Professional Overview
            </h2>
            <p className="text-slate-700 text-xs leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience Cards */}
        {experience.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-sm font-bold text-slate-900 mb-3 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
              <Briefcase size={16} className="text-purple-600" />
              Experience & Work History
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => {
                const empType = exp.employment_type || (exp.is_internship ? "Internship" : null);
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 resume-entry pdf-avoid-break">
                    <div className="flex flex-row items-baseline justify-between gap-1">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {exp.role || "Role"}
                        </span>
                        {exp.company && (
                          <span className="text-purple-700 font-semibold ml-1">· {exp.company}</span>
                        )}
                        {empType && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            {empType}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-500 shrink-0">
                        {exp.duration || ""} {exp.location ? `(${exp.location})` : ""}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-slate-700 text-xs mt-1.5 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {exp.responsibilities && (
                      <div className="mt-1.5 text-xs text-slate-700">
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
                      <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-xs text-slate-700">
                        {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                          <li key={hIdx}>{hl}</li>
                        ))}
                      </ul>
                    )}

                    {exp.achievements && (
                      <div className="mt-1.5 text-xs text-slate-700">
                        {Array.isArray(exp.achievements) ? (
                          <ul className="list-disc list-inside space-y-0.5">
                            {exp.achievements.filter(Boolean).map((ach, aIdx) => (
                              <li key={aIdx}><strong className="text-purple-900">Achievement:</strong> {ach}</li>
                            ))}
                          </ul>
                        ) : (
                          <p><strong className="text-purple-900">Achievement:</strong> {exp.achievements}</p>
                        )}
                      </div>
                    )}

                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-200/60">
                        {(Array.isArray(exp.technologies) ? exp.technologies : exp.technologies.split(",")).map((t, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
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

        {/* Skills Category Grid */}
        {(flatSkills.length > 0 || skillCategories.length > 0) && (
          <section className="resume-section-block">
            <h2 className="text-sm font-bold text-slate-900 mb-3 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
              <Sparkles size={16} className="text-purple-600" />
              Skills & Competencies
            </h2>
            <div className="flex flex-row flex-wrap gap-3.5">
              {skillCategories.length > 0 ? (
                skillCategories.map(([catKey, skills]) => (
                  <div key={catKey} className="w-[350px] p-3 rounded-xl bg-slate-50 border border-slate-200 resume-entry pdf-avoid-break">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1.5">
                      {formatCategoryTitle(catKey)}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-purple-100 text-purple-950 font-medium text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : flatSkills.length > 0 ? (
                <div className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 resume-entry pdf-avoid-break">
                  <div className="flex flex-wrap gap-1">
                    {flatSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-purple-100 text-purple-950 font-medium text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* Projects Cards */}
        {projects.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-sm font-bold text-slate-900 mb-3 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
              <FolderGit2 size={16} className="text-purple-600" />
              Projects & Professional Work
            </h2>
            <div className="flex flex-row flex-wrap gap-3.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="w-[350px] p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between resume-entry pdf-avoid-break">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {proj.title}
                      </h3>
                      {proj.duration && <span className="text-[11px] text-slate-500 shrink-0">{proj.duration}</span>}
                    </div>
                    {proj.subtitle && <p className="text-xs text-purple-700 font-medium mb-0.5">{proj.subtitle}</p>}
                    {(proj.role || proj.organization) && (
                      <p className="text-xs text-slate-700 font-medium mb-1">
                        {proj.role}{proj.role && proj.organization ? " — " : ""}{proj.organization}
                      </p>
                    )}
                    {proj.description && <p className="text-slate-600 text-xs leading-relaxed mb-2">{proj.description}</p>}
                    {proj.responsibilities && (
                      <div className="mb-2 text-xs text-slate-600">
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
                      <p className="text-xs text-slate-800 mb-2 font-medium">
                        <strong className="text-purple-900">Outcomes:</strong> {proj.outcomes}
                      </p>
                    )}
                  </div>

                  <div>
                    {proj.technologies && (
                      <p className="text-[11px] text-slate-500 mb-2 font-medium">
                        {Array.isArray(proj.technologies) ? proj.technologies.join(" · ") : proj.technologies}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs pt-1.5 border-t border-slate-200/60">
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-purple-700 font-semibold hover:underline inline-flex items-center gap-1">
                          Link <ExternalLink size={10} />
                        </a>
                      )}
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1">
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

        {/* Education & Certifications */}
        <div className="flex flex-row gap-4 resume-section-block">
          {education.length > 0 && (
            <section className="flex-1">
              <h2 className="text-sm font-bold text-slate-900 mb-2.5 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
                <GraduationCap size={16} className="text-purple-600" />
                Education
              </h2>
              <div className="space-y-2.5">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 resume-entry pdf-avoid-break">
                    <p className="font-bold text-slate-900 text-sm">{edu.degree}</p>
                    <p className="text-xs text-slate-700">
                      {edu.institution} {edu.board && `(Board: ${edu.board})`} {edu.year && `· ${edu.year}`}
                    </p>
                    {edu.score && <p className="text-xs text-purple-700 font-medium mt-0.5">Grade: {edu.score}</p>}
                    {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                      <p className="text-[11px] text-slate-500 mt-1">Coursework: {edu.coursework.join(", ")}</p>
                    )}
                    {edu.additional_details && (
                      <p className="text-[11px] text-slate-600 mt-0.5">{edu.additional_details}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certificates.length > 0 && (
            <section className="flex-1">
              <h2 className="text-sm font-bold text-slate-900 mb-2.5 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
                <Award size={16} className="text-purple-600" />
                Certifications & Credentials
              </h2>
              <div className="space-y-2">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center resume-entry pdf-avoid-break">
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{cert.name}</p>
                      <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                    </div>
                    {cert.year && <span className="text-xs text-slate-400 shrink-0">{cert.year}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Achievements & Languages */}
        <div className="flex flex-row gap-4 resume-section-block">
          {achievements.length > 0 && (
            <section className="flex-1">
              <h2 className="text-sm font-bold text-slate-900 mb-2.5 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
                <Award size={16} className="text-purple-600" />
                Honors & Achievements
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{typeof ach === "string" ? ach : ach?.title || ""}</li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section className="flex-1">
              <h2 className="text-sm font-bold text-slate-900 mb-2.5 pb-1.5 border-b-2 border-purple-500/20 flex items-center gap-2 resume-section-header pdf-avoid-break">
                <LanguagesIcon size={16} className="text-purple-600" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {languages.map((l, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                    <strong>{l.name}</strong> {l.level && `(${l.level})`}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Custom Sections */}
        {customSections.length > 0 && (
          <div className="space-y-4">
            {customSections.map((sec, sIdx) => (
              <section key={sIdx} className="resume-section-block">
                <h2 className="text-sm font-bold text-slate-900 mb-2.5 pb-1.5 border-b-2 border-purple-500/20 resume-section-header pdf-avoid-break">
                  {sec.heading}
                </h2>
                <div className="flex flex-row flex-wrap gap-3">
                  {sec.items?.map((it, iIdx) => (
                    <div key={iIdx} className="w-[350px] p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs resume-entry pdf-avoid-break">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{it.title}</span>
                        {it.date && <span className="text-slate-500 font-normal shrink-0">{it.date}</span>}
                      </div>
                      {it.subtitle && <p className="text-purple-700">{it.subtitle}</p>}
                      {it.description && <p className="text-slate-600 mt-1">{it.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
