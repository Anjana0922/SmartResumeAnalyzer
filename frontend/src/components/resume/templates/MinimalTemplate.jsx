import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

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

  const photoUrl = personal.photo
    ? personal.photo.startsWith("http")
      ? personal.photo
      : `http://localhost:5000${personal.photo}`
    : null;

  return (
    <div className="bg-zinc-50 text-zinc-900 font-sans p-8 sm:p-14 max-w-4xl mx-auto shadow-xl print:shadow-none print:p-0 print:max-w-none text-sm leading-relaxed">
      {/* Header */}
      <header className="pb-8 mb-8 border-b border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
            <span className="text-xs uppercase tracking-widest text-zinc-600 font-medium">
              Curriculum Vitae
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 mt-4">
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
            {personal.github && (
              <span className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-zinc-600" />
                <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="text-zinc-900 hover:underline">
                  GitHub
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
          </div>
        </div>

        {photoUrl && (
          <div className="shrink-0">
            <img
              src={photoUrl}
              alt={personal.name || "Candidate"}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-zinc-200 shadow-sm"
            />
          </div>
        )}
      </header>

      {/* Summary / About */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2">
            Overview
          </h2>
          <p className="text-zinc-700 leading-relaxed text-sm font-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-4 border-l border-zinc-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-semibold text-zinc-900 text-sm">
                      {exp.role || "Role"}
                    </span>
                    {exp.company && (
                      <span className="text-zinc-500 font-normal"> · {exp.company}</span>
                    )}
                    {exp.is_internship && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                        Intern
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-600">
                    {exp.duration || ""}
                    {exp.location ? ` | ${exp.location}` : ""}
                  </span>
                </div>

                {exp.description && (
                  <p className="text-zinc-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs sm:text-sm text-zinc-600 list-disc list-inside">
                    {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
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
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div>
                  <span className="font-semibold text-zinc-900 text-sm">
                    {edu.degree || "Degree"}
                  </span>
                  {edu.institution && (
                    <span className="text-zinc-600">, {edu.institution}</span>
                  )}
                  {edu.score && (
                    <span className="text-xs text-zinc-600 ml-2">Grade: {edu.score}</span>
                  )}
                  {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Focus: {edu.coursework.join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-xs text-zinc-600 shrink-0">
                  {edu.year || ""}
                  {edu.location ? ` · ${edu.location}` : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(flatSkills.length > 0 || Object.values(skillsObj).some((arr) => arr?.length > 0)) && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {skillsObj.technical?.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-zinc-200">
                <p className="font-semibold text-zinc-900 mb-1.5">Languages & Core</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsObj.technical.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skillsObj.frameworks?.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-zinc-200">
                <p className="font-semibold text-zinc-900 mb-1.5">Frameworks & Libraries</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsObj.frameworks.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skillsObj.tools?.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-zinc-200">
                <p className="font-semibold text-zinc-900 mb-1.5">Tools & Platforms</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsObj.tools.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skillsObj.soft?.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-zinc-200">
                <p className="font-semibold text-zinc-900 mb-1.5">Soft Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsObj.soft.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {!skillsObj.technical?.length && flatSkills.length > 0 && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-white border border-zinc-200">
                <div className="flex flex-wrap gap-1.5">
                  {flatSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-4">
            Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-zinc-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-zinc-900 text-sm">
                      {proj.title || "Project Title"}
                    </span>
                    {proj.duration && <span className="text-[11px] text-zinc-600">{proj.duration}</span>}
                  </div>
                  {proj.subtitle && (
                    <p className="text-xs text-zinc-500 mb-1.5">{proj.subtitle}</p>
                  )}
                  {proj.description && (
                    <p className="text-zinc-600 text-xs leading-relaxed mb-3">
                      {proj.description}
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
                        Demo <ExternalLink size={10} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {certificates.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3">
                Certifications
              </h2>
              <div className="space-y-2 text-xs">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-baseline border-b border-zinc-100 pb-1">
                    <span className="font-medium text-zinc-800">{cert.name}</span>
                    <span className="text-zinc-600">{cert.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {achievements.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3">
                Honors
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
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2">
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
        <div className="space-y-6">
          {customSections.map((sec, sIdx) => (
            <section key={sIdx}>
              <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3">
                {sec.heading}
              </h2>
              <div className="space-y-3">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx} className="text-xs">
                    <div className="flex justify-between font-medium text-zinc-800">
                      <span>{it.title}</span>
                      {it.date && <span className="text-zinc-600">{it.date}</span>}
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
