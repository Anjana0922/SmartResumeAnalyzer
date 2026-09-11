import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Globe,
  Languages,
  Layers,
  Save,
  Info
} from "lucide-react";

function CreateResume() {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // Read Logged-In User
  // -------------------------------------------------------------
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const userCategory = storedUser?.user_category || "Student";

  // -------------------------------------------------------------
  // Form State
  // -------------------------------------------------------------
  const [personal, setPersonal] = useState({
    name: storedUser?.full_name || "",
    title: "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    location: "",
    github: "",
    linkedin: "",
    portfolio_url: "",
  });

  const [summary, setSummary] = useState("");

  const [education, setEducation] = useState([
    {
      degree: "",
      institution: "",
      location: "",
      year: "",
      score: "",
      coursework: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      role: "",
      company: "",
      location: "",
      duration: "",
      is_current: false,
      is_internship: false,
      description: "",
      highlights: [""],
      technologies: "",
    },
  ]);

  const [skills, setSkills] = useState({
    technical: [],
    frameworks: [],
    tools: [],
    soft: [],
  });

  // Inputs for skill tags
  const [skillInputs, setSkillInputs] = useState({
    technical: "",
    frameworks: "",
    tools: "",
    soft: "",
  });

  const [projects, setProjects] = useState([
    {
      title: "",
      subtitle: "",
      description: "",
      technologies: "",
      link: "",
      github: "",
      duration: "",
    },
  ]);

  const [certificates, setCertificates] = useState([
    {
      name: "",
      issuer: "",
      year: "",
      link: "",
    },
  ]);

  const [achievements, setAchievements] = useState([""]);

  const [languagesList, setLanguagesList] = useState([
    {
      name: "",
      level: "Professional Working",
    },
  ]);

  const [customSections, setCustomSections] = useState([]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  // -------------------------------------------------------------
  // Education Handlers
  // -------------------------------------------------------------
  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        degree: "",
        institution: "",
        location: "",
        year: "",
        score: "",
        coursework: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Experience Handlers
  // -------------------------------------------------------------
  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        role: "",
        company: "",
        location: "",
        duration: "",
        is_current: false,
        is_internship: false,
        description: "",
        highlights: [""],
        technologies: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    setExperience((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addExperienceHighlight = (expIndex) => {
    setExperience((prev) =>
      prev.map((item, i) =>
        i === expIndex
          ? { ...item, highlights: [...item.highlights, ""] }
          : item
      )
    );
  };

  const updateExperienceHighlight = (expIndex, hIndex, value) => {
    setExperience((prev) =>
      prev.map((item, i) => {
        if (i !== expIndex) return item;
        const newHighlights = [...item.highlights];
        newHighlights[hIndex] = value;
        return { ...item, highlights: newHighlights };
      })
    );
  };

  const removeExperienceHighlight = (expIndex, hIndex) => {
    setExperience((prev) =>
      prev.map((item, i) => {
        if (i !== expIndex) return item;
        return {
          ...item,
          highlights: item.highlights.filter((_, idx) => idx !== hIndex),
        };
      })
    );
  };

  // -------------------------------------------------------------
  // Skills Handlers (Tag/Chip input)
  // -------------------------------------------------------------
  const handleAddSkill = (category) => {
    const value = skillInputs[category].trim();
    if (!value) return;

    if (skills[category].includes(value)) {
      setSkillInputs((prev) => ({ ...prev, [category]: "" }));
      return;
    }

    setSkills((prev) => ({
      ...prev,
      [category]: [...prev[category], value],
    }));

    setSkillInputs((prev) => ({ ...prev, [category]: "" }));
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((s) => s !== skillToRemove),
    }));
  };

  // -------------------------------------------------------------
  // Projects Handlers
  // -------------------------------------------------------------
  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        subtitle: "",
        description: "",
        technologies: "",
        link: "",
        github: "",
        duration: "",
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    setProjects((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Certifications Handlers
  // -------------------------------------------------------------
  const addCertificate = () => {
    setCertificates((prev) => [
      ...prev,
      { name: "", issuer: "", year: "", link: "" },
    ]);
  };

  const removeCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCertificate = (index, field, value) => {
    setCertificates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Achievements Handlers
  // -------------------------------------------------------------
  const addAchievement = () => {
    setAchievements((prev) => [...prev, ""]);
  };

  const removeAchievement = (index) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAchievement = (index, value) => {
    setAchievements((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  // -------------------------------------------------------------
  // Languages Handlers
  // -------------------------------------------------------------
  const addLanguage = () => {
    setLanguagesList((prev) => [
      ...prev,
      { name: "", level: "Professional Working" },
    ]);
  };

  const removeLanguage = (index) => {
    setLanguagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLanguage = (index, field, value) => {
    setLanguagesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Custom Sections Handlers
  // -------------------------------------------------------------
  const addCustomSection = () => {
    setCustomSections((prev) => [
      ...prev,
      {
        heading: "",
        items: [{ title: "", subtitle: "", date: "", description: "" }],
      },
    ]);
  };

  const removeCustomSection = (index) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomSectionHeading = (index, value) => {
    setCustomSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, heading: value } : sec))
    );
  };

  const addCustomSectionItem = (secIndex) => {
    setCustomSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              items: [
                ...sec.items,
                { title: "", subtitle: "", date: "", description: "" },
              ],
            }
          : sec
      )
    );
  };

  const updateCustomSectionItem = (secIndex, itemIndex, field, value) => {
    setCustomSections((prev) =>
      prev.map((sec, i) => {
        if (i !== secIndex) return sec;
        const newItems = sec.items.map((it, idx) =>
          idx === itemIndex ? { ...it, [field]: value } : it
        );
        return { ...sec, items: newItems };
      })
    );
  };

  const removeCustomSectionItem = (secIndex, itemIndex) => {
    setCustomSections((prev) =>
      prev.map((sec, i) => {
        if (i !== secIndex) return sec;
        return {
          ...sec,
          items: sec.items.filter((_, idx) => idx !== itemIndex),
        };
      })
    );
  };

  // -------------------------------------------------------------
  // Form Submission
  // -------------------------------------------------------------
  const handleSaveResume = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!storedUser?.user_id) {
      setError("You must be logged in to save your resume.");
      return;
    }

    if (!personal.name.trim()) {
      setError("Full Name is required in Personal Details.");
      setActiveTab("personal");
      return;
    }

    if (!personal.email.trim()) {
      setError("Email is required in Personal Details.");
      setActiveTab("personal");
      return;
    }

    setSubmitting(true);

    try {
      // Normalize skills
      const allSkills = Array.from(
        new Set([
          ...skills.technical,
          ...skills.frameworks,
          ...skills.tools,
          ...skills.soft,
        ])
      );

      const payload = {
        user_id: storedUser.user_id,
        user_category: userCategory,
        resumeData: {
          metadata: {
            source: "scratch",
            user_category: userCategory,
          },
          personal: {
            name: personal.name.trim(),
            title: personal.title.trim(),
            email: personal.email.trim(),
            phone: personal.phone.trim(),
            location: personal.location.trim(),
            github: personal.github.trim(),
            linkedin: personal.linkedin.trim(),
            portfolio_url: personal.portfolio_url.trim(),
          },
          summary: summary.trim(),
          about: summary.trim(),
          education: education
            .filter((item) => item.degree.trim() || item.institution.trim())
            .map((item) => ({
              degree: item.degree.trim(),
              institution: item.institution.trim(),
              location: item.location.trim(),
              year: item.year.trim(),
              score: item.score.trim(),
              coursework: item.coursework
                ? item.coursework
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
            })),
          experience: experience
            .filter((item) => item.role.trim() || item.company.trim())
            .map((item) => ({
              role: item.role.trim(),
              company: item.company.trim(),
              location: item.location.trim(),
              duration: item.duration.trim(),
              is_current: Boolean(item.is_current),
              is_internship: Boolean(item.is_internship),
              description: item.description.trim(),
              highlights: item.highlights.filter((h) => h && h.trim()),
              technologies: item.technologies
                ? item.technologies
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
            })),
          skills: {
            technical: skills.technical,
            frameworks: skills.frameworks,
            tools: skills.tools,
            soft: skills.soft,
            all: allSkills,
          },
          projects: projects
            .filter((item) => item.title.trim() || item.description.trim())
            .map((item) => ({
              title: item.title.trim(),
              subtitle: item.subtitle.trim(),
              description: item.description.trim(),
              technologies: item.technologies
                ? item.technologies
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
              link: item.link.trim(),
              github: item.github.trim(),
              duration: item.duration.trim(),
            })),
          certificates: certificates
            .filter((item) => item.name.trim())
            .map((item) => ({
              name: item.name.trim(),
              issuer: item.issuer.trim(),
              year: item.year.trim(),
              link: item.link.trim(),
            })),
          achievements: achievements
            .map((a) => (typeof a === "string" ? a.trim() : ""))
            .filter(Boolean),
          languages: languagesList
            .filter((item) => item.name.trim())
            .map((item) => ({
              name: item.name.trim(),
              level: item.level.trim(),
            })),
          custom_sections: customSections
            .filter((sec) => sec.heading.trim() && sec.items.length > 0)
            .map((sec) => ({
              heading: sec.heading.trim(),
              items: sec.items
                .filter((it) => it.title.trim() || it.description.trim())
                .map((it) => ({
                  title: it.title.trim(),
                  subtitle: it.subtitle.trim(),
                  date: it.date.trim(),
                  description: it.description.trim(),
                })),
            }))
            .filter((sec) => sec.items.length > 0),
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/resume/create",
        payload
      );

      console.log("Resume create response:", response.data);

      const resumeId = response.data.resume_id;
      if (resumeId) {
        localStorage.setItem("resume_id", String(resumeId));
        setSavedResumeId(resumeId);
      } else {
        throw new Error("Resume was created, but no resume ID was returned.");
      }
    } catch (err) {
      console.error("Error saving resume:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save resume. Please check your network and inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sectionsNav = [
    { id: "personal", label: "Personal Details", icon: Globe },
    { id: "summary", label: "Summary / About", icon: Sparkles },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience & Internships", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "custom", label: "Additional Sections", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-3 group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create Resume from Scratch
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {userCategory} Mode
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Build your structured resume. This data will power your resume and portfolio generator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveResume}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              {submitting ? "Saving..." : "Save Resume"}
            </button>
          </div>
        </div>

        {/* Auth Warning if not logged in */}
        {!storedUser && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">User Session Not Detected</p>
              <p className="text-amber-300/80 mt-1">
                You are not logged in. Your resume cannot be saved without an active account.{" "}
                <button
                  onClick={() => navigate("/auth")}
                  className="underline hover:text-amber-200 font-medium cursor-pointer"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Success Modal / Banner */}
        {savedResumeId && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  Resume Structured Data Saved Successfully!
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  Your resume has been saved to your account in canonical schema format (Resume ID:{" "}
                  <span className="font-mono text-purple-300 font-semibold">
                    #{savedResumeId}
                  </span>
                  ). It is now ready for future stages including Resume Templates and Portfolio generation.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => setSavedResumeId(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm transition cursor-pointer"
                  >
                    Keep Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Section Navigation Tabs + Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sticky Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/[0.03] border border-white/10 rounded-2xl p-3 space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-3 py-2">
                Resume Sections
              </p>
              {sectionsNav.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveTab(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left cursor-pointer ${
                      isActive
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-purple-400" : "text-slate-500"} />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Form Fields */}
          <div className="lg:col-span-3 space-y-8">
            {/* ========================================================
                1. PERSONAL DETAILS
            ======================================================== */}
            <section
              id="personal"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      1. Personal Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Primary contact details and online presence
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.name}
                    onChange={(e) =>
                      setPersonal({ ...personal, name: e.target.value })
                    }
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professional Title / Headline
                  </label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) =>
                      setPersonal({ ...personal, title: e.target.value })
                    }
                    placeholder={
                      userCategory === "Student"
                        ? "e.g. Computer Science Student / Aspiring SWE"
                        : "e.g. Senior Full Stack Engineer"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={personal.email}
                    onChange={(e) =>
                      setPersonal({ ...personal, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={personal.phone}
                    onChange={(e) =>
                      setPersonal({ ...personal, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personal.location}
                    onChange={(e) =>
                      setPersonal({ ...personal, location: e.target.value })
                    }
                    placeholder="City, State / Country"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={personal.github}
                    onChange={(e) =>
                      setPersonal({ ...personal, github: e.target.value })
                    }
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={personal.linkedin}
                    onChange={(e) =>
                      setPersonal({ ...personal, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    value={personal.portfolio_url}
                    onChange={(e) =>
                      setPersonal({ ...personal, portfolio_url: e.target.value })
                    }
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* ========================================================
                2. SUMMARY / ABOUT
            ======================================================== */}
            <section
              id="summary"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      2. Professional Summary / About
                    </h2>
                    <p className="text-xs text-slate-400">
                      A concise overview of your background, strengths, and goals
                    </p>
                  </div>
                </div>
              </div>

              {/* Contextual Guidance */}
              <div className="mb-4 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200 leading-relaxed">
                <Info size={16} className="shrink-0 mt-0.5 text-purple-300" />
                <div>
                  {userCategory === "Student" ? (
                    <span>
                      <strong>Student Focus:</strong> Highlight your current degree, academic achievements, key coursework, technical projects, and career aspirations.
                    </span>
                  ) : (
                    <span>
                      <strong>Job Seeker Focus:</strong> Highlight your professional track record, industry accomplishments, technical depth, and value proposition.
                    </span>
                  )}
                </div>
              </div>

              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={
                  userCategory === "Student"
                    ? "Passionate Computer Science student with hands-on experience in full-stack web development and machine learning. Seeking software engineering internship opportunities..."
                    : "Results-driven Software Engineer with 4+ years of experience designing and deploying scalable web applications, microservices, and distributed cloud systems..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none leading-relaxed"
              />
            </section>

            {/* ========================================================
                3. EDUCATION
            ======================================================== */}
            <section
              id="education"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      3. Education
                    </h2>
                    <p className="text-xs text-slate-400">
                      Degrees, academic institutions, grades, and coursework
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>

              <div className="space-y-5">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                        Education #{idx + 1}
                      </span>
                      {education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove education"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Degree / Program
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(idx, "degree", e.target.value)
                          }
                          placeholder="e.g. B.S. in Computer Science"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Institution / University
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(idx, "institution", e.target.value)
                          }
                          placeholder="e.g. Stanford University"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Duration / Year
                        </label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) =>
                            updateEducation(idx, "year", e.target.value)
                          }
                          placeholder="e.g. 2020 - 2024"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          GPA / Score
                        </label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) =>
                            updateEducation(idx, "score", e.target.value)
                          }
                          placeholder="e.g. 3.85 / 4.0 or 88%"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) =>
                            updateEducation(idx, "location", e.target.value)
                          }
                          placeholder="e.g. Stanford, CA"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Coursework / Key Subjects (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={edu.coursework}
                          onChange={(e) =>
                            updateEducation(idx, "coursework", e.target.value)
                          }
                          placeholder="e.g. Data Structures, Operating Systems, Cloud Computing"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                4. EXPERIENCE & INTERNSHIPS
            ======================================================== */}
            <section
              id="experience"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      4. Experience & Internships
                    </h2>
                    <p className="text-xs text-slate-400">
                      Full-time, part-time jobs, and internships (unified schema with internship flag)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                          Experience #{idx + 1}
                        </span>
                        {exp.is_internship && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Internship
                          </span>
                        )}
                        {exp.is_current && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Current
                          </span>
                        )}
                      </div>
                      {experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove experience"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            updateExperience(idx, "role", e.target.value)
                          }
                          placeholder="e.g. Software Engineer or Frontend Intern"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(idx, "company", e.target.value)
                          }
                          placeholder="e.g. Google or Tech Startup"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Duration / Period
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) =>
                            updateExperience(idx, "duration", e.target.value)
                          }
                          placeholder="e.g. May 2023 - Aug 2023"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) =>
                            updateExperience(idx, "location", e.target.value)
                          }
                          placeholder="e.g. New York, NY (or Remote)"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Flags: Current & Internship */}
                    <div className="flex flex-wrap items-center gap-6 mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={exp.is_internship}
                          onChange={(e) =>
                            updateExperience(idx, "is_internship", e.target.checked)
                          }
                          className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span>This is an Internship</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={exp.is_current}
                          onChange={(e) =>
                            updateExperience(idx, "is_current", e.target.checked)
                          }
                          className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span>Currently Working Here</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Overview / Description
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(idx, "description", e.target.value)
                        }
                        placeholder="Brief summary of your responsibilities..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    {/* Bullet Highlights */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-slate-400">
                          Key Achievements / Bullet Points
                        </label>
                        <button
                          type="button"
                          onClick={() => addExperienceHighlight(idx)}
                          className="text-purple-300 hover:text-purple-200 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.highlights.map((bullet, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2">
                            <span className="text-purple-400 text-xs">•</span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) =>
                                updateExperienceHighlight(
                                  idx,
                                  hIdx,
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Reduced API response latency by 35% through Redis caching..."
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                            />
                            {exp.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeExperienceHighlight(idx, hIdx)
                                }
                                className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Technologies Used (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={exp.technologies}
                        onChange={(e) =>
                          updateExperience(idx, "technologies", e.target.value)
                        }
                        placeholder="e.g. React, Node.js, PostgreSQL, Docker, AWS"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                5. SKILLS (Categorized & Unified)
            ======================================================== */}
            <section
              id="skills"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      5. Categorized Skills
                    </h2>
                    <p className="text-xs text-slate-400">
                      Add skills by category with interactive tags (press Enter or click Add)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    key: "technical",
                    label: "Technical & Programming Languages",
                    placeholder: "e.g. Python, Java, JavaScript, C++, SQL",
                    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                  },
                  {
                    key: "frameworks",
                    label: "Frameworks & Libraries",
                    placeholder: "e.g. React, Node.js, Express, Tailwind CSS, Django",
                    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                  },
                  {
                    key: "tools",
                    label: "Tools, Platforms & Databases",
                    placeholder: "e.g. Git, Docker, MongoDB, AWS, Figma, Linux",
                    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  },
                  {
                    key: "soft",
                    label: "Soft Skills & Methodologies",
                    placeholder: "e.g. Agile/Scrum, Problem Solving, Leadership, Teamwork",
                    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  },
                ].map((cat) => (
                  <div
                    key={cat.key}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-300">
                          {cat.label}
                        </label>
                        <span className="text-[11px] font-mono text-slate-400">
                          {skills[cat.key].length} added
                        </span>
                      </div>

                      {/* Tag Input */}
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={skillInputs[cat.key]}
                          onChange={(e) =>
                            setSkillInputs({
                              ...skillInputs,
                              [cat.key]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill(cat.key);
                            }
                          }}
                          placeholder={cat.placeholder}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSkill(cat.key)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      {/* Chips Container */}
                      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-black/20 border border-white/5">
                        {skills[cat.key].length === 0 ? (
                          <span className="text-xs text-slate-500 italic">
                            No skills added yet
                          </span>
                        ) : (
                          skills[cat.key].map((sk, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${cat.badgeColor}`}
                            >
                              <span>{sk}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(cat.key, sk)}
                                className="hover:text-red-400 transition cursor-pointer font-bold leading-none"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                6. PROJECTS
            ======================================================== */}
            <section
              id="projects"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <FolderGit2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      6. Projects
                    </h2>
                    <p className="text-xs text-slate-400">
                      Technical projects, open source contributions, or portfolio builds
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div className="space-y-6">
                {projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                        Project #{idx + 1}
                      </span>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) =>
                            updateProject(idx, "title", e.target.value)
                          }
                          placeholder="e.g. Smart Resume Analyzer"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          value={proj.subtitle}
                          onChange={(e) =>
                            updateProject(idx, "subtitle", e.target.value)
                          }
                          placeholder="e.g. AI-Powered Portfolio & Resume Generator"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Live Demo Link
                        </label>
                        <input
                          type="url"
                          value={proj.link}
                          onChange={(e) =>
                            updateProject(idx, "link", e.target.value)
                          }
                          placeholder="https://myproject.com"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={proj.github}
                          onChange={(e) =>
                            updateProject(idx, "github", e.target.value)
                          }
                          placeholder="https://github.com/user/project"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Description & Impact
                      </label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(idx, "description", e.target.value)
                        }
                        placeholder="Describe features, problem solved, architecture, and metrics..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Technologies Used (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) =>
                            updateProject(idx, "technologies", e.target.value)
                          }
                          placeholder="e.g. React, Node.js, Tailwind, SQLite, Gemini AI"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Duration / Date
                        </label>
                        <input
                          type="text"
                          value={proj.duration}
                          onChange={(e) =>
                            updateProject(idx, "duration", e.target.value)
                          }
                          placeholder="e.g. Jan 2024 - Mar 2024"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                7. CERTIFICATIONS
            ======================================================== */}
            <section
              id="certificates"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Award size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      7. Certifications
                    </h2>
                    <p className="text-xs text-slate-400">
                      Professional credentials and course certifications
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addCertificate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              <div className="space-y-4">
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                        Certification #{idx + 1}
                      </span>
                      {certificates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertificate(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Certificate Name
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                            updateCertificate(idx, "name", e.target.value)
                          }
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Issuing Organization
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertificate(idx, "issuer", e.target.value)
                          }
                          placeholder="e.g. Amazon Web Services"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Year / Issue Date
                        </label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) =>
                            updateCertificate(idx, "year", e.target.value)
                          }
                          placeholder="e.g. 2023"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Credential Link / URL
                        </label>
                        <input
                          type="url"
                          value={cert.link}
                          onChange={(e) =>
                            updateCertificate(idx, "link", e.target.value)
                          }
                          placeholder="https://credly.com/your-badge"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                8. ACHIEVEMENTS & AWARDS
            ======================================================== */}
            <section
              id="achievements"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Award size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      8. Achievements & Honors
                    </h2>
                    <p className="text-xs text-slate-400">
                      Hackathon victories, academic honors, scholarships, and rankings
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addAchievement}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Achievement
                </button>
              </div>

              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-purple-400 text-sm font-bold">#{idx + 1}</span>
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => updateAchievement(idx, e.target.value)}
                      placeholder="e.g. 1st Place Winner out of 150+ teams at National College Hackathon 2023"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                    {achievements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAchievement(idx)}
                        className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                9. LANGUAGES
            ======================================================== */}
            <section
              id="languages"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Languages size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      9. Languages
                    </h2>
                    <p className="text-xs text-slate-400">
                      Spoken and written language proficiency
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addLanguage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Language
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languagesList.map((lang, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(idx, "name", e.target.value)
                        }
                        placeholder="e.g. English, Spanish, Hindi"
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                      <select
                        value={lang.level}
                        onChange={(e) =>
                          updateLanguage(idx, "level", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#14121f] border border-white/10 text-slate-300 text-xs focus:border-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Native / Bilingual">Native / Bilingual</option>
                        <option value="Full Professional / Fluent">Full Professional / Fluent</option>
                        <option value="Professional Working">Professional Working</option>
                        <option value="Limited Working / Intermediate">Limited Working / Intermediate</option>
                        <option value="Elementary / Basic">Elementary / Basic</option>
                      </select>
                    </div>

                    {languagesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(idx)}
                        className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                10. ADDITIONAL / CUSTOM SECTIONS
            ======================================================== */}
            <section
              id="custom"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      10. Additional / Custom Sections
                    </h2>
                    <p className="text-xs text-slate-400">
                      Add custom sections such as Publications, Volunteer Work, Leadership, or Extracurriculars
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addCustomSection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Custom Section
                </button>
              </div>

              {customSections.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-slate-500 text-sm">
                    No custom sections added yet. Click "+ Add Custom Section" above to add sections like Publications, Volunteer Work, or Leadership.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {customSections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-purple-500/20 relative"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 mr-4">
                          <label className="block text-xs font-medium text-purple-300 mb-1">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) =>
                              updateCustomSectionHeading(sIdx, e.target.value)
                            }
                            placeholder="e.g. Volunteer Experience or Publications"
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-semibold text-sm focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCustomSection(sIdx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove entire section"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Items in this custom section */}
                      <div className="space-y-4 pl-2 border-l-2 border-purple-500/30">
                        {sec.items.map((it, iIdx) => (
                          <div
                            key={iIdx}
                            className="p-3.5 rounded-lg bg-black/20 border border-white/5 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-medium">
                                Item #{iIdx + 1}
                              </span>
                              {sec.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeCustomSectionItem(sIdx, iIdx)
                                  }
                                  className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={it.title}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    sIdx,
                                    iIdx,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Item Title / Role"
                                className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                              />

                              <input
                                type="text"
                                value={it.subtitle}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    sIdx,
                                    iIdx,
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                                placeholder="Organization / Subtitle"
                                className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                              />

                              <input
                                type="text"
                                value={it.date}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    sIdx,
                                    iIdx,
                                    "date",
                                    e.target.value
                                  )
                                }
                                placeholder="Date / Period"
                                className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                              />
                            </div>

                            <textarea
                              rows={2}
                              value={it.description}
                              onChange={(e) =>
                                updateCustomSectionItem(
                                  sIdx,
                                  iIdx,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description or bullet notes..."
                              className="w-full px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addCustomSectionItem(sIdx)}
                          className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Plus size={12} /> Add Item to this section
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bottom Save Bar */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Ready to save your resume?
                </p>
                <p className="text-xs text-slate-400">
                  You can edit these details at any time.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveResume}
                  disabled={submitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={16} />
                  {submitting ? "Saving Structured Resume..." : "Save Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateResume;
