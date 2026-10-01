import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Terminal,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Linkedin, Github, formatLinkedInUrl } from "../SocialIcons";

function TechTemplate({
  resume,
  photo,
  sections = [],
  theme,
}) {
  const personal = resume?.personal || {};
  const linkedInUrl = formatLinkedInUrl(personal.linkedin);
  const isDark = theme === "dark";

  // =========================================================
  // COLORS
  // =========================================================

  const page = isDark
    ? "bg-[#080d0c] text-[#e5f3ed]"
    : "bg-[#eef6f2] text-[#172822]";

  const panel = isDark
    ? "bg-[#0e1714]"
    : "bg-white";

  const card = isDark
    ? "bg-[#111d19] border-[#203b32]"
    : "bg-white border-[#d4e5dd]";

  const soft = isDark
    ? "bg-[#14251f]"
    : "bg-[#e3f0ea]";

  const muted = isDark
    ? "text-[#91aaa0]"
    : "text-[#61776e]";

  const faint = isDark
    ? "text-[#587269]"
    : "text-[#8a9d95]";

  const accent = isDark
    ? "text-[#6ee7b7]"
    : "text-[#187452]";

  const accentBg = isDark
    ? "bg-[#0c3326]"
    : "bg-[#d9eee5]";

  const accentBorder = isDark
    ? "border-[#245541]"
    : "border-[#b9d9cb]";

  const border = isDark
    ? "border-[#203b32]"
    : "border-[#d4e5dd]";

  // =========================================================
  // HELPERS
  // =========================================================

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

  const education = toArray(resume?.education);
  const experience = toArray(resume?.experience);
  const projects = toArray(resume?.projects);
  const certificates = toArray(resume?.certificates);
  const achievements = toArray(resume?.achievements);
  const languages = toArray(resume?.languages);
  const custom_sections = toArray(resume?.custom_sections);

  const sectionNumber = (section) => {
    const index = sections?.indexOf(section);

    if (index === -1 || index === undefined) {
      return "00";
    }

    return String(index + 1).padStart(2, "0");
  };

  // =========================================================
  // PHOTO
  // =========================================================

  const renderPhoto = () => {
    if (!photo) return null;

    return (
      <div className="relative w-full max-w-[260px]">
        {/* offset decoration */}
        <div
          className={`absolute -left-4 -bottom-4 w-full h-full border ${accentBorder} rounded-3xl`}
        />

        <div
          className={`absolute -right-3 -top-3 w-16 h-16 border-t-2 border-r-2 ${
            isDark ? "border-[#6ee7b7]" : "border-[#187452]"
          }`}
        />

        <img
          src={photo}
          alt={personal.name || ""}
          className={`relative w-full aspect-[4/5] object-cover rounded-3xl border ${border}`}
        />

        {personal.title && (
          <div
            className={`absolute -bottom-5 -right-5 px-4 py-2 rounded-xl border ${accentBorder} ${accentBg} ${accent} font-mono text-xs max-w-[200px] truncate`}
          >
            {personal.title}
          </div>
        )}
      </div>
    );
  };

  // =========================================================
  // SECTION HEADING
  // =========================================================

  const Heading = ({ number, title, command }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {number && (
          <span
            className={`font-mono text-xs ${accent}`}
          >
            {number}
          </span>
        )}

        <span className={`font-mono text-sm ${faint}`}>
          /
        </span>

        <span
          className={`font-mono text-xs uppercase tracking-widest ${faint}`}
        >
          {command || title}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
        {title}
      </h2>
    </div>
  );

  // =========================================================
  // ABOUT
  // =========================================================

  const renderAbout = () => {
    const aboutText = resume?.about || resume?.summary || personal.summary;
    if (!aboutText) return null;

    const fileName = personal.name
      ? `${personal.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.md`
      : "about.md";

    return (
      <section
        id="about"
        className="py-16 scroll-mt-24"
      >
        <Heading
          number={sectionNumber("about")}
          title="About"
          command="about"
        />

        <div
          className={`relative rounded-2xl border ${border} ${card} p-7 md:p-9 overflow-hidden`}
        >
          {/* terminal top bar */}
          <div
            className={`flex items-center gap-2 pb-5 border-b ${border}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />

            <span
              className={`ml-3 font-mono text-xs ${faint}`}
            >
              {fileName}
            </span>
          </div>

          <div className="pt-7">
            <p
              className={`text-lg md:text-xl leading-8 max-w-4xl ${muted} whitespace-pre-line`}
            >
              {aboutText}
            </p>
          </div>
        </div>
      </section>
    );
  };

  // =========================================================
  // EXPERIENCE
  // =========================================================

  const renderExperience = () => {
    if (!experience.length) return null;

    return (
      <section
        id="experience"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("experience")}
          title="Experience"
          command="experience"
        />

        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border ${border} ${card} p-7 md:p-8 transition hover:border-[#6ee7b7]/50`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-white/5">
                <div>
                  {(item.role || item.title) && (
                    <h3 className="text-xl font-bold tracking-tight">
                      {item.role || item.title}
                    </h3>
                  )}
                  {(item.company || item.organization) && (
                    <p className={`font-mono text-sm ${accent} mt-1`}>
                      {item.company || item.organization}
                    </p>
                  )}
                </div>
                <div className="font-mono text-xs sm:text-right">
                  {(item.duration || item.year) && (
                    <span className={muted}>
                      {item.duration || item.year}
                    </span>
                  )}
                  {item.location && (
                    <span className={`block ${faint}`}>{item.location}</span>
                  )}
                  {item.is_internship && (
                    <span className="inline-block mt-1 mr-1 px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px]">
                      Internship
                    </span>
                  )}
                  {item.employment_type && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded border ${accentBorder} ${accentBg} ${accent} text-[10px]`}>
                      {item.employment_type}
                    </span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className={`mt-4 text-base leading-7 ${muted}`}>
                  {item.description}
                </p>
              )}

              {Array.isArray(item.highlights) && item.highlights.filter(Boolean).length > 0 && (
                <ul className={`mt-3 space-y-1 font-mono text-xs ${faint} list-disc list-inside`}>
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

  // =========================================================
  // EDUCATION
  // =========================================================

  const renderEducation = () => {
    if (!education.length) return null;

    return (
      <section
        id="education"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("education")}
          title="Education"
          command="education"
        />

        <div className="space-y-4">
          {education.map((item, index) => (
            <div
              key={index}
              className={`group grid md:grid-cols-[120px_1fr_auto] gap-5 items-center p-6 rounded-2xl border ${border} ${card}`}
            >
              <div
                className={`font-mono text-xs ${accent}`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                {(item.course || item.degree) && (
                  <h3 className="text-xl font-semibold">
                    {item.course || item.degree}
                  </h3>
                )}

                {(item.institute || item.institution) && (
                  <p
                    className={`mt-2 ${muted}`}
                  >
                    {item.institute || item.institution}
                  </p>
                )}

                {item.score && (
                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-md text-xs font-mono ${accentBg} ${accent}`}
                  >
                    {typeof item.score === "object" && item.score !== null
                      ? `${item.score.label || "Score"}: ${item.score.value || ""}`
                      : String(item.score)}
                  </span>
                )}
              </div>

              {(item.year || item.duration) && (
                <div
                  className={`font-mono text-xs ${faint}`}
                >
                  {item.year || item.duration}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // =========================================================
  // SKILLS
  // =========================================================

  const renderSkills = () => {
    if (!resume?.skills) return null;

    const skills = Array.isArray(resume.skills)
      ? resume.skills
      : (resume.skills?.all || resume.flat_skills || Object.values(resume.skills).flat());

    if (!skills.length) return null;

    return (
      <section
        id="skills"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("skills")}
          title="Skills"
          command="skills"
        />

        <div
          className={`rounded-2xl border ${border} ${card} p-7`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((skill, index) => {
              const val = typeof skill === "string" ? skill : skill?.name || skill?.value;
              if (!val) return null;

              return (
                <div
                  key={index}
                  className={`group px-4 py-4 rounded-xl border ${accentBorder} ${soft} transition-all duration-300 hover:-translate-y-1`}
                >
                  <div
                    className={`font-mono text-xs ${faint}`}
                  >
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div
                    className={`mt-2 font-mono text-sm ${accent}`}
                  >
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  // =========================================================
  // PROJECTS
  // =========================================================

  const renderProjects = () => {
    if (!projects.length) return null;

    return (
      <section
        id="projects"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("projects")}
          title="Projects"
          command="projects"
        />

        <div className="space-y-5">
          {projects.map((project, index) => (
            <article
              key={index}
              className={`group relative rounded-2xl border ${border} ${card} p-7 md:p-9 overflow-hidden`}
            >
              {/* project number */}
              <div
                className={`absolute top-6 right-7 font-mono text-5xl font-bold ${faint} opacity-20`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative">
                <span
                  className={`font-mono text-xs ${accent}`}
                >
                  [{String(index + 1).padStart(2, "0")}]
                </span>

                {project.title && (
                  <h3 className="text-2xl md:text-3xl font-bold mt-3 max-w-3xl">
                    {project.title}
                  </h3>
                )}

                {project.description && (
                  <p
                    className={`mt-5 max-w-4xl leading-7 ${muted}`}
                  >
                    {project.description}
                  </p>
                )}

                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-7">
                    {project.technologies.map(
                      (tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1.5 rounded-md ${accentBg} ${accent} font-mono text-xs`}
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>
                )}

                {(project.link || project.url) && (
                  <div className="mt-7">
                    <a
                      href={project.link || project.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 font-mono text-xs ${accent} hover:underline`}
                    >
                      <span>View Project</span>
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  // =========================================================
  // CERTIFICATES
  // =========================================================

  const renderCertificates = () => {
    if (!certificates.length) return null;

    return (
      <section
        id="certificates"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("certificates")}
          title="Certifications"
          command="certifications"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map(
            (certificate, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border ${border} ${card}`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-mono text-xs ${accent}`}
                  >
                    [{String(index + 1).padStart(2, "0")}]
                  </span>

                  {certificate.year && (
                    <span
                      className={`font-mono text-xs ${accent}`}
                    >
                      {certificate.year}
                    </span>
                  )}
                </div>

                {(certificate.title || certificate.name) && (
                  <h3 className="text-xl font-semibold mt-4">
                    {certificate.title || certificate.name}
                  </h3>
                )}

                {(certificate.description || certificate.issuer) && (
                  <p
                    className={`mt-3 leading-6 ${muted}`}
                  >
                    {certificate.description || certificate.issuer}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // ACHIEVEMENTS
  // =========================================================

  const renderAchievements = () => {
    if (!achievements.length) return null;

    return (
      <section
        id="achievements"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("achievements")}
          title="Achievements"
          command="achievements"
        />

        <div
          className={`rounded-2xl border ${border} ${card} overflow-hidden`}
        >
          {achievements.map(
            (achievement, index) => {
              const text =
                typeof achievement === "string"
                  ? achievement
                  : achievement.description || achievement.title;

              if (!text) return null;

              return (
                <div
                  key={index}
                  className={`flex gap-5 p-6 ${
                    index !== achievements.length - 1
                      ? `border-b ${border}`
                      : ""
                  }`}
                >
                  <span
                    className={`font-mono text-xs ${accent}`}
                  >
                    [{String(index + 1).padStart(2, "0")}]
                  </span>

                  <p
                    className={`leading-7 ${muted}`}
                  >
                    {text}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // LANGUAGES
  // =========================================================

  const renderLanguages = () => {
    if (!languages.length) return null;

    return (
      <section
        id="languages"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("languages")}
          title="Languages"
          command="languages"
        />

        <div className="flex flex-wrap gap-3">
          {languages.map(
            (language, index) => {
              const name =
                typeof language === "string"
                  ? language
                  : language.name || language.language;

              const level =
                typeof language === "object"
                  ? language?.level
                  : null;

              if (!name) return null;

              return (
                <div
                  key={index}
                  className={`px-5 py-4 rounded-xl border ${border} ${card}`}
                >
                  <span className="font-mono text-sm">
                    {name}
                  </span>

                  {level && (
                    <span
                      className={`ml-3 font-mono text-xs ${faint}`}
                    >
                      // {level}
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

  // =========================================================
  // CUSTOM SECTIONS
  // =========================================================

  const renderCustomSections = () => {
    if (!custom_sections.length) return null;

    return (
      <div className="space-y-16">
        {custom_sections.map((sec, sIdx) => {
          const items = toArray(sec.items);
          const title = sec.title || sec.heading;
          return (
            <section key={sIdx} id={`custom-${sIdx}`} className={`py-16 border-t ${border} scroll-mt-24`}>
              {title && (
                <Heading
                  number={String(9 + sIdx).padStart(2, "0")}
                  title={title}
                  command={`custom_${sIdx + 1}`}
                />
              )}
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((it, iIdx) => (
                    <div key={iIdx} className={`p-6 rounded-2xl border ${border} ${card}`}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        {(it.title || it.name) && (
                          <h3 className="font-mono text-base font-semibold">{it.title || it.name}</h3>
                        )}
                        {it.date && <span className={`font-mono text-xs ${faint}`}>{it.date}</span>}
                      </div>
                      {it.subtitle && <p className={`font-mono text-sm ${accent} mt-1`}>{it.subtitle}</p>}
                      {it.description && <p className={`mt-3 text-sm leading-6 ${muted}`}>{it.description}</p>}
                    </div>
                  ))}
                </div>
              ) : sec.content ? (
                <p className={`text-base leading-7 ${muted}`}>{sec.content}</p>
              ) : null}
            </section>
          );
        })}
      </div>
    );
  };

  // =========================================================
  // SECTION RENDERER
  // =========================================================

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

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div
      className={`min-h-screen ${page} overflow-hidden`}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className={`sticky top-0 z-50 border-b ${border} ${
          isDark
            ? "bg-[#080d0c]/90"
            : "bg-[#eef6f2]/90"
        } backdrop-blur-xl`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <Terminal
              size={18}
              className={accent}
            />

            <span
              className={`font-mono text-sm ${accent}`}
            >
              {personal.name || ""}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`font-mono text-xs capitalize ${muted} hover:${accent} transition`}
              >
                {section}
              </a>
            ))}
          </div>

          <span
            className={`font-mono text-xs ${faint}`}
          >
            {new Date().getFullYear()}
          </span>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header className="max-w-[1500px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className={`grid ${photo ? "lg:grid-cols-[280px_1fr] gap-14 lg:gap-20" : "max-w-4xl"} items-center`}>

          {/* PHOTO LEFT */}
          {photo && (
            <div className="flex justify-center lg:justify-start order-1">
              {renderPhoto()}
            </div>
          )}

          {/* CONTENT RIGHT */}
          <div className="order-2">
            {personal.title && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${accentBorder} ${accentBg} ${accent} font-mono text-xs`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {personal.title}
              </div>
            )}

            {personal.name && (
              <h1 className="mt-4 text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9]">
                {personal.name}
              </h1>
            )}

            {(personal.summary || resume?.summary) && (
              <p
                className={`mt-6 text-lg md:text-xl max-w-3xl leading-relaxed ${muted}`}
              >
                {personal.summary || resume?.summary}
              </p>
            )}

            {/* CONTACT */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-9">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className={`flex items-center gap-2 font-mono text-xs ${muted} hover:${accent}`}
                >
                  <Mail size={14} />
                  {personal.email}
                </a>
              )}

              {personal.phone && (
                <span
                  className={`flex items-center gap-2 font-mono text-xs ${muted}`}
                >
                  <Phone size={14} />
                  {personal.phone}
                </span>
              )}

              {personal.location && (
                <span
                  className={`flex items-center gap-2 font-mono text-xs ${muted}`}
                >
                  <MapPin size={14} />
                  {personal.location}
                </span>
              )}
            </div>

            {/* SOCIAL LINKS */}
            {(personal.github || linkedInUrl) && (
              <div className="flex gap-3 mt-8">
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${border} ${card} ${muted} hover:${accent} transition`}
                  >
                    <Github size={15} />
                    <span className="font-mono text-xs">
                      GitHub
                    </span>
                  </a>
                )}

                {linkedInUrl && (
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${border} ${card} ${muted} hover:${accent} transition`}
                  >
                    <Linkedin size={15} />
                    <span className="font-mono text-xs">
                      LinkedIn
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className={`mt-16 border-t ${border}`} />
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 pb-24">
        {sections.map((sec) => (
          <React.Fragment key={sec}>
            {renderSection(sec)}
          </React.Fragment>
        ))}
        {!sections?.includes("custom_sections") && renderCustomSections()}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className={`border-t ${border} ${panel} py-10`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            {personal.name && (
              <p
                className={`font-mono text-sm ${accent}`}
              >
                {personal.name}
              </p>
            )}

            {personal.title && (
              <p
                className={`font-mono text-xs ${faint} mt-1`}
              >
                {personal.title}
              </p>
            )}
          </div>

          <p
            className={`font-mono text-xs ${faint}`}
          >
            © {new Date().getFullYear()} {personal.name || ""}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default TechTemplate;