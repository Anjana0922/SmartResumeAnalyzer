import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Eye,
  Share2,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  LayoutTemplate,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import ContentEditor from "../components/portfolio/ContentEditor";
import PhotoUploader from "../components/portfolio/PhotoUploader";
import SectionOrganizer from "../components/portfolio/SectionOrganizer";
import ThemeSelector from "../components/portfolio/ThemeSelector";
import PortfolioPreview from "../components/portfolio/PortfolioPreview";

function PortfolioEditor() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [theme, setTheme] = useState("light");
  const [currentTemplate, setCurrentTemplate] = useState("professional");
  const [deviceView, setDeviceView] = useState("desktop"); // desktop | tablet | mobile

  const [sections, setSections] = useState([
    "about",
    "experience",
    "education",
    "skills",
    "projects",
    "certificates",
    "achievements",
    "languages",
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const templateOptions = [
    { id: "professional", label: "Classic Professional" },
    { id: "minimal", label: "Modern Minimal" },
    { id: "dark", label: "Dark Tech / Modern" },
    { id: "aesthetic", label: "Creative Portfolio" },
    { id: "tech", label: "Elegant Professional" },
  ];

  // ==========================================
  // FETCH EXISTING GENERATED PORTFOLIO
  // ==========================================
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/portfolio/${portfolioId}`
        );

        const data = response.data.portfolio;

        if (!data) {
          setError("Portfolio could not be loaded.");
          return;
        }

        setPortfolio(data);
        setCurrentTemplate(data.template_name || "professional");
        setTheme(data.theme || (data.template_name === "dark" ? "dark" : "light"));

        setSections(
          data.section_order || [
            "about",
            "experience",
            "education",
            "skills",
            "projects",
            "certificates",
            "achievements",
            "languages",
          ]
        );

        if (data.photo_path) {
          setPhoto(data.photo_path);
        } else if (data.personal?.photo) {
          setPhoto(data.personal.photo);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load portfolio."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  // ==========================================
  // UPDATE EXISTING PORTFOLIO STATE
  // ==========================================
  const updatePortfolio = (updatedData) => {
    setPortfolio((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  // ==========================================
  // SAVE EXISTING PORTFOLIO (PUT)
  // ==========================================
  const handleSave = async (silent = false) => {
    if (!portfolio) return;

    try {
      setSaving(true);
      if (!silent) setMessage("");
      setError("");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.user_id || null;

      const updatedData = {
        template_name: currentTemplate,
        theme: theme,
        photo_path: photo || portfolio.personal?.photo || null,
        personal: portfolio.personal || {},
        about: portfolio.about || portfolio.summary || "",
        experience: portfolio.experience || [],
        education: portfolio.education || [],
        skills: portfolio.skills || [],
        projects: portfolio.projects || [],
        certificates: portfolio.certificates || [],
        achievements: portfolio.achievements || [],
        languages: portfolio.languages || [],
        custom_sections: portfolio.custom_sections || [],
        ai_suggestions: portfolio.ai_suggestions || [],
        section_order: sections,
      };

      const response = await axios.put(
        `http://localhost:5000/api/portfolio/${portfolioId}`,
        updatedData,
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      if (!silent) {
        setMessage("Portfolio saved successfully!");
        setTimeout(() => setMessage(""), 4000);
      }

      return true;
    } catch (err) {
      console.error("Error saving portfolio:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save portfolio."
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // COPY PUBLIC LINK
  // ==========================================
  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/portfolio/${portfolioId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setMessage(`Public link copied: ${publicUrl} (Local Development Link)`);
    setTimeout(() => {
      setCopiedLink(false);
      setMessage("");
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-purple-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading portfolio studio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
          <p className="text-slate-400 mt-2 text-sm">{error || "Could not retrieve portfolio data."}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-sm font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080611] text-white selection:bg-purple-500 selection:text-white">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080611]/90 backdrop-blur-xl px-6 py-3.5">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Branding & Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (portfolio.resume_id) {
                  navigate(`/portfolio/create/${portfolio.resume_id}`);
                } else {
                  navigate("/dashboard");
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              title="Back to Templates"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">Portfolio Studio</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                  Live Editor
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time template switching & content customization</p>
            </div>
          </div>

          {/* Center: Template Switcher & Device Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Template Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-[11px] text-slate-400 px-2 font-medium">Template:</span>
              <select
                value={currentTemplate}
                onChange={(e) => {
                  const newTemp = e.target.value;
                  setCurrentTemplate(newTemp);
                  if (newTemp === "dark") setTheme("dark");
                  updatePortfolio({ template_name: newTemp });
                }}
                className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-2"
              >
                {templateOptions.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#120f24] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Viewport Selector */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setDeviceView("desktop")}
                className={`p-1.5 rounded-lg transition ${
                  deviceView === "desktop" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="Desktop View (100%)"
              >
                <Monitor size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView("tablet")}
                className={`p-1.5 rounded-lg transition ${
                  deviceView === "tablet" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView("mobile")}
                className={`p-1.5 rounded-lg transition ${
                  deviceView === "mobile" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone size={15} />
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition border border-white/10"
              title="Copy local public link"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={async () => {
                await handleSave(true);
                navigate(`/portfolio/${portfolioId}`);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition border border-white/10"
              title="Open full page view"
            >
              <Eye size={14} />
              <span>View</span>
            </button>

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin text-white" /> : <Save size={14} />}
              <span>Save Portfolio</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Notifications */}
      <div className="max-w-[1700px] mx-auto px-6 pt-4">
        {message && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Split Layout */}
      <main className="max-w-[1700px] mx-auto p-6 pt-2">
        <div className="grid xl:grid-cols-[460px_1fr] gap-8">
          {/* LEFT: Editor Panel */}
          <aside className="space-y-5 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            {/* Active Template & Quick Switcher Info */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Active Design</p>
                <h2 className="text-sm font-bold text-white capitalize mt-0.5">
                  {templateOptions.find((t) => t.id === currentTemplate)?.label || currentTemplate}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (portfolio.resume_id) {
                    navigate(`/portfolio/create/${portfolio.resume_id}`);
                  }
                }}
                className="text-xs text-purple-300 hover:text-white transition flex items-center gap-1 font-medium"
              >
                <LayoutTemplate size={13} />
                <span>Gallery</span>
              </button>
            </div>

            {/* Content Editor */}
            <ContentEditor
              resume={portfolio}
              setResume={updatePortfolio}
            />

            {/* Photo Uploader */}
            <PhotoUploader
              photo={photo}
              setPhoto={(newPhoto) => {
                setPhoto(newPhoto);
                updatePortfolio({ photo_path: newPhoto });
              }}
            />

            {/* Theme Selector */}
            <ThemeSelector
              theme={theme}
              setTheme={(newTheme) => {
                setTheme(newTheme);
                updatePortfolio({ theme: newTheme });
              }}
            />

            {/* Section Organizer */}
            <SectionOrganizer
              sections={sections}
              setSections={setSections}
            />
          </aside>

          {/* RIGHT: Responsive Live Preview */}
          <section className="min-w-0 flex flex-col items-center">
            <div
              className={`w-full transition-all duration-300 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black ${
                deviceView === "mobile"
                  ? "max-w-[390px] min-h-[780px]"
                  : deviceView === "tablet"
                  ? "max-w-[768px] min-h-[820px]"
                  : "w-full"
              }`}
            >
              {/* Virtual Device Frame Bar */}
              {deviceView !== "desktop" && (
                <div className="bg-[#151124] border-b border-white/10 py-2 px-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{deviceView === "mobile" ? "Mobile Viewport (390px)" : "Tablet Viewport (768px)"}</span>
                  <button
                    onClick={() => setDeviceView("desktop")}
                    className="text-purple-400 hover:underline"
                  >
                    Reset to Desktop
                  </button>
                </div>
              )}

              <PortfolioPreview
                resume={portfolio}
                photo={photo}
                sections={sections}
                template={currentTemplate}
                theme={theme}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PortfolioEditor;
