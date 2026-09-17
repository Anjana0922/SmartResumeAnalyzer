import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Trophy,
  Languages as LanguagesIcon,
  Layers,
  Lightbulb,
  ExternalLink,
  Upload,
  RefreshCw,
  Loader2,
  HelpCircle,
  X
} from "lucide-react";

function PortfolioDataReview() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Main Resume Data State
  const [personal, setPersonal] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    portfolio_url: "",
    linkedin: "",
    github: "",
    photo: ""
  });
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [customSections, setCustomSections] = useState([]);

  // AI About Generator State
  const [generatingAbout, setGeneratingAbout] = useState(false);
  const [aboutStyle, setAboutStyle] = useState("professional");
  const [aboutSource, setAboutSource] = useState("");

  // AI Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);

  // Active review section tab
  const [activeTab, setActiveTab] = useState("personal");

  const inputClass =
    "w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/60 transition";

  // ==================================================
  // 1. FETCH RESUME DETAILS
  // ==================================================
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`http://localhost:5000/api/resume/${resumeId}`);
        const data = response.data.resume;

        if (!data) {
          setError("Resume data not found.");
          return;
        }

        // Populate personal details
        const meta = data.metadata || {};
        const p = data.personal || {};
        setPersonal({
          name: p.name || data.name || "",
          title: p.title || meta.title || "",
          email: p.email || data.email || "",
          phone: p.phone || data.phone || "",
          location: p.location || meta.location || "",
          portfolio_url: p.portfolio_url || meta.portfolio_url || "",
          linkedin: p.linkedin || data.linkedin || "",
          github: p.github || data.github || "",
          photo: p.photo || meta.photo_path || data.photo_path || ""
        });

        // About / Summary
        setAbout(data.about || data.summary || "");

        // Education
        const edu = Array.isArray(data.education) ? data.education : [];
        setEducation(
          edu.map((e) => ({
            degree: e.degree || e.course || "",
            institution: e.institution || e.university || e.college || "",
            location: e.location || "",
            year: e.year || e.duration || "",
            score: e.score?.value || e.score || e.gpa || "",
            coursework: Array.isArray(e.coursework) ? e.coursework.join(", ") : (e.coursework || "")
          }))
        );

        // Experience & Internships
        const exp = Array.isArray(data.experience) ? data.experience : [];
        setExperience(
          exp.map((item) => ({
            role: item.role || item.title || "",
            company: item.company || item.organization || "",
            location: item.location || "",
            duration: item.duration || item.dates || "",
            description: item.description || "",
            is_internship: Boolean(
              item.is_internship ||
              /intern(ship)?/i.test(item.role || "") ||
              /intern(ship)?/i.test(item.description || "")
            )
          }))
        );

        // Skills (normalize to clean string array)
        let sk = [];
        if (Array.isArray(data.skills)) {
          sk = data.skills;
        } else if (data.flat_skills && Array.isArray(data.flat_skills)) {
          sk = data.flat_skills;
        } else if (data.skills && typeof data.skills === "object") {
          sk = data.skills.all || Object.values(data.skills).flat().filter(Boolean);
        }
        setSkills(sk.map((s) => (typeof s === "string" ? s.trim() : (s?.name || String(s)))).filter(Boolean));

        // Projects / Work Samples
        const prj = Array.isArray(data.projects) ? data.projects : [];
        setProjects(
          prj.map((p) => ({
            title: p.title || p.name || "",
            subtitle: p.subtitle || p.role || "",
            description: p.description || "",
            technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : (p.technologies || ""),
            link: p.link || p.url || "",
            github: p.github || ""
          }))
        );

        // Certificates
        const cert = Array.isArray(data.certificates || data.certifications) ? (data.certificates || data.certifications) : [];
        setCertificates(
          cert.map((c) => ({
            name: c.name || c.title || "",
            issuer: c.issuer || c.organization || "",
            year: c.year || c.issue_date || c.date || "",
            link: c.link || c.url || ""
          }))
        );

        // Achievements
        const ach = Array.isArray(data.achievements) ? data.achievements : [];
        setAchievements(
          ach.map((a) => (typeof a === "string" ? { title: a, description: "" } : { title: a.title || "", description: a.description || "" }))
        );

        // Languages
        const lang = Array.isArray(data.languages) ? data.languages : [];
        setLanguages(
          lang.map((l) => (typeof l === "string" ? { language: l, proficiency: "Proficient" } : { language: l.language || l.name || "", proficiency: l.proficiency || "Proficient" }))
        );

        // Custom Sections
        const cust = Array.isArray(data.custom_sections) ? data.custom_sections : [];
        setCustomSections(
          cust.map((c) => ({
            heading: c.heading || c.title || "Custom Section",
            items: Array.isArray(c.items) ? c.items.join("\n") : (c.items || c.content || "")
          }))
        );

        // Fetch initial AI Suggestions
        fetchSuggestions({
          personal: p,
          about: data.about || data.summary,
          experience: exp,
          skills: sk,
          projects: prj,
          certificates: cert,
          education: edu
        });

      } catch (err) {
        console.error("Error loading resume for review:", err);
        setError("Failed to load resume details. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // ==================================================
  // 2. FETCH AI SUGGESTIONS
  // ==================================================
  const fetchSuggestions = async (resumePayload) => {
    try {
      setLoadingSuggestions(true);
      const res = await axios.post("http://localhost:5000/api/portfolio/ai-suggestions", {
        resumeData: resumePayload || {
          personal,
          about,
          experience,
          education,
          skills,
          projects,
          certificates,
          languages,
          custom_sections: customSections
        }
      });
      if (res.data?.suggestions) {
        setSuggestions(res.data.suggestions);
      }
    } catch (err) {
      console.warn("Suggestions fetch notice:", err.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // ==================================================
  // 3. AI ABOUT GENERATOR (5 STYLES)
  // ==================================================
  const handleGenerateAbout = async (style) => {
    const selectedStyle = style || aboutStyle;
    setAboutStyle(selectedStyle);
    try {
      setGeneratingAbout(true);
      setError("");

      const response = await axios.post("http://localhost:5000/api/portfolio/generate-about", {
        style: selectedStyle,
        resumeData: {
          personal: {
            name: personal.name,
            title: personal.title
          },
          metadata: {
            career_target: personal.title
          },
          education,
          experience,
          skills,
          projects,
          certificates
        }
      });

      if (response.data?.about) {
        setAbout(response.data.about);
        setAboutSource(response.data.source || "ai");
        setSuccessMessage(`Generated ${selectedStyle} summary successfully!`);
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Error generating About section:", err);
      setError("Failed to generate About statement. You can type one manually.");
    } finally {
      setGeneratingAbout(false);
    }
  };

  // ==================================================
  // 4. PHOTO UPLOAD
  // ==================================================
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setSaving(true);
      const res = await axios.post("http://localhost:5000/api/resume/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setPersonal((prev) => ({ ...prev, photo: res.data.url }));
        setSuccessMessage("Photo uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Failed to upload photo.");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // 5. SAVE RESUME DATA TO BACKEND
  // ==================================================
  const handleSave = async (silent = false) => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        about: about,
        summary: about,
        personal: personal,
        metadata: {
          title: personal.title,
          location: personal.location,
          portfolio_url: personal.portfolio_url,
          photo_path: personal.photo,
          last_updated: new Date().toISOString()
        },
        education: education,
        experience: experience,
        skills: skills,
        flat_skills: skills,
        projects: projects,
        certificates: certificates,
        achievements: achievements,
        languages: languages,
        custom_sections: customSections.map((c) => ({
          heading: c.heading,
          items: typeof c.items === "string" ? c.items.split("\n").map((s) => s.trim()).filter(Boolean) : c.items
        }))
      };

      await axios.put(`http://localhost:5000/api/resume/${resumeId}`, payload);

      if (!silent) {
        setSuccessMessage("Changes saved successfully to your resume details!");
        setTimeout(() => setSuccessMessage(""), 4000);
      }

      return true;
    } catch (err) {
      console.error("Error saving resume data:", err);
      setError("Failed to save changes. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // 6. PROCEED TO TEMPLATE SELECTION
  // ==================================================
  const handleProceed = async () => {
    const saved = await handleSave(true);
    if (saved) {
      navigate(`/portfolio/create/${resumeId}`);
    }
  };

  // ==================================================
  // LOADING / ERROR
  // ==================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Extracting and loading resume details for review...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "about", label: "About / Summary", icon: FileText },
    { id: "experience", label: `Experience (${experience.length})`, icon: Briefcase },
    { id: "education", label: `Education (${education.length})`, icon: GraduationCap },
    { id: "skills", label: `Skills (${skills.length})`, icon: Wrench },
    { id: "projects", label: `Projects / Work (${projects.length})`, icon: FolderGit2 },
    { id: "certificates", label: `Certificates (${certificates.length})`, icon: Award },
    { id: "achievements", label: `Achievements (${achievements.length})`, icon: Trophy },
    { id: "languages", label: `Languages (${languages.length})`, icon: LanguagesIcon },
    { id: "custom", label: `Custom (${customSections.length})`, icon: Layers }
  ];

  const visibleSuggestions = suggestions.filter((s) => !dismissedSuggestions.includes(s.id));

  return (
    <div className="min-h-screen bg-[#080611] text-white selection:bg-purple-500 selection:text-white pb-24">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#080611]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">Review Resume Details</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Parsed from Resume
                </span>
              </div>
              <p className="text-xs text-slate-400">Step 1 of 3: Verify and refine your details before selecting a portfolio template</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition border border-white/10 disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin text-purple-400" /> : <Save size={14} />}
              Save Progress
            </button>

            <button
              onClick={handleProceed}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
            >
              <span>Choose Template</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
        {/* Left Navigation Tabs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-3 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
              Sections to Review
            </p>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* AI Suggestions Box in Sidebar */}
          {visibleSuggestions.length > 0 && (
            <div className="rounded-2xl bg-purple-500/[0.04] border border-purple-500/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles size={14} className="text-purple-400" />
                  <span>AI Suggestions ({visibleSuggestions.length})</span>
                </div>
                {loadingSuggestions && <Loader2 size={12} className="animate-spin text-purple-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Advisory tips to strengthen your portfolio based on your actual resume data:
              </p>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {visibleSuggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5 relative group"
                  >
                    <button
                      onClick={() => setDismissedSuggestions((prev) => [...prev, sug.id])}
                      className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 p-0.5"
                      title="Dismiss suggestion"
                    >
                      <X size={12} />
                    </button>
                    <p className="font-semibold text-slate-200 pr-4">{sug.title}</p>
                    <p className="text-[11px] text-slate-400 leading-normal">{sug.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Active Section Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* ====================================================
              1. PERSONAL DETAILS
          ==================================================== */}
          {activeTab === "personal" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User size={20} className="text-purple-400" />
                  Personal Information & Headline
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ensure your professional title, contact methods, and links are accurate.
                </p>
              </div>

              {/* Photo uploader */}
              <div className="flex items-center gap-5 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                {personal.photo ? (
                  <img
                    src={personal.photo}
                    alt={personal.name || "Profile"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                    <User size={30} />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">Profile Photo</p>
                  <p className="text-[11px] text-slate-400">
                    Recommended for portfolios. Professional headshots enhance credibility across any career.
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer mt-1">
                    <Upload size={12} />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={personal.name}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    placeholder="e.g. Dr. Jane Doe, Robert Smith"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professional Title / Headline *
                  </label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                    placeholder="e.g. Senior Accountant, Clinical Nurse, High School Educator"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Works for any career path (educators, medical, finance, tech, design).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    placeholder="email@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Location (City, Country)</label>
                  <input
                    type="text"
                    value={personal.location}
                    onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                    placeholder="e.g. Chicago, IL or London, UK"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Existing Website / Portfolio Link</label>
                  <input
                    type="text"
                    value={personal.portfolio_url}
                    onChange={(e) => setPersonal({ ...personal, portfolio_url: e.target.value })}
                    placeholder="https://mywebsite.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={personal.linkedin}
                    onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    GitHub / Code Repository (Optional)
                  </label>
                  <input
                    type="text"
                    value={personal.github}
                    onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
                    placeholder="https://github.com/username (only if applicable)"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              2. ABOUT / SUMMARY (WITH AI GENERATOR)
          ==================================================== */}
          {activeTab === "about" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText size={20} className="text-purple-400" />
                  About Me / Professional Summary
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  A compelling introduction summary introduces your background and philosophy to visitors.
                </p>
              </div>

              {/* AI About Generator Toolbar */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    <span className="text-xs font-bold text-purple-200">AI Summary Generator (5 Writing Styles)</span>
                  </div>
                  {aboutSource && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                      Source: {aboutSource}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate an authentic professional summary strictly using your actual resume facts. Select a tone below:
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {[
                    { id: "simple", label: "Simple & Clear" },
                    { id: "professional", label: "Executive / Professional" },
                    { id: "short", label: "Short & Punchy" },
                    { id: "technical", label: "Technical & Rigorous" },
                    { id: "career-focused", label: "Career-Focused / Ambitious" }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      disabled={generatingAbout}
                      onClick={() => handleGenerateAbout(style.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                        aboutStyle === style.id
                          ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {generatingAbout && aboutStyle === style.id ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 size={12} className="animate-spin text-white" />
                          Generating...
                        </span>
                      ) : (
                        style.label
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Summary Text (Editable)
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={6}
                  placeholder="Introduce yourself, your core domain competencies, and your professional focus..."
                  className={`${inputClass} resize-y leading-relaxed`}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>{about ? `${about.split(/\s+/).filter(Boolean).length} words` : "0 words"}</span>
                  {about && (
                    <button
                      type="button"
                      onClick={() => setAbout("")}
                      className="text-slate-400 hover:text-red-400 transition"
                    >
                      Clear text
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              3. EXPERIENCE & INTERNSHIPS
          ==================================================== */}
          {activeTab === "experience" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase size={20} className="text-purple-400" />
                    Work Experience & Internships
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage roles, hospital residencies, teaching positions, or corporate experience.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExperience([
                      ...experience,
                      { role: "", company: "", location: "", duration: "", description: "", is_internship: false }
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-sm shadow-purple-600/30"
                >
                  <Plus size={14} />
                  Add Position
                </button>
              </div>

              {experience.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No experience records extracted yet. Click "+ Add Position" above to add your employment or internships.
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">Position #{idx + 1}</span>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(item.is_internship)}
                              onChange={(e) => {
                                const updated = [...experience];
                                updated[idx].is_internship = e.target.checked;
                                setExperience(updated);
                              }}
                              className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-500/40"
                            />
                            <span>Internship</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = experience.filter((_, i) => i !== idx);
                              setExperience(updated);
                            }}
                            className="text-slate-500 hover:text-red-400 transition"
                            title="Delete this position"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Job Title / Role</label>
                          <input
                            type="text"
                            value={item.role}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[idx].role = e.target.value;
                              setExperience(updated);
                            }}
                            placeholder="e.g. Registered Nurse, Science Teacher, Accountant"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Organization / Employer</label>
                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[idx].company = e.target.value;
                              setExperience(updated);
                            }}
                            placeholder="e.g. St. Jude Hospital, Oakridge School, Deloitte"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Location</label>
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[idx].location = e.target.value;
                              setExperience(updated);
                            }}
                            placeholder="e.g. New York, NY"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Duration / Dates</label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[idx].duration = e.target.value;
                              setExperience(updated);
                            }}
                            placeholder="e.g. 2021 - Present or Jun 2022 - Aug 2022"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Key Responsibilities & Achievements</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].description = e.target.value;
                            setExperience(updated);
                          }}
                          rows={3}
                          placeholder="Describe responsibilities, outcomes, and impact..."
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              4. EDUCATION
          ==================================================== */}
          {activeTab === "education" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap size={20} className="text-purple-400" />
                    Education & Degrees
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Degrees, diplomas, certifications, or academic programs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEducation([
                      ...education,
                      { degree: "", institution: "", location: "", year: "", score: "", coursework: "" }
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus size={14} />
                  Add Degree
                </button>
              </div>

              {education.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No education records listed. Click "+ Add Degree" to include your credentials.
                </div>
              ) : (
                <div className="space-y-4">
                  {education.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">Degree #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = education.filter((_, i) => i !== idx);
                            setEducation(updated);
                          }}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Delete degree"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Degree / Qualification</label>
                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[idx].degree = e.target.value;
                              setEducation(updated);
                            }}
                            placeholder="e.g. B.S. in Nursing, Master of Education, B.Com"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Institution / University</label>
                          <input
                            type="text"
                            value={item.institution}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[idx].institution = e.target.value;
                              setEducation(updated);
                            }}
                            placeholder="e.g. University of California, Berkeley"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Year / Dates</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[idx].year = e.target.value;
                              setEducation(updated);
                            }}
                            placeholder="e.g. 2018 - 2022"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Score / GPA / Grade (Optional)</label>
                          <input
                            type="text"
                            value={item.score}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[idx].score = e.target.value;
                              setEducation(updated);
                            }}
                            placeholder="e.g. 3.8 GPA or Magna Cum Laude"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              5. SKILLS
          ==================================================== */}
          {activeTab === "skills" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wrench size={20} className="text-purple-400" />
                  Skills & Competencies
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add or remove skills relevant to your domain and profession.
                </p>
              </div>

              {/* Add Skill Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newSkill.trim()) {
                        setSkills([...skills, newSkill.trim()]);
                        setNewSkill("");
                      }
                    }
                  }}
                  placeholder="Type a skill and press Add (e.g. Patient Triage, Financial Auditing, Lesson Planning)..."
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  Add Skill
                </button>
              </div>

              {/* Skills Tag Cloud */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No skills listed yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs font-medium group"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                          className="text-purple-400 hover:text-red-400 transition"
                          title="Remove skill"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              6. PROJECTS / NOTABLE WORK
          ==================================================== */}
          {activeTab === "projects" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FolderGit2 size={20} className="text-purple-400" />
                    Projects & Notable Work
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Showcase key work samples, case studies, clinical research, publications, or client projects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setProjects([
                      ...projects,
                      { title: "", subtitle: "", description: "", technologies: "", link: "", github: "" }
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus size={14} />
                  Add Work / Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No projects or work samples extracted yet. Click "+ Add Work / Project" to showcase key deliverables.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">Work Sample #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = projects.filter((_, i) => i !== idx);
                            setProjects(updated);
                          }}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Title / Case Name</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].title = e.target.value;
                              setProjects(updated);
                            }}
                            placeholder="e.g. Pediatric Vaccination Campaign, Quarterly Audit Report"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Tools / Methodologies Used</label>
                          <input
                            type="text"
                            value={item.technologies}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].technologies = e.target.value;
                              setProjects(updated);
                            }}
                            placeholder="e.g. SPSS, Excel Modeling, Clinical Protocol"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Live URL / Publication Link</label>
                          <input
                            type="text"
                            value={item.link}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].link = e.target.value;
                              setProjects(updated);
                            }}
                            placeholder="https://example.com/project"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Repository / Source Code (Optional)</label>
                          <input
                            type="text"
                            value={item.github}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].github = e.target.value;
                              setProjects(updated);
                            }}
                            placeholder="https://github.com/... (if applicable)"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Description & Outcome</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[idx].description = e.target.value;
                            setProjects(updated);
                          }}
                          rows={3}
                          placeholder="Explain scope, execution, and outcomes..."
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              7. CERTIFICATES & CREDENTIALS
          ==================================================== */}
          {activeTab === "certificates" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award size={20} className="text-purple-400" />
                    Certificates & Professional Licenses
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    State licenses, professional certifications, or specialized credentials.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCertificates([
                      ...certificates,
                      { name: "", issuer: "", year: "", link: "" }
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus size={14} />
                  Add Certificate
                </button>
              </div>

              {certificates.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No certificates listed. Click "+ Add Certificate" to list licenses and training.
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">Credential #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = certificates.filter((_, i) => i !== idx);
                            setCertificates(updated);
                          }}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Delete certificate"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Certificate / License Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...certificates];
                              updated[idx].name = e.target.value;
                              setCertificates(updated);
                            }}
                            placeholder="e.g. Certified Public Accountant (CPA), BLS Healthcare Provider"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Issuer / Board</label>
                          <input
                            type="text"
                            value={item.issuer}
                            onChange={(e) => {
                              const updated = [...certificates];
                              updated[idx].issuer = e.target.value;
                              setCertificates(updated);
                            }}
                            placeholder="e.g. AICPA, American Heart Association"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Year / Expiry</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const updated = [...certificates];
                              updated[idx].year = e.target.value;
                              setCertificates(updated);
                            }}
                            placeholder="e.g. 2023 or Valid through 2027"
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Credential URL (Optional)</label>
                          <input
                            type="text"
                            value={item.link}
                            onChange={(e) => {
                              const updated = [...certificates];
                              updated[idx].link = e.target.value;
                              setCertificates(updated);
                            }}
                            placeholder="https://verification.link/..."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              8. ACHIEVEMENTS
          ==================================================== */}
          {activeTab === "achievements" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy size={20} className="text-purple-400" />
                    Achievements & Honors
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Awards, commendations, scholarships, or notable recognitions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAchievements([...achievements, { title: "", description: "" }])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus size={14} />
                  Add Achievement
                </button>
              </div>

              {achievements.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No achievements listed. Click "+ Add Achievement" to showcase your honors.
                </div>
              ) : (
                <div className="space-y-4">
                  {achievements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">Honor #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = achievements.filter((_, i) => i !== idx);
                            setAchievements(updated);
                          }}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Delete achievement"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...achievements];
                              updated[idx].title = e.target.value;
                              setAchievements(updated);
                            }}
                            placeholder="e.g. Teacher of the Year 2023, Dean's Honor List"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Details (Optional)</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...achievements];
                              updated[idx].description = e.target.value;
                              setAchievements(updated);
                            }}
                            rows={2}
                            placeholder="Brief context on the award or accomplishment..."
                            className={`${inputClass} resize-y`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              9. LANGUAGES
          ==================================================== */}
          {activeTab === "languages" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <LanguagesIcon size={20} className="text-purple-400" />
                    Languages
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Languages spoken and proficiency levels.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLanguages([...languages, { language: "", proficiency: "Fluent" }])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus size={14} />
                  Add Language
                </button>
              </div>

              {languages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No languages listed. Click "+ Add Language" to include multilingual capabilities.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {languages.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3 relative group"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item.language}
                          onChange={(e) => {
                            const updated = [...languages];
                            updated[idx].language = e.target.value;
                            setLanguages(updated);
                          }}
                          placeholder="e.g. English, Spanish, French"
                          className={inputClass}
                        />
                        <select
                          value={item.proficiency}
                          onChange={(e) => {
                            const updated = [...languages];
                            updated[idx].proficiency = e.target.value;
                            setLanguages(updated);
                          }}
                          className={`${inputClass} bg-[#0e0c18]`}
                        >
                          <option value="Native">Native / Bilingual</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Professional">Professional Working Proficiency</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Basic">Basic</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = languages.filter((_, i) => i !== idx);
                          setLanguages(updated);
                        }}
                        className="text-slate-500 hover:text-red-400 transition p-1"
                        title="Delete language"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              10. CUSTOM SECTIONS
          ==================================================== */}
          {activeTab === "custom" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers size={20} className="text-purple-400" />
                    Custom Sections
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add custom sections (e.g. Publications, Volunteer Work, Memberships, Clinical Rotations).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCustomSections([
                      ...customSections,
                      { heading: "Publications & Research", items: "" }
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus size={14} />
                  Add Custom Section
                </button>
              </div>

              {customSections.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-slate-400 text-xs">
                  No custom sections yet. You can add any domain-specific section here!
                </div>
              ) : (
                <div className="space-y-4">
                  {customSections.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">Custom Section #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = customSections.filter((_, i) => i !== idx);
                            setCustomSections(updated);
                          }}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Delete section"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Section Heading</label>
                          <input
                            type="text"
                            value={item.heading}
                            onChange={(e) => {
                              const updated = [...customSections];
                              updated[idx].heading = e.target.value;
                              setCustomSections(updated);
                            }}
                            placeholder="e.g. Community Volunteering, Research Publications, Professional Memberships"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Items / Content (One per line)</label>
                          <textarea
                            value={item.items}
                            onChange={(e) => {
                              const updated = [...customSections];
                              updated[idx].items = e.target.value;
                              setCustomSections(updated);
                            }}
                            rows={4}
                            placeholder="Enter section bullet points or details, one per line..."
                            className={`${inputClass} resize-y`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/10 to-violet-900/10 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-white">Satisfied with your reviewed data?</p>
              <p className="text-[11px] text-slate-400">
                You can still edit any detail later inside the live portfolio editor.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition border border-white/10 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin text-purple-400" /> : <Save size={14} />}
                Save Details
              </button>

              <button
                type="button"
                onClick={handleProceed}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              >
                <span>Save & Proceed to Templates</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PortfolioDataReview;
