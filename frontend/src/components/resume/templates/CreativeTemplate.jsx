import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, Briefcase, GraduationCap, Code2, FolderGit2, Award, Languages as LanguagesIcon } from "lucide-react";

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

  const photoUrl = personal.photo
    ? personal.photo.startsWith("http")
      ? personal.photo
      : `http://localhost:5000${personal.photo}`
    : null;

  return (
    <div className="bg-white text-slate-800 font-sans max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none text-sm leading-normal">
      {/* Vibrant Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-10 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
              <Sparkles size={12} />
              <span>{metadata.user_category || "Creative Professional"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {personal.name || "Candidate Name"}
            </h1>

            {personal.title && (
              <p className="text-base sm:text-lg text-purple-200 font-medium mt-1">
                {personal.title}
              </p>
            )}

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-4 text-xs text-slate-200">
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
              {personal.github && (
                <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-purple-300" />
                  GitHub
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-purple-300" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {photoUrl && (
            <div className="shrink-0">
              <img
                src={photoUrl}
                alt={personal.name || "Candidate"}
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-4 border-white/20 shadow-xl"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-8">
        {/* Summary */}
        {summary && (
          <section className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-purple-600" />
              About Me
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {summary}
            </p>
          </section>
        )}

        {/* Experience Cards */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
              <Briefcase size={18} className="text-purple-600" />
              Experience & Internships
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-purple-200 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {exp.role || "Role"}
                      </span>
                      {exp.company && (
                        <span className="text-purple-700 font-semibold ml-1">· {exp.company}</span>
                      )}
                      {exp.is_internship && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          Internship
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {exp.duration || ""} {exp.location ? `(${exp.location})` : ""}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-0.5 text-xs text-slate-700">
                      {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
                      {(Array.isArray(exp.technologies) ? exp.technologies : exp.technologies.split(",")).map((t, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {String(t).trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Category Grid */}
        {(flatSkills.length > 0 || Object.values(skillsObj).some((arr) => arr?.length > 0)) && (
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
              <Code2 size={18} className="text-purple-600" />
              Skills & Tech Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillsObj.technical?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
                    Languages & Core
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsObj.technical.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-950 font-medium text-xs shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillsObj.frameworks?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
                    Frameworks & Libraries
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsObj.frameworks.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-950 font-medium text-xs shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillsObj.tools?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
                    Tools & Platforms
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsObj.tools.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-950 font-medium text-xs shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillsObj.soft?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
                    Professional Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsObj.soft.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-950 font-medium text-xs shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!skillsObj.technical?.length && flatSkills.length > 0 && (
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-wrap gap-1.5">
                    {flatSkills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-950 font-medium text-xs shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Projects Cards */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
              <FolderGit2 size={18} className="text-purple-600" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {proj.title}
                      </h3>
                      {proj.duration && <span className="text-[11px] text-slate-500">{proj.duration}</span>}
                    </div>
                    {proj.subtitle && <p className="text-xs text-purple-700 font-medium mb-1.5">{proj.subtitle}</p>}
                    {proj.description && <p className="text-slate-600 text-xs leading-relaxed mb-3">{proj.description}</p>}
                  </div>

                  <div>
                    {proj.technologies && (
                      <p className="text-[11px] text-slate-500 mb-2 font-medium">
                        {Array.isArray(proj.technologies) ? proj.technologies.join(" · ") : proj.technologies}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs pt-2 border-t border-slate-200/60">
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-purple-700 font-semibold hover:underline inline-flex items-center gap-1">
                          Live Demo <ExternalLink size={10} />
                        </a>
                      )}
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1">
                          GitHub <ExternalLink size={10} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {education.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
                <GraduationCap size={18} className="text-purple-600" />
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-900 text-sm">{edu.degree}</p>
                    <p className="text-xs text-slate-700">{edu.institution} {edu.year && `· ${edu.year}`}</p>
                    {edu.score && <p className="text-xs text-purple-700 font-medium mt-0.5">Score: {edu.score}</p>}
                    {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                      <p className="text-[11px] text-slate-500 mt-1">Coursework: {edu.coursework.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certificates.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
                <Award size={18} className="text-purple-600" />
                Certifications
              </h2>
              <div className="space-y-2.5">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{cert.name}</p>
                      <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                    </div>
                    {cert.year && <span className="text-xs text-slate-400">{cert.year}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Achievements & Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
                <Award size={18} className="text-purple-600" />
                Achievements
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{typeof ach === "string" ? ach : ach?.title || ""}</li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b-2 border-purple-500/20 flex items-center gap-2">
                <LanguagesIcon size={18} className="text-purple-600" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {languages.map((l, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
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
              <section key={sIdx}>
                <h2 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b-2 border-purple-500/20">
                  {sec.heading}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sec.items?.map((it, iIdx) => (
                    <div key={iIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{it.title}</span>
                        {it.date && <span className="text-slate-500 font-normal">{it.date}</span>}
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
