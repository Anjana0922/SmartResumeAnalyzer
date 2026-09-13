import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

function AestheticTemplate({
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
    ? "bg-[#1c1917] text-[#f7f1e8]"
    : "bg-[#faf6ef] text-[#3d3832]";

  const surface = isDark
    ? "bg-[#27221e]"
    : "bg-[#fffdf9]";

  const softSurface = isDark
    ? "bg-[#302924]"
    : "bg-[#f1e7da]";

  const muted = isDark
    ? "text-[#c8bdb2]"
    : "text-[#756c63]";

  const faint = isDark
    ? "text-[#8f8378]"
    : "text-[#a79d93]";

  const border = isDark
    ? "border-[#403830]"
    : "border-[#e5d9ca]";

  const accent = isDark
    ? "text-[#e6a58d]"
    : "text-[#b8735c]";

  const accentBg = isDark
    ? "bg-[#4a3029]"
    : "bg-[#f2d9cc]";

  const accentBorder = isDark
    ? "border-[#69463a]"
    : "border-[#e6bdae]";

  const decorative = isDark
    ? "bg-[#533d35]"
    : "bg-[#ead5c5]";

  // =========================================================
  // HELPERS
  // =========================================================

  const safeArray = (value) => {
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

  const education = safeArray(resume?.education);
  const experience = safeArray(resume?.experience);
  const projects = safeArray(resume?.projects);
  const certificates = safeArray(resume?.certificates);
  const achievements = safeArray(resume?.achievements);
  const languages = safeArray(resume?.languages);

  // Skills can be either an array or an object of categories
  const skills =
    Array.isArray(resume?.skills)
      ? resume.skills
      : resume?.skills &&
        typeof resume.skills === "object"
      ? Object.entries(resume.skills).flatMap(
          ([category, values]) =>
            Array.isArray(values)
              ? values.map((value) => ({
                  category,
                  value,
                }))
              : []
        )
      : [];

  // =========================================================
  // SECTION HEADING
  // =========================================================

  const SectionHeading = ({
    number,
    title,
    subtitle,
  }) => (
    <div className="mb-12">
      <div className="flex items-end gap-5">
        <span
          className={`font-serif italic text-5xl md:text-6xl ${accent} leading-none`}
        >
          {number}
        </span>

        <div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p
              className={`mt-2 text-sm ${muted}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div
        className={`mt-6 h-px w-full ${border}`}
      />
    </div>
  );

  // =========================================================
  // PHOTO
  // =========================================================

  const renderPhoto = () => {
    if (photo) {
      return (
        <div className="relative w-full max-w-[330px]">
          {/* Decorative shape */}
          <div
            className={`absolute -top-6 -left-6 w-20 h-20 rounded-full ${decorative}`}
          />

          <div
            className={`absolute -bottom-7 -right-7 w-28 h-28 rounded-[2rem] ${accentBg}`}
          />

          <div className="relative">
            <img
              src={photo}
              alt={personal.name || "Profile"}
              className={`w-full aspect-[4/5] object-cover rounded-[45%_45%_18%_18%] border-4 ${border} shadow-xl`}
            />

            {/* Small decorative label */}
            <div
              className={`absolute -bottom-5 left-6 px-5 py-3 rounded-full ${surface} border ${border} shadow-lg`}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={15}
                  className={accent}
                />

                <span
                  className={`text-xs tracking-widest uppercase ${muted}`}
                >
                  Portfolio
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative w-full max-w-[330px] aspect-[4/5] rounded-[45%_45%_18%_18%] border-4 ${border} ${softSurface} flex flex-col items-center justify-center`}
      >
        <div
          className={`w-20 h-20 rounded-full ${accentBg} flex items-center justify-center`}
        >
          <Sparkles
            size={30}
            className={accent}
          />
        </div>

        <p
          className={`mt-5 text-xs tracking-widest uppercase ${faint}`}
        >
          Add Photo
        </p>
      </div>
    );
  };

  // =========================================================
  // SOCIAL LINKS
  // =========================================================

  const SocialLinks = () => (
    <div className="flex flex-wrap gap-3 mt-7">
      {personal.linkedin && (
        <a
          href={personal.linkedin}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${border} ${surface} ${muted} hover:${accent} transition`}
        >
          <Linkedin size={15} />
          LinkedIn
        </a>
      )}

      {personal.github && (
        <a
          href={personal.github}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${border} ${surface} ${muted} transition`}
        >
          <Github size={15} />
          GitHub
        </a>
      )}
    </div>
  );

  // =========================================================
  // SECTION RENDERING
  // =========================================================

  const renderSection = (section) => {
    switch (section) {
      // =====================================================
      // ABOUT
      // =====================================================

      case "about":
        return (
          <section
            key="about"
            id="about"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="01"
              title="A little about me"
              subtitle="The person behind the work"
            />

            <div className="grid md:grid-cols-[0.7fr_1.3fr] gap-12 items-start">
              <div>
                <p
                  className={`font-serif italic text-3xl leading-relaxed ${accent}`}
                >
                  "Ideas become meaningful when they are turned into something useful."
                </p>
              </div>

              <div
                className={`p-8 md:p-10 rounded-[2rem] ${surface} border ${border}`}
              >
                <p
                  className={`text-lg leading-8 ${muted}`}
                >
                  {resume.about ||
                    "I am a motivated professional with an interest in technology, continuous learning and building meaningful solutions."}
                </p>
              </div>
            </div>
          </section>
        );

      // =====================================================
      // EXPERIENCE
      // =====================================================

      case "experience":
        if (!experience.length) return null;

        return (
          <section
            key="experience"
            id="experience"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="02"
              title="Experience & Work History"
              subtitle="Professional journey and career achievements"
            />

            <div className="relative">
              {/* Timeline line */}
              <div
                className={`absolute left-[11px] top-2 bottom-2 w-px ${border}`}
              />

              <div className="space-y-10">
                {experience.map((item, index) => (
                  <div
                    key={index}
                    className="relative pl-12"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-1 w-[23px] h-[23px] rounded-full ${accentBg} border-4 ${page.replace(
                        "bg-",
                        "border-"
                      )} ${accentBorder}`}
                    />

                    <div
                      className={`p-7 rounded-[1.5rem] ${surface} border ${border}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`font-mono text-xs ${accent}`}
                        >
                          0{index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          {item?.duration && (
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${decorative} ${muted}`}
                            >
                              {item.duration}
                            </span>
                          )}
                          {item?.employment_type && (
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${accentBg} ${accent}`}
                            >
                              {item.employment_type}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl mt-4">
                        {item?.role || item?.title || "Role"}
                      </h3>

                      <p className={`text-sm mt-1 font-medium ${accent}`}>
                        {item?.company || item?.organization || "Organization"}
                        {item?.location && ` · ${item.location}`}
                      </p>

                      {item?.description && (
                        <p className={`mt-4 text-sm leading-7 ${muted}`}>
                          {item.description}
                        </p>
                      )}

                      {Array.isArray(item?.highlights) && item.highlights.filter(Boolean).length > 0 && (
                        <ul className={`mt-3 space-y-1 text-xs list-disc list-inside ${muted}`}>
                          {item.highlights.filter(Boolean).map((hl, hIdx) => (
                            <li key={hIdx}>{hl}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      // =====================================================
      // EDUCATION
      // =====================================================

      case "education":
        if (!education.length) return null;

        return (
          <section
            key="education"
            id="education"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="02"
              title="Education"
              subtitle="Learning and growing along the way"
            />

            <div className="relative">
              {/* Timeline line */}
              <div
                className={`absolute left-[11px] top-2 bottom-2 w-px ${border}`}
              />

              <div className="space-y-10">
                {education.map((item, index) => {
                  const degree =
                    item?.degree ||
                    item?.course ||
                    "";

                  const institution =
                    item?.institution ||
                    item?.institute ||
                    "";

                  return (
                    <div
                      key={index}
                      className="relative pl-12"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 top-1 w-[23px] h-[23px] rounded-full ${accentBg} border-4 ${page.replace(
                          "bg-",
                          "border-"
                        )} ${accentBorder}`}
                      />

                      <div
                        className={`p-7 rounded-[1.5rem] ${surface} border ${border}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span
                            className={`font-mono text-xs ${accent}`}
                          >
                            0
                            {index + 1}
                          </span>

                          {item?.year && (
                            <span
                              className={`text-sm ${faint}`}
                            >
                              {item.year}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-2xl mt-4">
                          {degree}
                        </h3>

                        <p
                          className={`mt-2 ${muted}`}
                        >
                          {institution}
                        </p>

                        {item?.score && (
                          <span
                            className={`inline-block mt-5 px-4 py-2 rounded-full ${accentBg} ${accent} text-xs`}
                          >
                            {item.score.label}:{" "}
                            {item.score.value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      // =====================================================
      // SKILLS
      // =====================================================

      case "skills":
        if (!skills.length) return null;

        return (
          <section
            key="skills"
            id="skills"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="03"
              title="Things I work with"
              subtitle="Tools, technologies and abilities"
            />

            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => {
                const value =
                  typeof skill === "string"
                    ? skill
                    : skill?.value;

                if (!value) return null;

                return (
                  <span
                    key={index}
                    className={`px-5 py-3 rounded-full border ${accentBorder} ${accentBg} ${accent} text-sm`}
                  >
                    {value}
                  </span>
                );
              })}
            </div>
          </section>
        );

      // =====================================================
      // PROJECTS
      // =====================================================

      case "projects":
        if (!projects.length) return null;

        return (
          <section
            key="projects"
            id="projects"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="04"
              title="Selected work"
              subtitle="A few things I have built"
            />

            <div className="grid md:grid-cols-2 gap-7">
              {projects.map((project, index) => (
                <article
                  key={index}
                  className={`group relative overflow-hidden rounded-[2rem] border ${border} ${surface} p-8 md:p-10 ${
                    index % 2 === 1
                      ? "md:translate-y-10"
                      : ""
                  }`}
                >
                  {/* Decorative circle */}
                  <div
                    className={`absolute -top-16 -right-16 w-36 h-36 rounded-full ${accentBg} opacity-60`}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-serif italic text-3xl ${accent}`}
                      >
                        0{index + 1}
                      </span>

                      <ArrowUpRight
                        size={22}
                        className={`${muted} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`}
                      />
                    </div>

                    <h3 className="font-serif text-3xl mt-8">
                      {project?.title ||
                        "Untitled Project"}
                    </h3>

                    <p
                      className={`mt-5 leading-7 ${muted}`}
                    >
                      {project?.description ||
                        "Project description"}
                    </p>

                    {project?.technologies?.length >
                      0 && (
                      <div className="flex flex-wrap gap-2 mt-7">
                        {project.technologies.map(
                          (technology, techIndex) => (
                            <span
                              key={techIndex}
                              className={`text-xs px-3 py-1.5 rounded-full ${softSurface} ${muted}`}
                            >
                              {technology}
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

      // =====================================================
      // CERTIFICATES
      // =====================================================

      case "certificates":
        if (!certificates.length) return null;

        return (
          <section
            key="certificates"
            id="certificates"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="05"
              title="Certificates"
              subtitle="Milestones worth keeping"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map(
                (certificate, index) => (
                  <div
                    key={index}
                    className={`p-7 rounded-[1.75rem] border ${border} ${surface} relative`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${accentBg} flex items-center justify-center ${accent} font-serif italic`}
                    >
                      {index + 1}
                    </div>

                    <h3 className="font-serif text-xl mt-6">
                      {certificate?.name ||
                        certificate?.title ||
                        "Certificate"}
                    </h3>

                    {(certificate?.issuer ||
                      certificate?.description) && (
                      <p
                        className={`mt-3 text-sm leading-6 ${muted}`}
                      >
                        {certificate.issuer ||
                          certificate.description}
                      </p>
                    )}

                    {certificate?.year && (
                      <span
                        className={`inline-block mt-5 text-xs ${faint}`}
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

      // =====================================================
      // ACHIEVEMENTS
      // =====================================================

      case "achievements":
        if (!achievements.length) return null;

        return (
          <section
            key="achievements"
            id="achievements"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="06"
              title="Little wins"
              subtitle="Achievements and moments that matter"
            />

            <div className="space-y-5">
              {achievements.map(
                (achievement, index) => {
                  const text =
                    typeof achievement ===
                    "string"
                      ? achievement
                      : achievement?.description ||
                        achievement?.title ||
                        "";

                  if (!text) return null;

                  return (
                    <div
                      key={index}
                      className={`p-7 md:p-9 rounded-[1.75rem] ${softSurface} relative overflow-hidden`}
                    >
                      <span
                        className={`absolute -right-3 -top-8 font-serif text-[9rem] leading-none ${accent} opacity-10`}
                      >
                        {index + 1}
                      </span>

                      <div className="relative flex gap-6">
                        <span
                          className={`font-serif italic text-2xl ${accent}`}
                        >
                          “
                        </span>

                        <p
                          className={`font-serif text-xl md:text-2xl leading-relaxed ${muted}`}
                        >
                          {text}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        );

      // =====================================================
      // LANGUAGES
      // =====================================================

      case "languages":
        if (!languages.length) return null;

        return (
          <section
            key="languages"
            id="languages"
            className="py-24 scroll-mt-24"
          >
            <SectionHeading
              number="07"
              title="Languages"
              subtitle="Words connect people"
            />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((language, index) => {
                const name =
                  typeof language === "string"
                    ? language
                    : language?.name ||
                      language?.language ||
                      "";

                const level =
                  typeof language === "object"
                    ? language?.level
                    : null;

                if (!name) return null;

                return (
                  <div
                    key={index}
                    className={`p-6 rounded-[1.5rem] border ${border} ${surface}`}
                  >
                    <span
                      className={`font-serif text-2xl`}
                    >
                      {name}
                    </span>

                    {level && (
                      <p
                        className={`mt-2 text-xs uppercase tracking-widest ${faint}`}
                      >
                        {level}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );

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
          NAVIGATION
      ===================================================== */}

      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b ${border} ${
          isDark
            ? "bg-[#1c1917]/90"
            : "bg-[#faf6ef]/90"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <a
            href="#top"
            className={`font-serif italic text-xl ${accent}`}
          >
            {personal.name || "Portfolio"}
          </a>

          <div className="hidden md:flex items-center gap-7">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-xs capitalize ${muted} hover:${accent} transition`}
              >
                {section}
              </a>
            ))}
          </div>

          <span
            className={`font-serif italic text-lg ${faint}`}
          >
            '26
          </span>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header
        id="top"
        className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28"
      >
        <div className="grid lg:grid-cols-[330px_1fr] gap-16 lg:gap-24 items-center">
          {/* PHOTO LEFT */}

          <div className="flex justify-center lg:justify-start">
            {renderPhoto()}
          </div>

          {/* CONTENT RIGHT */}

          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${accentBorder} ${accentBg} ${accent} text-xs tracking-widest uppercase`}
            >
              <Sparkles size={13} />
              Personal Portfolio
            </div>

            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.9] tracking-tight mt-7">
              {personal.name ||
                "Your Name"}
            </h1>

            {personal.title && (
              <p className={`font-serif italic text-2xl md:text-3xl mt-4 ${accent}`}>
                {personal.title}
              </p>
            )}

            <p
              className={`font-serif italic text-xl md:text-2xl mt-6 max-w-2xl ${accent}`}
            >
              {personal.title ? `Dedicated to excellence and innovation as a ${personal.title}.` : "Dedicated to learning, creating, and delivering meaningful work."}
            </p>

            <div
              className={`mt-9 flex flex-col gap-3 text-sm ${muted}`}
            >
              {personal.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span>{personal.email}</span>
                </div>
              )}

              {personal.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>{personal.phone}</span>
                </div>
              )}

              {personal.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>{personal.location}</span>
                </div>
              )}
            </div>

            <SocialLinks />
          </div>
        </div>
      </header>

      {/* =====================================================
          DECORATIVE DIVIDER
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center gap-4">
          <div
            className={`w-3 h-3 rounded-full ${accentBg}`}
          />

          <div
            className={`h-px flex-1 ${border}`}
          />

          <span
            className={`font-serif italic text-sm ${faint}`}
          >
            scroll to explore
          </span>

          <div
            className={`h-px flex-1 ${border}`}
          />

          <div
            className={`w-3 h-3 rounded-full ${accentBg}`}
          />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        {sections.map(renderSection)}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className={`border-t ${border} py-12`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p
                className={`font-serif italic text-2xl ${accent}`}
              >
                {personal.name ||
                  "Your Name"}
              </p>

              <p
                className={`mt-2 text-sm ${muted}`}
              >
                A collection of work, ideas and experiences.
              </p>
            </div>

            <div className="text-left md:text-right">
              <p
                className={`text-xs uppercase tracking-widest ${faint}`}
              >
                Created with
              </p>

              <p
                className={`font-serif mt-1 ${muted}`}
              >
                SmartResumeAnalyzer
              </p>
            </div>
          </div>

          <div
            className={`mt-10 pt-6 border-t ${border} flex justify-between`}
          >
            <span
              className={`text-xs ${faint}`}
            >
              © 2026
            </span>

            <span
              className={`font-serif italic text-sm ${accent}`}
            >
              Keep creating.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AestheticTemplate;