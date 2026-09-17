import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ArrowRight, Check, Sparkles, LayoutTemplate, Loader2 } from "lucide-react";

function TemplateSelection() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const templates = [
    {
      name: "professional",
      title: "Classic Professional",
      description: "Clean typography, formal layout, clear navigation; ideal for educators, healthcare, accounting, management.",
      badge: "Classic",
      accent: "from-blue-600 to-slate-700",
      className: "bg-[#e9e7df]",
    },
    {
      name: "minimal",
      title: "Modern Minimal",
      description: "Large typography, ample whitespace, and minimal cards; versatile for any professional path.",
      badge: "Clean",
      accent: "from-slate-600 to-zinc-800",
      className: "bg-[#eef5f8]",
    },
    {
      name: "dark",
      title: "Dark Tech / Modern",
      description: "Dark background, modern accent colors, strong hierarchy; suitable for technical and creative fields.",
      badge: "Dark Mode",
      accent: "from-purple-600 to-indigo-900",
      className: "bg-[#24202b]",
    },
    {
      name: "aesthetic",
      title: "Creative Portfolio",
      description: "Creative section cards, visual identity, modern hero, work showcase; ideal for designers, marketers, creatives.",
      badge: "Creative",
      accent: "from-pink-600 to-rose-800",
      className: "bg-[#f2e3e8]",
    },
    {
      name: "tech",
      title: "Elegant Professional",
      description: "Structured panels, refined emerald accents, and balanced sections; ideal for corporate and research careers.",
      badge: "Refined",
      accent: "from-emerald-600 to-teal-800",
      className: "bg-[#dceee8]",
    },
  ];

  // Get resume details
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/resume/${resumeId}`
        );

        setResume(response.data.resume);
      } catch (err) {
        console.error("Error fetching resume:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load resume details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // Create or Update portfolio (Upsert)
  const handleContinue = async () => {
    if (!resume) return;

    try {
      setCreating(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.user_id || null;

      const photoUrl =
        resume.metadata?.photo_path ||
        resume.personal?.photo ||
        resume.photo_path ||
        null;

      const rawSkills = resume.skills;
      const flatSkills = Array.isArray(rawSkills)
        ? rawSkills
        : (resume.flat_skills || rawSkills?.all || Object.values(rawSkills || {}).flat().filter(Boolean));

      const portfolioData = {
        resume_id: resumeId,
        user_id: userId,
        template_name: selectedTemplate,
        theme: selectedTemplate === "dark" ? "dark" : "light",
        photo_path: photoUrl,

        personal: resume.personal || {
          name: resume.name || "",
          title: resume.metadata?.title || "",
          email: resume.email || "",
          phone: resume.phone || "",
          location: resume.metadata?.location || "",
          github: resume.github || "",
          linkedin: resume.linkedin || "",
          portfolio_url: resume.metadata?.portfolio_url || ""
        },

        about: resume.about || resume.summary || "",
        experience: resume.experience || [],
        education: resume.education || [],
        skills: flatSkills || [],
        projects: resume.projects || [],
        certificates: resume.certificates || resume.certifications || [],
        achievements: resume.achievements || [],
        languages: resume.languages || [],
        custom_sections: resume.custom_sections || [],

        section_order: [
          "about",
          "experience",
          "education",
          "skills",
          "projects",
          "certificates",
          "achievements",
          "languages",
        ],
      };

      console.log("Upserting portfolio for resume:", resumeId);

      const response = await axios.post(
        "http://localhost:5000/api/portfolio",
        portfolioData,
        {
          headers: {
            "x-user-id": userId
          }
        }
      );

      const portfolioId = response.data.portfolio_id;

      if (!portfolioId) {
        setError("Portfolio ID was not returned by the server.");
        return;
      }

      // Open editor for the generated portfolio
      navigate(`/portfolio/${portfolioId}/edit`);
    } catch (err) {
      console.error("Error creating portfolio:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to initialize portfolio."
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-purple-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold">Resume not found</h2>
          <p className="text-slate-400 mt-2 text-sm">{error || "Could not retrieve resume details."}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-sm font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080611] text-white selection:bg-purple-500 selection:text-white pb-20">
      {/* Control Navigation */}
      <header className="sticky top-0 z-40 bg-[#080611]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/portfolio/review/${resumeId}`)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              title="Back to Review Details"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-base font-bold text-white">Choose Portfolio Template</h1>
              <p className="text-xs text-slate-400">Step 2 of 3: Select your visual presentation style</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/portfolio/review/${resumeId}`)}
            className="text-xs font-medium text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg border border-white/10"
          >
            Back to Review
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles size={13} />
            <span>Profession-Independent Templates</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Select Your Visual Layout
          </h2>

          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            All 5 templates display your exact resume details. You can freely switch templates and customize content at any time in the editor.
          </p>
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-12">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.name;
            return (
              <button
                key={template.name}
                type="button"
                onClick={() => setSelectedTemplate(template.name)}
                className={`text-left rounded-2xl p-4 transition duration-200 cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? "bg-purple-600/10 border-purple-500 shadow-xl shadow-purple-600/20 ring-2 ring-purple-500/50"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div>
                  {/* Template Wireframe Preview */}
                  <div className={`h-48 rounded-xl ${template.className} p-4 overflow-hidden relative shadow-inner mb-4 flex flex-col justify-between`}>
                    <div>
                      <div className="w-12 h-1.5 bg-black/20 rounded-full" />
                      <div className="w-24 h-3.5 bg-black/20 rounded-full mt-3" />
                      <div className="w-16 h-1.5 bg-black/15 rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-auto">
                      <div className="h-12 rounded-lg bg-black/10" />
                      <div className="h-12 rounded-lg bg-black/10" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded-full bg-black/20" />
                      <div className="h-1.5 w-3/4 rounded-full bg-black/20" />
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </div>

                  {/* Badge & Title */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {template.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-purple-400">Selected</span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-white">{template.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="max-w-md mx-auto mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Continue Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button
            type="button"
            onClick={() => navigate(`/portfolio/review/${resumeId}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition border border-white/10"
          >
            ← Back to Review
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={creating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
          >
            {creating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-white" />
                Initializing Portfolio...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Continue to Portfolio Editor
                <ArrowRight size={14} />
              </span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default TemplateSelection;
