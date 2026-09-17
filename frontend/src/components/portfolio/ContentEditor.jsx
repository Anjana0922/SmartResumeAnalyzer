import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Loader2, Plus, Trash2, Check, User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2, Award, Trophy, Languages as LanguagesIcon, Layers } from "lucide-react";

function ContentEditor({ resume, setResume }) {
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [generatingAbout, setGeneratingAbout] = useState(false);
  const [aboutStyle, setAboutStyle] = useState("professional");
  const [activeSection, setActiveSection] = useState("personal");

  if (!resume) {
    return null;
  }

  // ==========================================
  // SAFE ARRAY CONVERSION
  // ==========================================

  const toArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") {
          return parsed.all || Object.values(parsed).flat().filter(Boolean);
        }
        return [];
      } catch {
        return [];
      }
    }

    if (value && typeof value === "object") {
      return value.all || Object.values(value).flat().filter(Boolean);
    }

    return [];
  };

  const skills = toArray(resume.skills);
  const experience = toArray(resume.experience);
  const education = toArray(resume.education);
  const projects = toArray(resume.projects);
  const certificates = toArray(resume.certificates);
  const achievements = toArray(resume.achievements);
  const languages = toArray(resume.languages);
  const customSections = toArray(resume.custom_sections);

  // ==========================================
  // PERSONAL DETAILS
  // ==========================================

  const updatePersonal = (field, value) => {
    setResume({
      ...resume,
      personal: {
        ...(resume.personal || {}),
        [field]: value,
      },
    });
  };

  // ==========================================
  // ABOUT & AI ABOUT GENERATION
  // ==========================================

  const updateAbout = (value) => {
    setResume({
      ...resume,
      about: value,
      summary: value,
    });
  };

  const handleGenerateAbout = async (style) => {
    const selectedStyle = style || aboutStyle;
    setAboutStyle(selectedStyle);
    try {
      setGeneratingAbout(true);
      const res = await axios.post("http://localhost:5000/api/portfolio/generate-about", {
        style: selectedStyle,
        resumeData: {
          personal: resume.personal || {},
          metadata: {
            career_target: resume.personal?.title || "Professional"
          },
          education,
          experience,
          skills,
          projects,
          certificates
        }
      });
      if (res.data?.about) {
        updateAbout(res.data.about);
      }
    } catch (err) {
      console.warn("AI About Generation error:", err.message);
    } finally {
      setGeneratingAbout(false);
    }
  };

  // ==========================================
  // EXPERIENCE & INTERNSHIPS
  // ==========================================

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...(updated[index] || {}), [field]: value };
    setResume({
      ...resume,
      experience: updated,
    });
  };

  const deleteExperience = (index) => {
    const updated = [...experience];
    updated.splice(index, 1);
    setResume({
      ...resume,
      experience: updated,
    });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...experience,
        {
          role: "",
          company: "",
          location: "",
          duration: "",
          description: "",
          is_internship: false,
        },
      ],
    });
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;

    setResume({
      ...resume,
      skills: [...skills, skill],
    });
    setNewSkill("");
  };

  const updateSkill = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setResume({
      ...resume,
      skills: updatedSkills,
    });
  };

  const deleteSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setResume({
      ...resume,
      skills: updatedSkills,
    });
  };

  // ==========================================
  // EDUCATION
  // ==========================================

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...(updated[index] || {}), [field]: value };
    setResume({
      ...resume,
      education: updated,
    });
  };

  const deleteEducation = (index) => {
    const updated = [...education];
    updated.splice(index, 1);
    setResume({
      ...resume,
      education: updated,
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...education,
        {
          degree: "",
          institution: "",
          year: "",
          score: "",
        },
      ],
    });
  };

  // ==========================================
  // PROJECTS / NOTABLE WORK
  // ==========================================

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...(updated[index] || {}), [field]: value };
    setResume({
      ...resume,
      projects: updated,
    });
  };

  const deleteProject = (index) => {
    const updated = [...projects];
    updated.splice(index, 1);
    setResume({
      ...resume,
      projects: updated,
    });
  };

  const addProject = () => {
    setResume({
      ...resume,
      projects: [
        ...projects,
        {
          title: "",
          description: "",
          technologies: "",
          link: "",
          github: "",
        },
      ],
    });
  };

  // ==========================================
  // CERTIFICATES (With Robust Aliases)
  // ==========================================

  const updateCertificate = (index, field, value) => {
    const updated = [...certificates];
    const current = updated[index] || {};
    if (field === "name") {
      updated[index] = { ...current, name: value, title: value };
    } else if (field === "issuer") {
      updated[index] = { ...current, issuer: value, organization: value };
    } else if (field === "year") {
      updated[index] = { ...current, year: value, issue_date: value, date: value };
    } else {
      updated[index] = { ...current, [field]: value };
    }

    setResume({
      ...resume,
      certificates: updated,
    });
  };

  const deleteCertificate = (index) => {
    const updated = [...certificates];
    updated.splice(index, 1);
    setResume({
      ...resume,
      certificates: updated,
    });
  };

  const addCertificate = () => {
    setResume({
      ...resume,
      certificates: [
        ...certificates,
        {
          name: "",
          issuer: "",
          year: "",
          link: "",
        },
      ],
    });
  };

  // ==========================================
  // ACHIEVEMENTS
  // ==========================================

  const updateAchievement = (index, field, value) => {
    const updated = [...achievements];
    if (typeof updated[index] === "string") {
      updated[index] = { title: value, description: "" };
    } else {
      updated[index] = { ...(updated[index] || {}), [field]: value };
    }
    setResume({
      ...resume,
      achievements: updated,
    });
  };

  const deleteAchievement = (index) => {
    const updated = [...achievements];
    updated.splice(index, 1);
    setResume({
      ...resume,
      achievements: updated,
    });
  };

  const addAchievement = () => {
    setResume({
      ...resume,
      achievements: [
        ...achievements,
        {
          title: "",
          description: "",
        },
      ],
    });
  };

  // ==========================================
  // LANGUAGES
  // ==========================================

  const addLanguage = () => {
    const language = newLanguage.trim();
    if (!language) return;

    setResume({
      ...resume,
      languages: [...languages, { language, proficiency: "Fluent" }],
    });
    setNewLanguage("");
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...languages];
    if (typeof updated[index] === "string") {
      updated[index] = { language: value, proficiency: "Fluent" };
    } else {
      updated[index] = { ...(updated[index] || {}), [field]: value };
    }
    setResume({
      ...resume,
      languages: updated,
    });
  };

  const deleteLanguage = (index) => {
    const updated = [...languages];
    updated.splice(index, 1);
    setResume({
      ...resume,
      languages: updated,
    });
  };

  // ==========================================
  // CUSTOM SECTIONS
  // ==========================================

  const updateCustomSection = (index, field, value) => {
    const updated = [...customSections];
    updated[index] = { ...(updated[index] || {}), [field]: value };
    setResume({
      ...resume,
      custom_sections: updated,
    });
  };

  const deleteCustomSection = (index) => {
    const updated = [...customSections];
    updated.splice(index, 1);
    setResume({
      ...resume,
      custom_sections: updated,
    });
  };

  const addCustomSection = () => {
    setResume({
      ...resume,
      custom_sections: [
        ...customSections,
        {
          heading: "New Custom Section",
          items: "",
        },
      ],
    });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500 text-sm text-white placeholder-slate-500 transition";

  const navItems = [
    { id: "personal", label: "Personal", icon: User },
    { id: "about", label: "About", icon: FileText },
    { id: "experience", label: `Experience (${experience.length})`, icon: Briefcase },
    { id: "education", label: `Education (${education.length})`, icon: GraduationCap },
    { id: "skills", label: `Skills (${skills.length})`, icon: Wrench },
    { id: "projects", label: `Work & Projects (${projects.length})`, icon: FolderGit2 },
    { id: "certificates", label: `Certificates (${certificates.length})`, icon: Award },
    { id: "achievements", label: `Achievements (${achievements.length})`, icon: Trophy },
    { id: "languages", label: `Languages (${languages.length})`, icon: LanguagesIcon },
    { id: "custom", label: `Custom (${customSections.length})`, icon: Layers },
  ];

  return (
    <div className="space-y-4">
      {/* Section Quick Pills */}
      <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={13} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================
          1. PERSONAL DETAILS
      ===================================== */}
      {activeSection === "personal" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Content</p>
            <h2 className="text-base font-bold text-white mt-0.5">Personal Details</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                value={resume.personal?.name || ""}
                onChange={(e) => updatePersonal("name", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Professional Title / Headline</label>
              <input
                type="text"
                value={resume.personal?.title || ""}
                placeholder="e.g. Science Teacher, Nurse Specialist, Senior Accountant"
                onChange={(e) => updatePersonal("title", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={resume.personal?.email || ""}
                onChange={(e) => updatePersonal("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <input
                type="text"
                value={resume.personal?.phone || ""}
                onChange={(e) => updatePersonal("phone", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Location</label>
              <input
                type="text"
                value={resume.personal?.location || ""}
                onChange={(e) => updatePersonal("location", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Website / Portfolio Link</label>
              <input
                type="text"
                value={resume.personal?.portfolio_url || ""}
                onChange={(e) => updatePersonal("portfolio_url", e.target.value)}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={resume.personal?.linkedin || ""}
                onChange={(e) => updatePersonal("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">GitHub (Optional)</label>
              <input
                type="text"
                value={resume.personal?.github || ""}
                onChange={(e) => updatePersonal("github", e.target.value)}
                placeholder="https://github.com/username"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          2. ABOUT / SUMMARY
      ===================================== */}
      {activeSection === "about" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Introduction</p>
            <h2 className="text-base font-bold text-white mt-0.5">About Me</h2>
          </div>

          {/* AI Generator Pills */}
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <Sparkles size={13} className="text-purple-400" />
              <span>AI Writing Styles</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "simple", label: "Simple" },
                { id: "professional", label: "Professional" },
                { id: "short", label: "Short" },
                { id: "technical", label: "Technical" },
                { id: "career-focused", label: "Career-Focused" },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  disabled={generatingAbout}
                  onClick={() => handleGenerateAbout(style.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                    aboutStyle === style.id
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {generatingAbout && aboutStyle === style.id ? (
                    <Loader2 size={11} className="animate-spin inline mr-1" />
                  ) : null}
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={resume.about || resume.summary || ""}
              onChange={(e) => updateAbout(e.target.value)}
              rows={6}
              placeholder="Write a short summary about your background and core strengths..."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>
        </div>
      )}

      {/* =====================================
          3. EXPERIENCE & INTERNSHIPS
      ===================================== */}
      {activeSection === "experience" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Career</p>
              <h2 className="text-base font-bold text-white mt-0.5">Experience & Internships</h2>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Position #{index + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.is_internship)}
                        onChange={(e) => updateExperience(index, "is_internship", e.target.checked)}
                        className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-500/40"
                      />
                      <span>Internship</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteExperience(index)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Delete experience"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <input
                  value={exp.role || ""}
                  onChange={(e) => updateExperience(index, "role", e.target.value)}
                  placeholder="Role / Title"
                  className={inputClass}
                />

                <input
                  value={exp.company || ""}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  placeholder="Organization / Employer"
                  className={inputClass}
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={exp.duration || ""}
                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                    placeholder="Dates / Duration"
                    className={inputClass}
                  />
                  <input
                    value={exp.location || ""}
                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                    placeholder="Location"
                    className={inputClass}
                  />
                </div>

                <textarea
                  value={exp.description || ""}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  rows={3}
                  placeholder="Responsibilities & outcomes..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            ))}

            {experience.length === 0 && (
              <p className="text-xs text-gray-500 italic text-center py-4">No experience entries.</p>
            )}
          </div>
        </div>
      )}

      {/* =====================================
          4. EDUCATION
      ===================================== */}
      {activeSection === "education" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Academic</p>
              <h2 className="text-base font-bold text-white mt-0.5">Education</h2>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {education.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Degree #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteEducation(index)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  value={item.degree || ""}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  placeholder="Degree / Qualification"
                  className={inputClass}
                />
                <input
                  value={item.institution || ""}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  placeholder="Institution"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={item.year || ""}
                    onChange={(e) => updateEducation(index, "year", e.target.value)}
                    placeholder="Year"
                    className={inputClass}
                  />
                  <input
                    value={item.score || ""}
                    onChange={(e) => updateEducation(index, "score", e.target.value)}
                    placeholder="GPA / Score"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================
          5. SKILLS
      ===================================== */}
      {activeSection === "skills" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Competencies</p>
            <h2 className="text-base font-bold text-white mt-0.5">Skills</h2>
          </div>

          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition shrink-0"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs text-slate-200"
              >
                <span>{typeof skill === "string" ? skill : skill.name || String(skill)}</span>
                <button
                  type="button"
                  onClick={() => deleteSkill(index)}
                  className="text-slate-500 hover:text-red-400 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================
          6. PROJECTS / WORK SAMPLES
      ===================================== */}
      {activeSection === "projects" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Deliverables</p>
              <h2 className="text-base font-bold text-white mt-0.5">Projects & Notable Work</h2>
            </div>
            <button
              type="button"
              onClick={addProject}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={index} className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Project #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteProject(index)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  value={project?.title || ""}
                  onChange={(e) => updateProject(index, "title", e.target.value)}
                  placeholder="Project / Work Title"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={project?.technologies || ""}
                    onChange={(e) => updateProject(index, "technologies", e.target.value)}
                    placeholder="Technologies / Tools"
                    className={inputClass}
                  />
                  <input
                    value={project?.link || ""}
                    onChange={(e) => updateProject(index, "link", e.target.value)}
                    placeholder="Live Link / URL"
                    className={inputClass}
                  />
                </div>
                <textarea
                  value={project?.description || ""}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  rows={3}
                  placeholder="Description & outcomes..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================
          7. CERTIFICATES (ROBUST ALIASES)
      ===================================== */}
      {activeSection === "certificates" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Credentials</p>
              <h2 className="text-base font-bold text-white mt-0.5">Certificates & Licenses</h2>
            </div>
            <button
              type="button"
              onClick={addCertificate}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {certificates.map((cert, index) => {
              const nameVal = cert?.name || cert?.title || "";
              const issuerVal = cert?.issuer || cert?.organization || "";
              const yearVal = cert?.year || cert?.issue_date || cert?.date || "";
              return (
                <div key={index} className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Certificate #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteCertificate(index)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    value={nameVal}
                    onChange={(e) => updateCertificate(index, "name", e.target.value)}
                    placeholder="Certificate / License Name"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={issuerVal}
                      onChange={(e) => updateCertificate(index, "issuer", e.target.value)}
                      placeholder="Issuer / Board"
                      className={inputClass}
                    />
                    <input
                      value={yearVal}
                      onChange={(e) => updateCertificate(index, "year", e.target.value)}
                      placeholder="Year / Expiry"
                      className={inputClass}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================
          8. ACHIEVEMENTS
      ===================================== */}
      {activeSection === "achievements" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Honors</p>
              <h2 className="text-base font-bold text-white mt-0.5">Achievements & Honors</h2>
            </div>
            <button
              type="button"
              onClick={addAchievement}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {achievements.map((item, index) => {
              const titleVal = typeof item === "string" ? item : (item?.title || "");
              const descVal = typeof item === "object" ? (item?.description || "") : "";
              return (
                <div key={index} className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Achievement #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteAchievement(index)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    value={titleVal}
                    onChange={(e) => updateAchievement(index, "title", e.target.value)}
                    placeholder="Title / Award"
                    className={inputClass}
                  />
                  <textarea
                    value={descVal}
                    onChange={(e) => updateAchievement(index, "description", e.target.value)}
                    rows={2}
                    placeholder="Description / Context..."
                    className={`${inputClass} resize-y`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================
          9. LANGUAGES
      ===================================== */}
      {activeSection === "languages" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Multilingual</p>
              <h2 className="text-base font-bold text-white mt-0.5">Languages</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add language (e.g. Spanish, French)..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition shrink-0"
            >
              Add
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {languages.map((item, index) => {
              const langName = typeof item === "string" ? item : (item?.language || "");
              const prof = typeof item === "object" ? (item?.proficiency || "Fluent") : "Fluent";
              return (
                <div key={index} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/20 border border-white/10">
                  <input
                    value={langName}
                    onChange={(e) => updateLanguage(index, "language", e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs text-white outline-none"
                    placeholder="Language"
                  />
                  <select
                    value={prof}
                    onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Professional">Professional</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteLanguage(index)}
                    className="text-slate-500 hover:text-red-400 transition px-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================
          10. CUSTOM SECTIONS
      ===================================== */}
      {activeSection === "custom" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Specialized</p>
              <h2 className="text-base font-bold text-white mt-0.5">Custom Sections</h2>
            </div>
            <button
              type="button"
              onClick={addCustomSection}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {customSections.map((item, index) => {
              const content = Array.isArray(item.items) ? item.items.join("\n") : (item.items || item.content || "");
              return (
                <div key={index} className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Section #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteCustomSection(index)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    value={item.heading || ""}
                    onChange={(e) => updateCustomSection(index, "heading", e.target.value)}
                    placeholder="Section Heading"
                    className={inputClass}
                  />
                  <textarea
                    value={content}
                    onChange={(e) => updateCustomSection(index, "items", e.target.value)}
                    rows={3}
                    placeholder="Content items, one per line..."
                    className={`${inputClass} resize-y`}
                  />
                </div>
              );
            })}
            {customSections.length === 0 && (
              <p className="text-xs text-gray-500 italic text-center py-4">No custom sections. Click Add to create one.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentEditor;
