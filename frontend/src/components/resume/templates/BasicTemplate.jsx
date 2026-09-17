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

export default function BasicTemplate({ resume }) {
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
    <div className="resume-print-root bg-white text-slate-900 font-sans px-10 py-9 w-[794px] min-h-[1123px] mx-auto text-sm leading-normal box-border">
      {/* 1. Personal Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-5 flex flex-row items-center justify-between gap-4 resume-section-block pdf-avoid-break">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 uppercase">
            {personal.name || "Your Name"}
          </h1>
          {personal.title && (
            <p className="text-base text-slate-700 font-medium mt-0.5">
              {personal.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2.5">
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
                  Portfolio / Website
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

      {/* 2. Professional Summary / About (immediately below personal info) */}
      {summary && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 resume-section-header pdf-avoid-break">
            Professional Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* 3. Experience & Work History */}
      {experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Experience & Employment
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => {
              const empType = exp.employment_type || (exp.is_internship ? "Internship" : null);
              return (
                <div key={idx} className="resume-entry pdf-avoid-break">
                  <div className="flex flex-row items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {exp.role || "Position"}
                      </span>
                      {exp.company && (
                        <span className="text-slate-700 font-medium"> — {exp.company}</span>
                      )}
                      {empType && (
                        <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300">
                          {empType}
                        </span>
                      )}
                    </div>
                    {(exp.duration || exp.year) && (
                      <span className="text-xs font-mono text-slate-600 shrink-0">
                        {exp.duration || exp.year}
                      </span>
                    )}
                  </div>

                  {exp.location && (
                    <div className="text-xs text-slate-500 italic mt-0.5">
                      {exp.location}
                    </div>
                  )}

                  {exp.description && (
                    <p className="text-xs text-slate-800 mt-1 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && (
                    <div className="text-xs text-slate-800 mt-1">
                      <span className="font-semibold text-slate-700">Responsibilities: </span>
                      {exp.responsibilities}
                    </div>
                  )}

                  {exp.achievements && (
                    <div className="text-xs text-slate-800 mt-1">
                      <span className="font-semibold text-slate-700">Key Achievements: </span>
                      {exp.achievements}
                    </div>
                  )}

                  {Array.isArray(exp.highlights) && exp.highlights.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-800 mt-1 space-y-0.5">
                      {exp.highlights.filter(Boolean).map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && (
                    <div className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-700">Skills / Tools: </span>
                      {typeof exp.technologies === "string" ? exp.technologies : exp.technologies.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Education */}
      {education.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break">
                <div className="flex flex-row items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {edu.degree || "Degree"}
                    </span>
                    {edu.institution && (
                      <span className="text-slate-700 font-medium"> — {edu.institution}</span>
                    )}
                    {edu.board && (
                      <span className="text-slate-600 text-xs"> ({edu.board})</span>
                    )}
                  </div>
                  {(edu.year || edu.duration) && (
                    <span className="text-xs font-mono text-slate-600 shrink-0">
                      {edu.year || edu.duration}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-0.5">
                  {edu.location && <span>{edu.location}</span>}
                  {edu.score && (
                    <span>
                      <strong className="text-slate-700">Score / Grade:</strong> {edu.score}
                    </span>
                  )}
                </div>

                {edu.coursework && (
                  <p className="text-xs text-slate-700 mt-1">
                    <strong className="text-slate-700">Coursework:</strong> {Array.isArray(edu.coursework) ? edu.coursework.join(", ") : edu.coursework}
                  </p>
                )}

                {edu.additional_details && (
                  <p className="text-xs text-slate-700 mt-0.5 italic">
                    {edu.additional_details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Skills & Core Competencies */}
      {(skillCategories.length > 0 || flatSkills.length > 0) && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Skills & Core Competencies
          </h2>

          {skillCategories.length > 0 ? (
            <div className="space-y-2 text-xs">
              {skillCategories.map(([catKey, items]) => (
                <div key={catKey} className="flex flex-row items-baseline gap-2">
                  <span className="font-bold text-slate-900 min-w-[170px] shrink-0">
                    {formatCategoryTitle(catKey)}:
                  </span>
                  <span className="text-slate-800 leading-relaxed">
                    {items.join(" • ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed">
              {flatSkills.join(" • ")}
            </p>
          )}
        </section>
      )}

      {/* 6. Projects & Professional Work */}
      {projects.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Projects & Professional Work
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="resume-entry pdf-avoid-break">
                <div className="flex flex-row items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {proj.title || "Project Title"}
                    </span>
                    {proj.role && (
                      <span className="text-xs font-semibold text-slate-600">({proj.role})</span>
                    )}
                    {proj.organization && (
                      <span className="text-xs text-slate-600">for {proj.organization}</span>
                    )}
                  </div>
                  {proj.duration && (
                    <span className="text-xs font-mono text-slate-600 shrink-0">
                      {proj.duration}
                    </span>
                  )}
                </div>

                {proj.subtitle && (
                  <div className="text-xs text-slate-600 italic mt-0.5">{proj.subtitle}</div>
                )}

                {proj.description && (
                  <p className="text-xs text-slate-800 mt-1 leading-relaxed text-justify">
                    {proj.description}
                  </p>
                )}

                {proj.responsibilities && (
                  <div className="text-xs text-slate-800 mt-1">
                    <span className="font-semibold text-slate-700">Responsibilities: </span>
                    {proj.responsibilities}
                  </div>
                )}

                {proj.outcomes && (
                  <div className="text-xs text-slate-800 mt-1">
                    <span className="font-semibold text-slate-700">Outcomes: </span>
                    {proj.outcomes}
                  </div>
                )}

                {proj.technologies && (
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">Tools / Technologies: </span>
                    {typeof proj.technologies === "string" ? proj.technologies : proj.technologies.join(", ")}
                  </div>
                )}

                {(proj.link || proj.github) && (
                  <div className="flex items-center gap-3 text-xs text-purple-700 mt-1">
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="hover:underline">
                        Project Link
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="hover:underline">
                        Repository
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Certifications & Training */}
      {certificates.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Certifications & Training
          </h2>
          <div className="space-y-1.5 text-xs">
            {certificates.map((cert, idx) => (
              <div key={idx} className="flex justify-between items-baseline resume-entry pdf-avoid-break">
                <div>
                  <span className="font-bold text-slate-900">{cert.name || "Certification"}</span>
                  {cert.issuer && <span className="text-slate-700"> — {cert.issuer}</span>}
                </div>
                {cert.year && <span className="font-mono text-slate-600">{cert.year}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Honors & Achievements */}
      {achievements.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Honors & Achievements
          </h2>
          <ul className="list-disc list-inside text-xs text-slate-800 space-y-1">
            {achievements.map((ach, idx) => (
              <li key={idx} className="resume-entry pdf-avoid-break">{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 9. Languages */}
      {languages.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {languages.map((lang, idx) => (
              <span key={idx} className="resume-entry pdf-avoid-break">
                <strong className="text-slate-900">{lang.name || lang}</strong>
                {lang.level && <span className="text-slate-600"> ({lang.level})</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 10. Custom Sections */}
      {customSections.length > 0 && (
        <div className="space-y-5">
          {customSections.map((sec, sIdx) => (
            <section key={sIdx} className="resume-section-block">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 resume-section-header pdf-avoid-break">
                {sec.heading || "Additional Information"}
              </h2>
              <div className="space-y-2 text-xs">
                {sec.items?.map((it, iIdx) => (
                  <div key={iIdx} className="resume-entry pdf-avoid-break">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-slate-900">{it.title}</strong>
                      {it.date && <span className="text-slate-600 font-mono">{it.date}</span>}
                    </div>
                    {it.subtitle && <div className="text-slate-600 italic">{it.subtitle}</div>}
                    {it.description && <p className="text-slate-800 mt-0.5">{it.description}</p>}
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
