import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import { Linkedin, Github, formatLinkedInUrl } from "../SocialIcons";

function DarkTemplate({
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
    ? "bg-[#090909] text-[#f5f5f5]"
    : "bg-[#f4f4f2] text-[#151515]";

  const panel = isDark
    ? "bg-[#111111]"
    : "bg-[#ffffff]";

  const secondary = isDark
    ? "text-[#a3a3a3]"
    : "text-[#666666]";

  const faint = isDark
    ? "text-[#5f5f5f]"
    : "text-[#999999]";

  const border = isDark
    ? "border-[#262626]"
    : "border-[#dddddd]";

  const accent = isDark
    ? "text-[#ff6b4a]"
    : "text-[#d84d32]";

  const accentBg = isDark
    ? "bg-[#ff6b4a]"
    : "bg-[#d84d32]";

  const accentSoft = isDark
    ? "bg-[#ff6b4a]/10"
    : "bg-[#d84d32]/10";

  // =========================================================
  // HELPERS
  // =========================================================

  const toArray = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
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

  // =========================================================
  // SECTION HEADING
  // =========================================================

  const SectionHeading = ({
    number,
    title,
  }) => (
    <div className="flex items-center gap-5 mb-10">
      {number && (
        <span
          className={`
            text-[10px]
            font-bold
            tracking-[0.25em]
            ${accent}
          `}
        >
          {number}
        </span>
      )}

      <div
        className={`
          h-px
          flex-1
          ${isDark ? "bg-[#292929]" : "bg-[#dddddd]"}
        `}
      />

      <h2
        className="
          text-xs
          font-bold
          uppercase
          tracking-[0.2em]
        "
      >
        {title}
      </h2>
    </div>
  );

  // =========================================================
  // PHOTO
  // =========================================================

  const renderPhoto = () => {
    if (!photo) return null;

    return (
      <div className="relative inline-block">
        <div
          className={`
            absolute
            -inset-2
            border
            ${border}
            rotate-3
          `}
        />

        <img
          src={photo}
          alt={personal.name || ""}
          className="
            relative
            w-36
            h-36
            md:w-44
            md:h-44
            object-cover
            grayscale
            contrast-125
          "
        />

        <div
          className={`
            absolute
            -bottom-2
            -right-2
            w-5
            h-5
            ${accentBg}
          `}
        />
      </div>
    );
  };

  // =========================================================
  // ABOUT
  // =========================================================

  const renderAbout = () => {
    const aboutText = resume?.about || resume?.summary || personal.summary;
    if (!aboutText) return null;

    return (
      <section
        id="about"
        className="py-20 scroll-mt-24"
      >
        <SectionHeading
          number="01"
          title="About"
        />

        <div
          className="
            grid
            lg:grid-cols-[180px_1fr]
            gap-10
          "
        >
          <div>
            <span
              className={`
                text-[10px]
                uppercase
                tracking-[0.2em]
                ${faint}
              `}
            >
              Introduction
            </span>
          </div>

          <p
            className={`
              text-2xl
              md:text-3xl
              leading-relaxed
              font-light
              max-w-4xl
              ${secondary}
              whitespace-pre-line
            `}
          >
            {aboutText}
          </p>
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
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="02"
          title="Education"
        />

        <div className="space-y-0">
          {education.map((item, index) => (
            <div
              key={index}
              className={`
                grid
                md:grid-cols-[160px_1fr]
                gap-8
                py-8
                border-b
                ${border}
              `}
            >
              <div>
                <span
                  className={`
                    text-xs
                    font-mono
                    ${faint}
                  `}
                >
                  {item.year || item.duration || "—"}
                </span>
              </div>

              <div>
                {(item.degree || item.course) && (
                  <h3 className="text-xl font-semibold">
                    {item.degree || item.course}
                  </h3>
                )}

                {(item.institution || item.institute) && (
                  <p
                    className={`mt-2 text-sm ${secondary}`}
                  >
                    {item.institution || item.institute}
                  </p>
                )}

                {item.score && (
                  <span
                    className={`
                      inline-block
                      mt-4
                      px-3
                      py-1
                      text-[10px]
                      uppercase
                      tracking-widest
                      ${accentSoft}
                      ${accent}
                    `}
                  >
                    {typeof item.score === "object" && item.score !== null
                      ? `${item.score.label || "Score"}: ${item.score.value || ""}`
                      : String(item.score)}
                  </span>
                )}
              </div>
            </div>
          ))}
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
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="03"
          title="Experience"
        />

        <div className="space-y-0">
          {experience.map((item, index) => (
            <div
              key={index}
              className={`
                grid
                md:grid-cols-[160px_1fr]
                gap-8
                py-8
                border-b
                ${border}
              `}
            >
              <div>
                <span className={`text-xs font-mono ${faint}`}>
                  {item.duration || item.year || "—"}
                </span>
                {item.location && (
                  <p className={`text-xs mt-1 ${faint}`}>{item.location}</p>
                )}
                {item.is_internship && (
                  <span className={`inline-block mt-2 mr-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30`}>
                    Internship
                  </span>
                )}
                {item.employment_type && (
                  <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono ${accentSoft} ${accent}`}>
                    {item.employment_type}
                  </span>
                )}
              </div>

              <div>
                {(item.role || item.title) && (
                  <h3 className="text-xl font-semibold">
                    {item.role || item.title}
                  </h3>
                )}

                {(item.company || item.organization) && (
                  <p className={`mt-1 text-sm font-medium ${secondary}`}>
                    {item.company || item.organization}
                  </p>
                )}

                {item.description && (
                  <p className={`mt-3 text-sm leading-relaxed ${secondary}`}>
                    {item.description}
                  </p>
                )}

                {Array.isArray(item.highlights) && item.highlights.filter(Boolean).length > 0 && (
                  <ul className={`mt-3 space-y-1 text-xs ${secondary} list-disc list-inside`}>
                    {item.highlights.filter(Boolean).map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                )}
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
    if (!resume?.skills) return null;

    const skillGroups = Array.isArray(resume.skills)
      ? [["Skills", resume.skills]]
      : typeof resume.skills === "object"
      ? Object.entries(resume.skills)
      : [];

    if (!skillGroups.length) return null;

    return (
      <section
        id="skills"
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="04"
          title="Skills"
        />

        <div
          className="
            grid
            md:grid-cols-2
            gap-x-16
            gap-y-12
          "
        >
          {skillGroups.map(
            ([category, values]) => {
              if (!values?.length) return null;

              return (
                <div key={category}>
                  <h3
                    className={`
                      text-[10px]
                      uppercase
                      tracking-[0.25em]
                      ${faint}
                    `}
                  >
                    {category.replace(
                      /([A-Z])/g,
                      " $1"
                    )}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {values.map(
                      (skill, index) => {
                        const val = typeof skill === "string" ? skill : skill?.name || skill?.value;
                        if (!val) return null;
                        return (
                          <span
                            key={index}
                            className={`
                              px-4
                              py-2
                              border
                              ${border}
                              ${panel}
                              text-xs
                              hover:${accent}
                              hover:border-current
                              transition
                            `}
                          >
                            {val}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
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
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="05"
          title="Projects"
        />

        <div className="space-y-4">
          {projects.map((project, index) => (
            <article
              key={index}
              className={`
                group
                relative
                p-7
                md:p-9
                border
                ${border}
                ${panel}
                hover:border-[#444]
                transition
              `}
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-6
                "
              >
                <div className="flex gap-6">
                  <span
                    className={`
                      text-xs
                      font-mono
                      ${accent}
                    `}
                  >
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    {project.title && (
                      <h3 className="text-2xl font-semibold">
                        {project.title}
                      </h3>
                    )}

                    {project.description && (
                      <p
                        className={`
                          mt-4
                          max-w-3xl
                          text-sm
                          leading-7
                          ${secondary}
                        `}
                      >
                        {project.description}
                      </p>
                    )}

                    {project.technologies
                      ?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {project.technologies.map(
                          (tech, techIndex) => (
                            <span
                              key={techIndex}
                              className={`
                                text-[9px]
                                uppercase
                                tracking-widest
                                ${faint}
                              `}
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ArrowUpRight
                  size={20}
                  className={`
                    ${faint}
                    group-hover:${accent}
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    transition
                  `}
                />
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
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="06"
          title="Certifications"
        />

        <div className="grid md:grid-cols-2 gap-5">
          {certificates.map(
            (certificate, index) => (
              <div
                key={index}
                className={`
                  p-7
                  border
                  ${border}
                  ${panel}
                `}
              >
                {certificate.year && (
                  <span
                    className={`
                      text-[9px]
                      uppercase
                      tracking-[0.25em]
                      ${accent}
                    `}
                  >
                    {certificate.year}
                  </span>
                )}

                {(certificate.name || certificate.title) && (
                  <h3 className="mt-5 text-lg font-semibold">
                    {certificate.name || certificate.title}
                  </h3>
                )}

                {(certificate.issuer || certificate.description) && (
                  <p
                    className={`
                      mt-3
                      text-sm
                      leading-6
                      ${secondary}
                    `}
                  >
                    {certificate.issuer || certificate.description}
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
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="07"
          title="Achievements"
        />

        <div className="max-w-4xl">
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
                  className={`
                    flex
                    gap-6
                    py-6
                    border-b
                    ${border}
                  `}
                >
                  <span
                    className={`
                      text-xs
                      font-mono
                      ${faint}
                    `}
                  >
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <p
                    className={`
                      text-sm
                      leading-7
                      ${secondary}
                    `}
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
        className={`
          py-20
          border-t
          ${border}
          scroll-mt-24
        `}
      >
        <SectionHeading
          number="08"
          title="Languages"
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  className={`
                    p-5
                    border
                    ${border}
                    ${panel}
                  `}
                >
                  <p className="font-semibold">
                    {name}
                  </p>

                  {level && (
                    <p
                      className={`mt-2 text-xs ${faint}`}
                    >
                      {level}
                    </p>
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
      <div className="space-y-0">
        {custom_sections.map((sec, sIdx) => {
          const items = toArray(sec.items);
          const title = sec.title || sec.heading;
          return (
            <section key={sIdx} id={`custom-${sIdx}`} className={`py-20 border-t ${border} scroll-mt-24`}>
              {title && (
                <SectionHeading number={String(9 + sIdx).padStart(2, "0")} title={title} />
              )}
              {items.length > 0 ? (
                <div className="space-y-0">
                  {items.map((it, iIdx) => (
                    <div key={iIdx} className={`grid md:grid-cols-[160px_1fr] gap-8 py-8 border-b ${border}`}>
                      <div>
                        {it.date && <span className={`text-xs font-mono ${faint}`}>{it.date}</span>}
                      </div>
                      <div>
                        {(it.title || it.name) && (
                          <h3 className="text-xl font-semibold">{it.title || it.name}</h3>
                        )}
                        {it.subtitle && <p className={`mt-1 text-sm font-medium ${secondary}`}>{it.subtitle}</p>}
                        {it.description && <p className={`mt-3 text-sm leading-relaxed ${secondary}`}>{it.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : sec.content ? (
                <p className={`text-sm md:text-base leading-relaxed ${secondary}`}>{sec.content}</p>
              ) : null}
            </section>
          );
        })}
      </div>
    );
  };

  // =========================================================
  // NAVIGATION LABELS
  // =========================================================

  const sectionNames = {
    about: "About",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certificates: "Certifications",
    achievements: "Achievements",
    languages: "Languages",
  };

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div
      className={`
        min-h-screen
        ${page}
        font-sans
      `}
    >
      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <nav
        className={`
          sticky
          top-0
          z-50
          border-b
          ${border}
          ${
            isDark
              ? "bg-[#090909]/90"
              : "bg-[#f4f4f2]/90"
          }
          backdrop-blur-xl
        `}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-10
            py-4
            flex
            items-center
            justify-between
          "
        >
          <a
            href="#top"
            className={`
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              ${accent}
            `}
          >
            {personal.name || ""}
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  ${faint}
                  hover:${accent}
                  transition
                `}
              >
                {sectionNames[section] ||
                  section}
              </a>
            ))}
          </div>

          <span
            className={`
              text-[9px]
              font-mono
              ${faint}
            `}
          >
            {new Date().getFullYear()}
          </span>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header
        id="top"
        className="
          max-w-7xl
          mx-auto
          px-6
          md:px-10
          pt-20
          md:pt-28
          pb-24
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >
          {/* CENTERED PHOTO */}
          {photo && (
            <div className="mb-12">
              {renderPhoto()}
            </div>
          )}

          {/* NAME */}
          {personal.name && (
            <h1
              className="
                mt-6
                text-6xl
                sm:text-7xl
                md:text-8xl
                lg:text-[9rem]
                font-black
                tracking-[-0.06em]
                leading-[0.8]
              "
            >
              {personal.name}
            </h1>
          )}

          {personal.title && (
            <p className={`mt-4 text-xl md:text-2xl font-mono ${accent}`}>
              {personal.title}
            </p>
          )}

          {(personal.summary || resume?.summary) && (
            <p className={`mt-4 max-w-2xl text-sm md:text-base leading-relaxed ${secondary}`}>
              {personal.summary || resume?.summary}
            </p>
          )}

          {/* ACCENT LINE */}
          {(personal.name || personal.title) && (
            <div
              className={`
                mt-10
                w-24
                h-1
                ${accentBg}
              `}
            />
          )}

          {/* CONTACT */}
          <div
            className={`
              flex
              flex-wrap
              justify-center
              gap-x-7
              gap-y-3
              mt-8
              text-xs
              ${secondary}
            `}
          >
            {personal.email && (
              <span className="flex items-center gap-2">
                <Mail size={13} />
                {personal.email}
              </span>
            )}

            {personal.phone && (
              <span className="flex items-center gap-2">
                <Phone size={13} />
                {personal.phone}
              </span>
            )}

            {personal.location && (
              <span className="flex items-center gap-2">
                <MapPin size={13} />
                {personal.location}
              </span>
            )}
          </div>

          {/* SOCIAL LINKS */}
          {(linkedInUrl || personal.github) && (
            <div className="flex gap-5 mt-6">
              {linkedInUrl && (
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    ${faint}
                    hover:${accent}
                    transition
                  `}
                >
                  <Linkedin size={17} />
                </a>
              )}

              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    ${faint}
                    hover:${accent}
                    transition
                  `}
                >
                  <Github size={17} />
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main
        className="
          max-w-6xl
          mx-auto
          px-6
          md:px-10
          pb-24
        "
      >
        {sections.map((section) => {
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
        })}
        {!sections?.includes("custom_sections") && renderCustomSections()}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className={`
          border-t
          ${border}
          py-10
        `}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-10
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            {personal.name && (
              <p className="font-semibold text-sm">
                {personal.name}
              </p>
            )}

            {personal.title && (
              <p
                className={`text-[10px] mt-1 ${faint}`}
              >
                {personal.title}
              </p>
            )}
          </div>

          <p
            className={`
              text-[9px]
              uppercase
              tracking-[0.25em]
              ${faint}
            `}
          >
            © {new Date().getFullYear()} {personal.name || ""}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default DarkTemplate;