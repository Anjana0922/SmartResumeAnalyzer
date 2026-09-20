import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { Linkedin, Github } from "../SocialIcons";

function MinimalTemplate({
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
    ? "bg-[#171614] text-[#f1eee7]"
    : "bg-[#f8f6f1] text-[#242321]";

  const secondary = isDark
    ? "text-[#aaa59b]"
    : "text-[#77736b]";

  const faint = isDark
    ? "text-[#706c64]"
    : "text-[#a09b91]";

  const line = isDark
    ? "border-[#393731]"
    : "border-[#d8d4cb]";

  const accent = isDark
    ? "text-[#d7b98a]"
    : "text-[#856b43]";

  const accentLine = isDark
    ? "bg-[#d7b98a]"
    : "bg-[#856b43]";

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

  const skills =
    resume?.skills && !Array.isArray(resume.skills)
      ? resume.skills
      : {
          technical: toArray(resume?.skills),
        };

  // =========================================================
  // SECTION HEADING
  // =========================================================

  const SectionHeading = ({ number, title }) => (
    <div className="flex items-baseline gap-4 mb-8">
      <span
        className={`text-xs tracking-[0.25em] font-medium ${accent}`}
      >
        {number}
      </span>

      <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
        {title}
      </h2>
    </div>
  );

  // =========================================================
  // PHOTO
  // =========================================================

  const renderPhoto = () => {
    if (photo) {
      return (
        <div className="relative">
          <img
            src={photo}
            alt={personal.name || "Profile"}
            className="
              w-36
              h-48
              md:w-44
              md:h-56
              object-cover
              grayscale
              rounded-sm
            "
          />

          <div
            className={`
              absolute
              -bottom-3
              -right-3
              w-full
              h-full
              border
              ${line}
              -z-10
            `}
          />
        </div>
      );
    }

    return (
      <div
        className={`
          w-36
          h-48
          md:w-44
          md:h-56
          border
          ${line}
          flex
          items-center
          justify-center
          rounded-sm
        `}
      >
        <span
          className={`text-[10px] tracking-[0.3em] uppercase ${faint}`}
        >
          Photo
        </span>
      </div>
    );
  };

  // =========================================================
  // ABOUT
  // =========================================================

  const renderAbout = () => (
    <section
      id="about"
      className={`py-16 border-b ${line} scroll-mt-24`}
    >
      <SectionHeading number="01" title="Profile" />

      <div className="max-w-3xl">
        <p
          className={`
            font-serif
            text-xl
            md:text-2xl
            leading-relaxed
            ${secondary}
          `}
        >
          {resume.about ||
            "A motivated individual with an interest in learning, developing meaningful solutions and continuously growing through new experiences."}
        </p>
      </div>
    </section>
  );

  // =========================================================
  // EDUCATION
  // =========================================================

  const renderEducation = () => {
    if (!education.length) return null;

    return (
      <section
        id="education"
        className={`py-16 border-b ${line} scroll-mt-24`}
      >
        <SectionHeading number="02" title="Education" />

        <div className="space-y-8">
          {education.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[150px_1fr] gap-6"
            >
              <div>
                <span
                  className={`text-xs tracking-widest ${faint}`}
                >
                  {item.year || "—"}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl">
                  {item.degree ||
                    item.course ||
                    "Degree"}
                </h3>

                <p className={`mt-2 text-sm ${secondary}`}>
                  {item.institution ||
                    item.institute ||
                    "Institution"}
                </p>

                {item.score && (
                  <p
                    className={`mt-2 text-xs ${accent}`}
                  >
                    {typeof item.score === "object" && item.score !== null
                      ? `${item.score.label || "Score"}: ${item.score.value || ""}`
                      : String(item.score)}
                  </p>
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
        className={`py-16 border-b ${line} scroll-mt-24`}
      >
        <SectionHeading number="03" title="Experience" />

        <div className="space-y-10">
          {experience.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[150px_1fr] gap-6"
            >
              <div>
                <span className={`text-xs tracking-widest ${faint}`}>
                  {item.duration || item.year || "—"}
                </span>
                {item.location && (
                  <p className={`text-xs mt-1 ${faint}`}>
                    {item.location}
                  </p>
                )}
                {item.is_internship && (
                  <span className="inline-block mt-2 mr-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/40 text-amber-600 dark:text-amber-400">
                    Internship
                  </span>
                )}
                {item.employment_type && (
                  <span className={`inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${line} ${faint}`}>
                    {item.employment_type}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif text-xl">
                  {item.role || item.title || "Role / Position"}
                </h3>

                <p className={`mt-1 text-sm font-medium ${secondary}`}>
                  {item.company || item.organization || "Organization"}
                </p>

                {item.description && (
                  <p className={`mt-3 text-sm leading-relaxed ${secondary}`}>
                    {item.description}
                  </p>
                )}

                {Array.isArray(item.highlights) && item.highlights.filter(Boolean).length > 0 && (
                  <ul className={`mt-3 space-y-1 text-xs list-disc list-inside ${secondary}`}>
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
    if (!resume.skills) return null;

    const skillEntries = Array.isArray(resume.skills)
      ? [["Skills", resume.skills]]
      : Object.entries(resume.skills);

    return (
      <section
        id="skills"
        className={`py-16 border-b ${line} scroll-mt-24`}
      >
        <SectionHeading number="03" title="Expertise" />

        <div className="space-y-8">
          {skillEntries.map(([category, values]) => {
            if (!values?.length) return null;

            return (
              <div
                key={category}
                className="grid md:grid-cols-[150px_1fr] gap-6"
              >
                <span
                  className={`text-xs uppercase tracking-[0.18em] ${faint}`}
                >
                  {category.replace(
                    /([A-Z])/g,
                    " $1"
                  )}
                </span>

                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {values.map((skill, index) => (
                    <span
                      key={index}
                      className={`text-sm ${secondary}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
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
        className={`py-16 border-b ${line} scroll-mt-24`}
      >
        <SectionHeading number="04" title="Selected Work" />

        <div className="space-y-12">
          {projects.map((project, index) => (
            <article
              key={index}
              className="grid md:grid-cols-[55px_1fr] gap-5"
            >
              <div>
                <span
                  className={`font-serif text-lg ${accent}`}
                >
                  0{index + 1}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl">
                  {project.title ||
                    "Untitled Project"}
                </h3>

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

                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-5">
                    {project.technologies.map(
                      (tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`
                            text-[10px]
                            uppercase
                            tracking-widest
                            ${accent}
                          `}
                        >
                          {tech}
                        </span>
                      )
                    )}
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
        className={`py-16 border-b ${line} scroll-mt-24`}
      >
        <SectionHeading number="05" title="Certificates" />

        <div className="space-y-6">
          {certificates.map((certificate, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[150px_1fr] gap-6"
            >
              <span
                className={`text-xs ${faint}`}
              >
                {certificate.year || "—"}
              </span>

              <div>
                <h3 className="font-serif text-lg">
                  {certificate.name ||
                    certificate.title ||
                    "Certificate"}
                </h3>

                {(certificate.issuer ||
                  certificate.description) && (
                  <p
                    className={`mt-2 text-sm ${secondary}`}
                  >
                    {certificate.issuer ||
                      certificate.description}
                  </p>
                )}
              </div>
            </div>
          ))}
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
        className={`py-16 border-b ${line} scroll-mt-24`}
      >
        <SectionHeading number="06" title="Achievements" />

        <div className="max-w-3xl space-y-5">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex gap-5"
            >
              <span
                className={`mt-1 w-2 h-2 rounded-full ${accentLine}`}
              />

              <p
                className={`text-sm leading-7 ${secondary}`}
              >
                {typeof achievement === "string"
                  ? achievement
                  : achievement.description}
              </p>
            </div>
          ))}
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
        className={`py-16 scroll-mt-24`}
      >
        <SectionHeading number="07" title="Languages" />

        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {languages.map((language, index) => {
            const name =
              typeof language === "string"
                ? language
                : language.name;

            const level =
              typeof language === "string"
                ? ""
                : language.level;

            return (
              <div key={index}>
                <span className="font-serif text-lg">
                  {name}
                </span>

                {level && (
                  <span
                    className={`ml-3 text-xs ${faint}`}
                  >
                    {level}
                  </span>
                )}
              </div>
            );
          })}
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
          return (
            <section key={sIdx} id={`custom-${sIdx}`} className={`py-16 border-b ${line} scroll-mt-24`}>
              <SectionHeading number={String(8 + sIdx).padStart(2, "0")} title={sec.title || sec.heading || "Additional Information"} />
              {items.length > 0 ? (
                <div className="space-y-8">
                  {items.map((it, iIdx) => (
                    <div key={iIdx} className="grid md:grid-cols-[150px_1fr] gap-6">
                      <div>
                        {it.date && <span className={`text-xs tracking-widest ${faint}`}>{it.date}</span>}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl">{it.title || it.name || "Item"}</h3>
                        {it.subtitle && <p className={`mt-1 text-sm ${secondary}`}>{it.subtitle}</p>}
                        {it.description && <p className={`mt-2 text-sm leading-relaxed ${secondary}`}>{it.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : sec.content ? (
                <p className={`text-base leading-relaxed ${secondary}`}>{sec.content}</p>
              ) : null}
            </section>
          );
        })}
      </div>
    );
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const sectionNames = {
    about: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Expertise",
    projects: "Work",
    certificates: "Certificates",
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
        selection:bg-[#cdbb9b]/30
      `}
    >
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className={`
          border-b
          ${line}
          sticky
          top-0
          z-50
          backdrop-blur-md
          ${
            isDark
              ? "bg-[#171614]/90"
              : "bg-[#f8f6f1]/90"
          }
        `}
      >
        <div
          className="
            max-w-6xl
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
            className="font-serif text-lg"
          >
            {personal.name || "Portfolio"}
          </a>

          <div className="hidden md:flex items-center gap-7">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
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
            className={`text-xs ${faint}`}
          >
            2026
          </span>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header
        id="top"
        className="
          max-w-6xl
          mx-auto
          px-6
          md:px-10
          pt-20
          md:pt-28
          pb-20
        "
      >
        <div
          className="
            grid
            md:grid-cols-[auto_1fr]
            gap-12
            md:gap-16
            items-center
          "
        >
          {/* PHOTO LEFT */}

          <div className="flex justify-center md:justify-start">
            {renderPhoto()}
          </div>

          {/* INFORMATION RIGHT */}

          <div>
            <p
              className={`
                text-[10px]
                uppercase
                tracking-[0.3em]
                ${accent}
                mb-5
              `}
            >
              Curriculum Vitae
            </p>

            <h1
              className="
                font-serif
                text-5xl
                sm:text-6xl
                md:text-7xl
                lg:text-8xl
                leading-[0.9]
                tracking-tight
              "
            >
              {personal.name ||
                "Your Name"}
            </h1>

            {personal.title && (
              <p className={`mt-3 font-serif text-xl md:text-2xl ${secondary}`}>
                {personal.title}
              </p>
            )}

            <div
              className={`
                mt-6
                w-16
                h-px
                ${accentLine}
              `}
            />

            <div
              className={`
                flex
                flex-wrap
                gap-x-6
                gap-y-3
                mt-7
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

            <div className="flex gap-5 mt-6">
              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs ${faint} hover:${accent} transition`}
                >
                  <Linkedin size={16} />
                </a>
              )}

              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs ${faint} hover:${accent} transition`}
                >
                  <Github size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main
        className="
          max-w-5xl
          mx-auto
          px-6
          md:px-10
          pb-20
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
          ${line}
          py-8
        `}
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-6
            md:px-10
            flex
            flex-col
            md:flex-row
            justify-between
            gap-3
          "
        >
          <p className="font-serif text-sm">
            {personal.name || "Portfolio"}
          </p>

          <p
            className={`text-[10px] uppercase tracking-[0.2em] ${faint}`}
          >
            Personal Portfolio
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MinimalTemplate;