import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Terminal,
  Code2,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Linkedin, Github } from "../SocialIcons";

function TechTemplate({
  resume,
  photo,
  sections,
  theme,
}) {
  const personal = resume?.personal || {};
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

  const formatSectionName = (section) => {
    return section
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());
  };

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
    if (photo) {
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
            alt={personal.name || "Profile"}
            className={`relative w-full aspect-[4/5] object-cover rounded-3xl border ${border}`}
          />

          {/* developer label */}
          <div
            className={`absolute -bottom-5 -right-5 px-4 py-2 rounded-xl border ${accentBorder} ${accentBg} ${accent} font-mono text-xs`}
          >
            PROFILE_IMAGE
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative w-full max-w-[260px] aspect-[4/5] rounded-3xl border ${border} ${soft} flex flex-col items-center justify-center`}
      >
        <Terminal
          size={38}
          className={`${accent} mb-4`}
        />

        <span
          className={`font-mono text-xs uppercase tracking-widest ${faint}`}
        >
          / add_photo
        </span>
      </div>
    );
  };

  // =========================================================
  // SECTION HEADING
  // =========================================================

  const Heading = ({ number, title, command }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span
          className={`font-mono text-xs ${accent}`}
        >
          {number}
        </span>

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
    return (
      <section
        id="about"
        className="py-16 scroll-mt-24"
      >
        <Heading
          number={sectionNumber("about")}
          title="Profile"
          command="about_me"
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
              profile.md
            </span>
          </div>

          <div className="pt-7">
            <div
              className={`font-mono text-xs ${accent} mb-4`}
            >
              $ cat about.txt
            </div>

            <p
              className={`text-lg md:text-xl leading-8 max-w-4xl ${muted}`}
            >
              {resume?.about ||
                "A motivated professional interested in technology, continuous learning and building meaningful digital solutions."}
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
    const experience = Array.isArray(resume?.experience) ? resume.experience : [];
    if (!experience.length) return null;

    return (
      <section
        id="experience"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("experience")}
          title="Experience"
          command="work_history"
        />

        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border ${border} ${card} p-7 md:p-8 transition hover:border-[#6ee7b7]/50`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {item.role || item.title || "Role"}
                  </h3>
                  <p className={`font-mono text-sm ${accent} mt-1`}>
                    {item.company || item.organization || "Organization"}
                  </p>
                </div>
                <div className="font-mono text-xs sm:text-right">
                  <span className={muted}>
                    {item.duration || item.year || ""}
                  </span>
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
    if (!resume.education?.length) return null;

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
          {resume.education.map((item, index) => (
            <div
              key={index}
              className={`group grid md:grid-cols-[120px_1fr_auto] gap-5 items-center p-6 rounded-2xl border ${border} ${card}`}
            >
              <div
                className={`font-mono text-xs ${accent}`}
              >
                0{index + 1}
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  {item.course ||
                    item.degree ||
                    "Degree"}
                </h3>

                <p
                  className={`mt-2 ${muted}`}
                >
                  {item.institute ||
                    item.institution ||
                    ""}
                </p>
              </div>

              <div
                className={`font-mono text-xs ${faint}`}
              >
                {item.year || ""}
              </div>
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
    if (!resume.skills) return null;

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
          title="Tech Stack"
          command="skills"
        />

        <div
          className={`rounded-2xl border ${border} ${card} p-7`}
        >
          <div
            className={`font-mono text-xs ${accent} mb-6`}
          >
            $ ls ./skills
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((skill, index) => (
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
                  {skill}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // =========================================================
  // PROJECTS
  // =========================================================

  const renderProjects = () => {
    if (!resume.projects?.length) return null;

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
          {resume.projects.map((project, index) => (
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
                <div className="flex items-center gap-3">
                  <Code2
                    size={17}
                    className={accent}
                  />

                  <span
                    className={`font-mono text-xs ${accent}`}
                  >
                    project_{index + 1}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mt-5 max-w-3xl">
                  {project.title ||
                    "Untitled Project"}
                </h3>

                <p
                  className={`mt-5 max-w-4xl leading-7 ${muted}`}
                >
                  {project.description ||
                    "Project description"}
                </p>

                {project.technologies?.length >
                  0 && (
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

                <div
                  className={`mt-7 flex items-center gap-2 font-mono text-xs ${faint} group-hover:${accent}`}
                >
                  <span>$ ./open-project</span>

                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
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
    if (!resume.certificates?.length) return null;

    return (
      <section
        id="certificates"
        className={`py-16 border-t ${border} scroll-mt-24`}
      >
        <Heading
          number={sectionNumber("certificates")}
          title="Certificates"
          command="certificates"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {resume.certificates.map(
            (certificate, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border ${border} ${card}`}
              >
                <div className="flex justify-between">
                  <span
                    className={`font-mono text-xs ${accent}`}
                  >
                    CERT_{String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <ExternalLink
                    size={15}
                    className={faint}
                  />
                </div>

                <h3 className="text-xl font-semibold mt-6">
                  {certificate.title ||
                    certificate.name ||
                    "Certificate"}
                </h3>

                <p
                  className={`mt-3 leading-6 ${muted}`}
                >
                  {certificate.description ||
                    certificate.issuer ||
                    ""}
                </p>

                {certificate.year && (
                  <span
                    className={`inline-block mt-5 font-mono text-xs ${accent}`}
                  >
                    {certificate.year}
                  </span>
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
    if (!resume.achievements?.length) return null;

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
          {resume.achievements.map(
            (achievement, index) => (
              <div
                key={index}
                className={`flex gap-5 p-6 ${
                  index !==
                  resume.achievements.length - 1
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
                  {achievement.description ||
                    achievement}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // LANGUAGES
  // =========================================================

  const renderLanguages = () => {
    if (!resume.languages?.length) return null;

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
          {resume.languages.map(
            (language, index) => (
              <div
                key={index}
                className={`px-5 py-4 rounded-xl border ${border} ${card}`}
              >
                <span className="font-mono text-sm">
                  {language.name ||
                    language}
                </span>

                {language.level && (
                  <span
                    className={`ml-3 font-mono text-xs ${faint}`}
                  >
                    // {language.level}
                  </span>
                )}
              </div>
            )
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // CUSTOM SECTIONS
  // =========================================================

  const renderCustomSections = () => {
    const customSecs = toArray(resume?.custom_sections);
    if (!customSecs.length) return null;

    return (
      <div className="space-y-16">
        {customSecs.map((sec, sIdx) => {
          const items = toArray(sec.items);
          return (
            <section key={sIdx} id={`custom-${sIdx}`} className={`py-16 border-t ${border} scroll-mt-24`}>
              <Heading
                number={String(8 + sIdx).padStart(2, "0")}
                title={sec.title || sec.heading || "Additional Information"}
                command={`custom_${sIdx + 1}`}
              />
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((it, iIdx) => (
                    <div key={iIdx} className={`p-6 rounded-2xl border ${border} ${card}`}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="font-mono text-base font-semibold">{it.title || it.name || "Item"}</h3>
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
          <div className="flex items-center gap-3">
            <Terminal
              size={18}
              className={accent}
            />

            <span
              className={`font-mono text-sm ${accent}`}
            >
              portfolio.dev
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`font-mono text-xs ${muted} hover:${accent} transition`}
              >
                {section}
              </a>
            ))}
          </div>

          <span
            className={`font-mono text-xs ${faint}`}
          >
            v1.0
          </span>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header className="max-w-[1500px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-[280px_1fr] gap-14 lg:gap-20 items-center">

          {/* PHOTO LEFT */}

          <div className="flex justify-center lg:justify-start order-1">
            {renderPhoto()}
          </div>

          {/* CONTENT RIGHT */}

          <div className="order-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${accentBorder} ${accentBg} ${accent} font-mono text-xs`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />

              AVAILABLE_FOR_OPPORTUNITIES
            </div>

            <div
              className={`font-mono text-sm ${faint} mt-8`}
            >
              &gt; whoami
            </div>

            <h1 className="mt-3 text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9]">
              {personal.name ||
                "Your Name"}
            </h1>

            {personal.title && (
              <p className={`mt-4 font-mono text-xl md:text-2xl ${accent}`}>
                {personal.title}
              </p>
            )}

            <p
              className={`mt-6 text-lg md:text-xl max-w-3xl leading-relaxed ${muted}`}
            >
              {personal.title ? `Specialized in ${personal.title} with a focus on delivering high-impact results.` : "Dedicated to building practical and meaningful solutions."}
            </p>

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

            <div className="flex gap-3 mt-8">
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${border} ${card} ${muted} hover:${accent} transition`}
                >
                  <Github size={15} />
                  <span className="font-mono text-xs">
                    GitHub
                  </span>
                </a>
              )}

              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${border} ${card} ${muted} hover:${accent} transition`}
                >
                  <Linkedin size={15} />
                  <span className="font-mono text-xs">
                    LinkedIn
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* COMMAND LINE */}

        <div
          className={`mt-20 border-t ${border} pt-5 flex justify-between`}
        >
          <span
            className={`font-mono text-xs ${faint}`}
          >
            ~/portfolio
          </span>

          <span
            className={`font-mono text-xs ${accent}`}
          >
            $ ./start
          </span>
        </div>
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
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p
              className={`font-mono text-sm ${accent}`}
            >
              {personal.name ||
                "Portfolio"}
            </p>

            <p
              className={`font-mono text-xs ${faint} mt-2`}
            >
              &gt; end_of_portfolio
            </p>
          </div>

          <p
            className={`font-mono text-xs ${faint}`}
          >
            Created with SmartResumeAnalyzer
          </p>
        </div>
      </footer>
    </div>
  );
}

export default TechTemplate;