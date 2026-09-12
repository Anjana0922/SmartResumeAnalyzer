import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink, Award, BookOpen } from "lucide-react";

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

  const photoUrl = personal.photo
    ? personal.photo.startsWith("http")
      ? personal.photo
      : `http://localhost:5000${personal.photo}`
    : null;

  return (
    <div className="bg-white text-slate-800 font-sans max-w-4xl mx-auto shadow-xl print:shadow-none print:max-w-none text-sm leading-normal flex flex-col md:flex-row min-h-[1050px]">
      {/* Left Sidebar (35%) */}
      <aside className="w-full md:w-[35%] bg-slate-50 border-r border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Photo & Identity for Mobile / Photo only for Desktop */}
          {photoUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={photoUrl}
                alt={personal.name || "Candidate"}
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-4 border-white shadow-md"
              />
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-3">
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
              {personal.github && (
                <li className="flex items-center gap-2">
                  <ExternalLink size={13} className="text-slate-500 shrink-0" />
                  <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline truncate">
                    GitHub
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
            </ul>
          </div>

          {/* Categorized Skills */}
          {(flatSkills.length > 0 || Object.values(skillsObj).some((arr) => arr?.length > 0)) && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-3">
                Skills & Tech
              </h3>
              <div className="space-y-3 text-xs">
                {skillsObj.technical?.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">Languages:</span>
                    <div className="flex flex-wrap gap-1">
                      {skillsObj.technical.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skillsObj.frameworks?.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">Frameworks:</span>
                    <div className="flex flex-wrap gap-1">
                      {skillsObj.frameworks.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skillsObj.tools?.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">Tools:</span>
                    <div className="flex flex-wrap gap-1">
                      {skillsObj.tools.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skillsObj.soft?.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">Soft Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {skillsObj.soft.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!skillsObj.technical?.length && flatSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {flatSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-2.5">
                Languages
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                {languages.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-slate-500 text-[11px]">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications (Sidebar) */}
          {certificates.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 mb-2.5">
                Certifications
              </h3>
              <div className="space-y-2 text-xs">
                {certificates.map((c, i) => (
                  <div key={i}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-slate-500 text-[11px]">{c.issuer} {c.year && `· ${c.year}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 text-[10px] text-slate-600 border-t border-slate-200">
          Generated via SmartResume
        </div>
      </aside>

      {/* Right Content Area (65%) */}
      <main className="w-full md:w-[65%] p-6 sm:p-10 space-y-6">
        {/* Name & Title Header */}
        <div className="border-b-2 border-purple-600 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            {personal.name || "Candidate Name"}
          </h1>
          {personal.title && (
            <p className="text-base text-purple-700 font-semibold mt-1">
              {personal.title}
            </p>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Professional Profile
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Experience & Internships
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pl-3 border-l-2 border-purple-200">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {exp.role || "Role"}
                      </span>
                      {exp.company && (
                        <span className="text-slate-600 text-xs font-medium"> @ {exp.company}</span>
                      )}
                      {exp.is_internship && (
                        <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                          Intern
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">
                      {exp.duration || ""}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-700">
                      {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      <strong>Tech:</strong>{" "}
                      {Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="relative pl-3 border-l-2 border-purple-200">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {edu.degree || "Degree"}
                      </span>
                      {edu.institution && (
                        <span className="text-slate-600 text-xs font-medium">, {edu.institution}</span>
                      )}
                      {edu.score && (
                        <span className="text-xs text-slate-500 ml-1.5">({edu.score})</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{edu.year || ""}</span>
                  </div>
                  {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      Coursework: {edu.coursework.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {proj.title}
                    </span>
                    <div className="flex gap-2 text-xs">
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-purple-700 font-medium hover:underline inline-flex items-center gap-0.5 text-[11px]">
                          Demo <ExternalLink size={9} />
                        </a>
                      )}
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-purple-700 font-medium hover:underline inline-flex items-center gap-0.5 text-[11px]">
                          Code <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                      {proj.description}
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
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
              Achievements
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
              <section key={sIdx}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-purple-600"></span>
                  {sec.heading}
                </h2>
                <div className="space-y-2">
                  {sec.items?.map((it, iIdx) => (
                    <div key={iIdx} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{it.title}</span>
                        {it.date && <span className="text-slate-500 font-normal">{it.date}</span>}
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
