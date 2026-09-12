import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Check,
  Sparkles,
  FileText,
  LayoutTemplate,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Columns,
  Palette,
  AlignLeft
} from "lucide-react";

const TEMPLATES = [
  {
    key: "classic",
    name: "Classic Professional",
    tagline: "Timeless, elegant, and universally accepted",
    badge: "Most Popular",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: FileText,
    accent: "from-blue-600 to-indigo-600",
    description:
      "A traditional serif layout with structured headers, clean borders, and balanced margins. Perfect for corporate, finance, and academic roles.",
    features: [
      "Traditional serif typography",
      "Structured section dividers",
      "Optional profile photo top right",
      "100% ATS parser friendly"
    ],
    previewBg: "bg-white text-slate-900 border-slate-300"
  },
  {
    key: "minimal",
    name: "Modern Minimal",
    tagline: "Clean whitespace, sleek typography, understated elegance",
    badge: "Clean & Modern",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: AlignLeft,
    accent: "from-emerald-600 to-teal-600",
    description:
      "Minimalist design with generous whitespace, subtle dividing lines, and clean sans-serif typography. Excellent for tech and startup applications.",
    features: [
      "Modern sans-serif typography",
      "Subtle timeline dividing lines",
      "Clean tag badges for skills",
      "High readability across all devices"
    ],
    previewBg: "bg-zinc-50 text-zinc-900 border-zinc-200"
  },
  {
    key: "two-column",
    name: "Two-Column Professional",
    tagline: "High density layout with dedicated sidebar for skills & contact",
    badge: "Space Efficient",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Columns,
    accent: "from-purple-600 to-pink-600",
    description:
      "Dedicated left sidebar for contact details, photo, skills pills, and languages, leaving the main panel for your achievements and career journey.",
    features: [
      "Distinct sidebar for skills & contact",
      "Highlighted timeline for experience",
      "Prominent profile photo integration",
      "Ideal for multi-skilled candidates"
    ],
    previewBg: "bg-slate-100 text-slate-900 border-slate-300"
  },
  {
    key: "creative",
    name: "Creative Modern",
    tagline: "Eye-catching banner with dynamic card layouts",
    badge: "Stand Out",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Palette,
    accent: "from-amber-600 to-purple-600",
    description:
      "Features a striking gradient header, card-based section containers, and colorful tag pills. Designed to make your application visually memorable.",
    features: [
      "Deep gradient header banner",
      "Styled experience & project cards",
      "Contrasting skill badges",
      "Great for creative, frontend & product roles"
    ],
    previewBg: "bg-gradient-to-r from-slate-900 to-purple-900 text-white border-purple-500/30"
  },
  {
    key: "ats",
    name: "Technical ATS",
    tagline: "Engineered strictly for automated screening algorithms",
    badge: "ATS Guaranteed",
    badgeColor: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: ShieldCheck,
    accent: "from-emerald-600 to-green-600",
    description:
      "Strict single-column layout in pure black and white. Zero tables, zero images, zero complex formatting. Guaranteed 100% parseable by every ATS.",
    features: [
      "Strict single-column text flow",
      "Categorized software tech stacks",
      "Zero images or complex formatting",
      "Highest machine readability score"
    ],
    previewBg: "bg-white text-black border-black"
  }
];

export default function ResumeTemplates() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) {
      setError("No resume ID provided.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/resume/${resumeId}`)
      .then((res) => {
        if (res.data?.resume) {
          setResume(res.data.resume);
        } else {
          setError("Resume data could not be retrieved.");
        }
      })
      .catch((err) => {
        console.error("Error loading resume for template selector:", err);
        setError("Failed to fetch resume details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resumeId]);

  const handleSelectTemplate = (templateKey) => {
    navigate(`/resume/preview/${resumeId}?template=${templateKey}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070d] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading template gallery...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-[#08070d] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.03] border border-red-500/30 text-center">
          <AlertCircle size={24} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Error Loading Resume</h2>
          <p className="text-slate-400 text-sm mb-6">{error || "Resume not found."}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const candidateName = resume.personal?.name || "Candidate";

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <button
              onClick={() => navigate(`/resume/preview/${resumeId}`)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-3 group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
              Back to Basic Preview
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Choose a Resume Template
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Resume #{resumeId}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Select one of our 5 professionally formatted layouts for {candidateName}. You can change templates anytime and export as PDF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/resume/edit/${resumeId}`)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition cursor-pointer border border-white/10"
            >
              Edit Resume Data
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.key}
                className="group relative bg-[#0e0d16] border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div>
                  {/* Top Bar with Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] text-purple-400 border border-white/5 group-hover:border-purple-500/30 transition">
                      <Icon size={20} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                  </div>

                  {/* Thumbnail / Layout Representation */}
                  <div className="mb-5 p-3 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                    <div className={`h-32 rounded-lg p-2.5 text-[8px] flex flex-col justify-between border ${tmpl.previewBg} transition transform group-hover:scale-[1.02] duration-300`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold uppercase tracking-wider text-[9px] truncate max-w-[120px]">
                            {candidateName}
                          </div>
                          <div className="opacity-70 text-[7px] truncate max-w-[110px]">
                            {resume.personal?.title || "Software Engineer"}
                          </div>
                        </div>
                        {resume.personal?.photo && tmpl.key !== "ats" && (
                          <div className="w-5 h-5 rounded-full bg-slate-300 shrink-0" />
                        )}
                      </div>

                      {/* Mock Layout Structure */}
                      {tmpl.key === "two-column" ? (
                        <div className="flex gap-1 mt-1 h-14">
                          <div className="w-1/3 bg-slate-200/50 rounded p-1 space-y-1">
                            <div className="h-1 w-full bg-slate-400/50 rounded" />
                            <div className="h-1 w-3/4 bg-slate-400/50 rounded" />
                            <div className="h-1 w-1/2 bg-slate-400/50 rounded" />
                          </div>
                          <div className="w-2/3 space-y-1 p-1">
                            <div className="h-1.5 w-full bg-purple-400/50 rounded" />
                            <div className="h-1 w-full bg-slate-400/30 rounded" />
                            <div className="h-1 w-5/6 bg-slate-400/30 rounded" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 mt-1">
                          <div className="h-1.5 w-1/2 bg-slate-500/40 rounded" />
                          <div className="h-1 w-full bg-slate-400/30 rounded" />
                          <div className="h-1 w-4/5 bg-slate-400/30 rounded" />
                          <div className="h-1.5 w-2/5 bg-slate-500/40 rounded mt-1.5" />
                          <div className="h-1 w-full bg-slate-400/30 rounded" />
                        </div>
                      )}

                      <div className="text-[7px] opacity-60 flex justify-between pt-1 border-t border-current/10">
                        <span>{tmpl.key.toUpperCase()} FORMAT</span>
                        <span>A4 READY</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-purple-300/80 font-medium mb-2">
                    {tmpl.tagline}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tmpl.description}
                  </p>

                  {/* Feature Bullets */}
                  <ul className="space-y-1.5 mb-6 text-xs text-slate-300">
                    {tmpl.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <Check size={13} className="text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectTemplate(tmpl.key)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  <span>Use This Template</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
