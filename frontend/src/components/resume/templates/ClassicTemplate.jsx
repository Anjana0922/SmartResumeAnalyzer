import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

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

  const photoUrl = personal.photo
    ? personal.photo.startsWith("http")
      ? personal.photo
      : `http://localhost:5000${personal.photo}`
    : null;

  return (
    <div className="bg-white text-slate-900 font-serif p-8 sm:p-12 max-w-4xl mx-auto shadow-xl print:shadow-none print:p-0 print:max-w-none text-sm leading-normal">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            {personal.github && (
              <span className="flex items-center gap-1">
                <ExternalLink size={12} className="text-slate-500" />
                <a href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline">
                  GitHub
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
          </div>
        </div>

        {photoUrl && (
          <div className="shrink-0">
            <img
              src={photoUrl}
              alt={personal.name || "Candidate"}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border-2 border-slate-300 shadow-sm"
            />
          </div>
        )}
      </header>

      {/* Summary / About */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Professional Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-sans">
            Experience & Internships
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-sans">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {exp.role || "Role"}
                    </span>
                    {exp.company && (
                      <span className="text-slate-700 font-medium"> — {exp.company}</span>
                    )}
                    {exp.is_internship && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                        Internship
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600">
                    {exp.duration || ""}
                    {exp.location ? ` | ${exp.location}` : ""}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-slate-800 mt-1 text-xs sm:text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs sm:text-sm text-slate-800">
                    {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                )}

                {exp.technologies && (
                  <p className="text-xs text-slate-600 font-sans mt-1">
                    <strong className="text-slate-700">Technologies:</strong>{" "}
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
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-sans">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between font-sans">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    {edu.degree || "Degree"}
                  </span>
                  {edu.institution && (
                    <span className="text-slate-700 font-medium">, {edu.institution}</span>
                  )}
                  {edu.score && (
                    <span className="text-slate-600 text-xs ml-2">({edu.score})</span>
                  )}
                  {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Coursework:</strong> {edu.coursework.join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-xs text-slate-600 shrink-0">
                  {edu.year || ""}
                  {edu.location ? ` | ${edu.location}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(flatSkills.length > 0 || Object.values(skillsObj).some((arr) => arr?.length > 0)) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Skills & Competencies
          </h2>
          <div className="space-y-1.5 font-sans text-xs sm:text-sm text-slate-800">
            {skillsObj.technical?.length > 0 && (
              <p>
                <strong className="text-slate-900">Technical:</strong>{" "}
                {skillsObj.technical.join(", ")}
              </p>
            )}
            {skillsObj.frameworks?.length > 0 && (
              <p>
                <strong className="text-slate-900">Frameworks & Libraries:</strong>{" "}
                {skillsObj.frameworks.join(", ")}
              </p>
            )}
            {skillsObj.tools?.length > 0 && (
              <p>
                <strong className="text-slate-900">Tools & Platforms:</strong>{" "}
                {skillsObj.tools.join(", ")}
              </p>
            )}
            {skillsObj.soft?.length > 0 && (
              <p>
                <strong className="text-slate-900">Professional Skills:</strong>{" "}
                {skillsObj.soft.join(", ")}
              </p>
            )}
            {!skillsObj.technical?.length && flatSkills.length > 0 && (
              <p>
                <strong className="text-slate-900">Skills:</strong>{" "}
                {flatSkills.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-sans">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {proj.title || "Project Title"}
                    </span>
                    {proj.subtitle && (
                      <span className="text-xs text-slate-600">({proj.subtitle})</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline inline-flex items-center gap-0.5">
                        Live Demo <ExternalLink size={10} />
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

                {proj.description && (
                  <p className="text-slate-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {proj.technologies && (
                  <p className="text-xs text-slate-600 font-sans mt-0.5">
                    <strong className="text-slate-700">Technologies:</strong>{" "}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {certificates.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
                Certifications
              </h2>
              <ul className="space-y-1.5 font-sans text-xs sm:text-sm text-slate-800">
                {certificates.map((cert, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold">{cert.name || "Certification"}</span>
                      {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                    </div>
                    {cert.year && <span className="text-xs text-slate-500">{cert.year}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {achievements.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
                Honors & Achievements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-800">
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
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4 font-sans text-xs sm:text-sm text-slate-800">
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
            <section key={sIdx}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
                {sec.heading}
              </h2>
              <div className="space-y-2">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx} className="font-sans text-xs sm:text-sm">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{it.title}</span>
                      {it.date && <span className="text-xs text-slate-500 font-normal">{it.date}</span>}
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
