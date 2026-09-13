import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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

        console.log("Portfolio:", response.data);

        const data = response.data.portfolio;

        setPortfolio(data);

        setTheme(data.theme || "light");

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
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);

        setError(
          err.response?.data?.message ||
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
  // SAVE EXISTING PORTFOLIO
  // ==========================================

    const handleSave = async () => {
  if (!portfolio) return;

  try {
    setSaving(true);
    setMessage("");
    setError("");

    const updatedData = {
      // Template
      template_name: portfolio.template_name,

      // Appearance
      theme: theme,

      // Photo
      photo_path: photo,

      // Personal details
      personal: portfolio.personal || {},

      // Content
      about: portfolio.about || "",

      experience: portfolio.experience || [],

      education: portfolio.education || [],

      skills: portfolio.skills || [],

      projects: portfolio.projects || [],

      certificates: portfolio.certificates || [],

      achievements: portfolio.achievements || [],

      languages: portfolio.languages || [],

      // Section order
      section_order: sections,
    };

    console.log("Saving portfolio:", updatedData);

    const response = await axios.put(
      `http://localhost:5000/api/portfolio/${portfolioId}`,
      updatedData
    );

    console.log("Save response:", response.data);

    // IMPORTANT:
    // Update local state with the saved portfolio
    if (response.data?.portfolio) {
      setPortfolio(response.data.portfolio);

      // If backend returns these values, keep them synchronized
      setTheme(response.data.portfolio.theme || "light");

      setSections(
        response.data.portfolio.section_order || sections
      );

      if (response.data.portfolio.photo_path) {
        setPhoto(response.data.portfolio.photo_path);
      }
    }

    setMessage("Portfolio saved successfully!");
  } catch (err) {
    console.error("Error saving portfolio:", err);

    setError(
      err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to save portfolio."
    );
  } finally {
    setSaving(false);
  }
};
        

      
    

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-400">
            Loading portfolio...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // PORTFOLIO NOT FOUND
  // ==========================================

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold">
            Portfolio not found
          </h2>

          <p className="text-gray-500 mt-3">
            {error}
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="mt-6 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition"
          >
            Upload Resume
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // EDITOR
  // ==========================================

  return (
    <div className="min-h-screen bg-[#080611] text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080611]/90 backdrop-blur-xl">

        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold">
              Portfolio Studio
            </h1>

            <p className="text-xs text-gray-500">
              Edit your generated portfolio
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition font-medium"
            >
              {saving
                ? "Saving..."
                : "Save Portfolio"}
            </button>

            {/* View */}
            <button
              onClick={() =>
                navigate(`/portfolio/${portfolioId}`)
              }
              className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              View Portfolio
            </button>

            {/* Change Template */}
            <button
              onClick={() =>
                navigate(
                  `/portfolio/${portfolioId}/templates`
                )
              }
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition font-medium"
            >
              Change Template
            </button>

          </div>

        </div>

      </nav>

      {/* Main */}
      <main className="max-w-[1600px] mx-auto p-6">

        <div className="grid xl:grid-cols-[420px_1fr] gap-6">

          {/* LEFT EDITOR */}
          <aside className="space-y-5">

            {/* Template */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              <p className="text-xs text-gray-500 uppercase">
                Current Template
              </p>

              <h2 className="font-semibold capitalize mt-1">
                {portfolio.template_name}
              </h2>

            </div>

            {/* Content Editor */}
            <ContentEditor
              resume={portfolio}
              setResume={updatePortfolio}
            />

            {/* Photo */}
            <PhotoUploader
              photo={photo}
              setPhoto={setPhoto}
            />

            {/* Sections */}
            <SectionOrganizer
              sections={sections}
              setSections={setSections}
            />

            {/* Theme */}
            <ThemeSelector
              theme={theme}
              setTheme={setTheme}
            />

            {/* Messages */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {message}
              </div>
            )}

          </aside>

          {/* RIGHT PREVIEW */}
          <section className="min-w-0">

            <div className="sticky top-24">

              <PortfolioPreview
                resume={portfolio}
                photo={photo}
                sections={sections}
                template={portfolio.template_name}
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