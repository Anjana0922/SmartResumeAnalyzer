import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  User,
  Trophy,
  Languages,
  Globe,
} from "lucide-react";
import { Linkedin, Github } from "../SocialIcons";

function ProfessionalTemplate({
  resume,
  photo,
  sections,
  theme,
}) {
  const personal = resume?.personal || {};
  const isDark = theme === "dark";

  const toArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // ==========================================================
  // COLORS
  // ==========================================================

  const page = isDark
    ? "bg-[#101722] text-[#edf2f7]"
    : "bg-[#f7f8fa] text-[#172033]";

  const whiteCard = isDark
    ? "bg-[#172131]"
    : "bg-white";

  const card = whiteCard;

  const sidebar = isDark
    ? "bg-[#0b1320]"
    : "bg-[#172a46]";

  const border = isDark
    ? "border-[#2b3a4e]"
    : "border-[#dce2e9]";

  const muted = isDark
    ? "text-[#a9b6c6]"
    : "text-[#687487]";

  const faint = isDark
    ? "text-[#718197]"
    : "text-[#8a95a5]";

  const accent = isDark
    ? "text-[#8fb7df]"
    : "text-[#315b87]";

  const accentBg = isDark
    ? "bg-[#20334b]"
    : "bg-[#edf3f9]";

  // ==========================================================
  // SECTION TITLE
  // ==========================================================

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-8">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isDark ? "bg-[#20334b]" : "bg-[#edf3f9]"
        }`}
      >
        <Icon size={18} className={accent} />
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h2>

        <div
          className={`mt-2 h-px w-14 ${
            isDark ? "bg-[#52759b]" : "bg-[#315b87]"
          }`}
        />
      </div>
    </div>
  );

  // ==========================================================
  // PHOTO
  // ==========================================================

  const renderPhoto = () => {
    if (photo) {
      return (
        <img
          src={photo}
          alt={personal.name || "Profile"}
          className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-xl"
        />
      );
    }

    return (
      <div className="w-32 h-32 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
        <User size={36} className="text-white/70" />
      </div>
    );
  };

  // ==========================================================
  // ABOUT
  // ==========================================================

  const renderAbout = () => {
    if (!resume?.about) return null;

    return (
      <section
        id="about"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={BriefcaseBusiness}
          title="Professional Profile"
        />

        <p
          className={`text-base md:text-lg leading-8 max-w-4xl ${muted}`}
        >
          {resume.about}
        </p>
      </section>
    );
  };

  // ==========================================================
  // EXPERIENCE
  // ==========================================================

  const renderExperience = () => {
    const experience = toArray(resume?.experience);
    if (!experience.length) return null;

    return (
      <section
        id="experience"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={Briefcase}
          title="Experience & Work History"
        />

        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border ${border} ${card} transition hover:shadow-lg`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.role || item.title || "Role"}
                  </h3>
                  <p className={`text-sm font-medium ${accent} mt-0.5`}>
                    {item.company || item.organization || "Organization"}
                  </p>
                </div>
                <div className="text-xs sm:text-right">
                  <span className={`inline-block font-mono ${muted}`}>
                    {item.duration || item.year || ""}
                  </span>
                  {item.location && (
                    <span className={`block ${faint}`}>{item.location}</span>
                  )}
                  {item.is_internship && (
                    <span className="inline-block mt-1 mr-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Internship
                    </span>
                  )}
                  {item.employment_type && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${accentBg} ${accent}`}>
                      {item.employment_type}
                    </span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className={`mt-3 text-sm leading-7 ${muted}`}>
                  {item.description}
                </p>
              )}

              {Array.isArray(item.highlights) && item.highlights.filter(Boolean).length > 0 && (
                <ul className={`mt-3 space-y-1.5 text-xs ${muted} list-disc list-inside`}>
                  {item.highlights.filter(Boolean).map((hl, hIdx) => (
                    <li key={hIdx}>{hl}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ==========================================================
  // EDUCATION
  // ==========================================================

  const renderEducation = () => {
    if (!resume?.education?.length) return null;

    return (
      <section
        id="education"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={GraduationCap}
          title="Education"
        />

        <div className="relative ml-3">
          <div
            className={`absolute left-[5px] top-2 bottom-2 w-px ${
              isDark
                ? "bg-[#33455d]"
                : "bg-[#ccd5df]"
            }`}
          />

          <div className="space-y-9">
            {resume.education.map((item, index) => (
              <div
                key={index}
                className="relative pl-10"
              >
                <div
                  className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
                    isDark
                      ? "bg-[#172131] border-[#8fb7df]"
                      : "bg-white border-[#315b87]"
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.course ||
                        item.degree ||
                        "Education"}
                    </h3>

                    <p className={`mt-1 ${muted}`}>
                      {item.institute ||
                        item.institution}
                    </p>
                  </div>

                  {(item.year || item.duration) && (
                    <span
                      className={`text-xs font-medium ${accent}`}
                    >
                      {item.year ||
                        item.duration}
                    </span>
                  )}
                </div>

                {item.score && (
                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-md text-xs ${accentBg} ${accent}`}
                  >
                    {typeof item.score === "object" && item.score !== null
                      ? `${item.score.label || "Score"}: ${item.score.value || ""}`
                      : String(item.score)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // ==========================================================
  // SKILLS
  // ==========================================================

  const renderSkills = () => {
    if (!resume?.skills) return null;

    const skills = Array.isArray(resume.skills)
      ? resume.skills
      : Object.values(resume.skills).flat();

    if (!skills.length) return null;

    return (
      <section
        id="skills"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={Code2}
          title="Core Competencies"
        />

        <div
          className={`grid sm:grid-cols-2 gap-x-10 gap-y-5 border-t ${border} pt-6`}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDark
                    ? "bg-[#8fb7df]"
                    : "bg-[#315b87]"
                }`}
              />

              <span
                className={`text-sm md:text-base ${muted}`}
              >
                {typeof skill === "string"
                  ? skill
                  : skill.name || skill.title}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ==========================================================
  // PROJECTS
  // ==========================================================

  const renderProjects = () => {
    if (!resume?.projects?.length) return null;

    return (
      <section
        id="projects"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={BriefcaseBusiness}
          title="Selected Projects"
        />

        <div className="space-y-5">
          {resume.projects.map((project, index) => (
            <article
              key={index}
              className={`group p-6 md:p-7 rounded-xl border ${border} ${whiteCard} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex gap-5">
                <div
                  className={`hidden sm:flex shrink-0 w-11 h-11 rounded-lg items-center justify-center ${accentBg} ${accent} font-serif font-semibold`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="text-lg md:text-xl font-semibold">
                      {project.title ||
                        "Project"}
                    </h3>

                    {project.year && (
                      <span
                        className={`text-xs ${faint}`}
                      >
                        {project.year}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-3 leading-7 text-sm md:text-base ${muted}`}
                  >
                    {project.description}
                  </p>

                  {project.technologies?.length >
                    0 && (
                    <div
                      className={`mt-5 pt-4 border-t ${border}`}
                    >
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {project.technologies.map(
                          (technology, techIndex) => (
                            <span
                              key={techIndex}
                              className={`text-xs font-medium ${accent}`}
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  // ==========================================================
  // CERTIFICATES
  // ==========================================================

  const renderCertificates = () => {
    if (!resume?.certificates?.length) return null;

    return (
      <section
        id="certificates"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={Award}
          title="Certifications"
        />

        <div className="grid md:grid-cols-2 gap-5">
          {resume.certificates.map(
            (certificate, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${border} ${whiteCard}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${accentBg}`}
                  >
                    <Award
                      size={18}
                      className={accent}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {certificate.title ||
                        certificate.name ||
                        "Certificate"}
                    </h3>

                    {(certificate.issuer ||
                      certificate.organization) && (
                      <p
                        className={`mt-1 text-sm ${muted}`}
                      >
                        {certificate.issuer ||
                          certificate.organization}
                      </p>
                    )}

                    {certificate.year && (
                      <span
                        className={`inline-block mt-3 text-xs ${faint}`}
                      >
                        {certificate.year}
                      </span>
                    )}
                  </div>
                </div>

                {certificate.description && (
                  <p
                    className={`mt-5 text-sm leading-6 ${muted}`}
                  >
                    {certificate.description}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </section>
    );
  };

  // ==========================================================
  // ACHIEVEMENTS
  // ==========================================================

  const renderAchievements = () => {
    if (!resume?.achievements?.length) return null;

    return (
      <section
        id="achievements"
        className="mb-16 scroll-mt-28"
      >
        <SectionTitle
          icon={Trophy}
          title="Achievements"
        />

        <div className="space-y-4">
          {resume.achievements.map(
            (achievement, index) => (
              <div
                key={index}
                className={`flex gap-4 p-5 rounded-xl border ${border} ${whiteCard}`}
              >
                <div
                  className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${accentBg}`}
                >
                  <Trophy
                    size={16}
                    className={accent}
                  />
                </div>

                <p
                  className={`text-sm md:text-base leading-7 ${muted}`}
                >
                  {typeof achievement ===
                  "string"
                    ? achievement
                    : achievement.description ||
                      achievement.title}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    );
  };

  // ==========================================================
  // LANGUAGES
  // ==========================================================

  const renderLanguages = () => {
    if (!resume?.languages?.length) return null;

    return (
      <section
        id="languages"
        className="mb-10 scroll-mt-28"
      >
        <SectionTitle
          icon={Languages}
          title="Languages"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          {resume.languages.map(
            (language, index) => {
              const name =
                typeof language === "string"
                  ? language
                  : language.name;

              const level =
                typeof language === "object"
                  ? language.level
                  : null;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${border} ${whiteCard}`}
                >
                  <span className="font-medium">
                    {name}
                  </span>

                  {level && (
                    <span
                      className={`text-xs ${faint}`}
                    >
                      {level}
                    </span>
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>
    );
  };

  // ==========================================================
  // CUSTOM SECTIONS
  // ==========================================================

  const renderCustomSections = () => {
    const customSecs = toArray(resume?.custom_sections);
    if (!customSecs.length) return null;

    return (
      <div className="space-y-16 mb-16">
        {customSecs.map((sec, sIdx) => {
          const items = toArray(sec.items);
          return (
            <section key={sIdx} id={`custom-${sIdx}`} className="scroll-mt-28">
              <SectionTitle
                icon={BriefcaseBusiness}
                title={sec.title || sec.heading || "Additional Information"}
              />
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((it, iIdx) => (
                    <div key={iIdx} className={`p-5 rounded-xl border ${border} ${whiteCard}`}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-base font-semibold tracking-tight">{it.title || it.name || "Item"}</h3>
                        {it.date && <span className={`text-xs font-mono ${muted}`}>{it.date}</span>}
                      </div>
                      {it.subtitle && <p className={`text-sm font-medium ${accent} mt-0.5`}>{it.subtitle}</p>}
                      {it.description && <p className={`mt-2 text-sm leading-6 ${muted}`}>{it.description}</p>}
                    </div>
                  ))}
                </div>
              ) : sec.content ? (
                <p className={`text-sm md:text-base leading-7 ${muted}`}>{sec.content}</p>
              ) : null}
            </section>
          );
        })}
      </div>
    );
  };

  // ==========================================================
  // SECTION RENDERER
  // ==========================================================

  const renderSection = (section) => {
    switch (section) {
      case "about":
        return renderAbout();

      case "experience":
        return renderExperience();

      case "education":
        return renderEducation();

      case "skills":
        return renderSkills();

      case "projects":
        return renderProjects();

      case "certificates":
        return renderCertificates();

      case "achievements":
        return renderAchievements();

      case "languages":
        return renderLanguages();

      case "custom_sections":
        return renderCustomSections();

      default:
        return null;
    }
  };

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div
      className={`min-h-screen ${page} font-sans`}
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <header
        className={`${sidebar} text-white`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 items-center">
            
            {/* PHOTO - LEFT */}
            <div className="flex justify-center lg:justify-start">
              {renderPhoto()}
            </div>

            {/* PERSONAL INFO - RIGHT */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
                Professional Portfolio
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
                {personal.name ||
                  "Your Name"}
              </h1>

              {personal.title && (
                <p className="mt-2 text-lg text-[#8fb7df] font-medium">
                  {personal.title}
                </p>
              )}

              <div className="mt-4 w-20 h-1 bg-[#8fb7df]" />

              <p className="mt-5 text-white/60 max-w-2xl text-sm md:text-base leading-7">
                Professional profile and selected work.
              </p>

              {/* CONTACT */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-7 text-sm text-white/70">
                {personal.email && (
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {personal.email}
                  </span>
                )}

                {personal.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={15} />
                    {personal.phone}
                  </span>
                )}

                {personal.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={15} />
                    {personal.location}
                  </span>
                )}
              </div>

              {/* SOCIAL LINKS */}
              <div className="flex gap-3 mt-6">
                {personal.linkedin && (
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  >
                    <Linkedin size={16} />
                  </a>
                )}

                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  >
                    <Github size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================
          NAVIGATION
      ==================================================== */}

      <nav
        className={`sticky top-0 z-40 border-b ${border} ${
          isDark
            ? "bg-[#101722]/95"
            : "bg-[#f7f8fa]/95"
        } backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-7 overflow-x-auto py-4">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-xs capitalize whitespace-nowrap ${muted} hover:${accent} transition`}
              >
                {section}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-[1fr_280px] gap-14">
          
          {/* MAIN CONTENT */}
          <div>
            {sections.map(renderSection)}
            {!sections?.includes("custom_sections") && renderCustomSections()}
          </div>

          {/* SIDE INFORMATION */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div
                className={`border-l-2 ${
                  isDark
                    ? "border-[#39526d]"
                    : "border-[#315b87]"
                } pl-6`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.2em] ${faint}`}
                >
                  Professional Portfolio
                </p>

                <p
                  className={`mt-4 text-sm leading-7 ${muted}`}
                >
                  A structured presentation of
                  education, skills, projects and
                  professional achievements.
                </p>

                <div
                  className={`mt-8 pt-6 border-t ${border}`}
                >
                  <span
                    className={`font-serif text-3xl ${accent}`}
                  >
                    {String(
                      sections.length
                    ).padStart(2, "0")}
                  </span>

                  <p
                    className={`mt-1 text-xs ${faint}`}
                  >
                    Portfolio sections
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ====================================================
          FOOTER
      ==================================================== */}

      <footer
        className={`${sidebar} text-white py-8`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-sm font-serif">
            {personal.name || "Portfolio"}
          </p>

          <p className="text-xs text-white/40">
            Professional Portfolio · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ProfessionalTemplate;