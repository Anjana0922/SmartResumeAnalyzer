import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Edit3, Share2, Check, LayoutTemplate, Home, Loader2, CheckCircle2, Download } from "lucide-react";

import PortfolioPreview from "../components/portfolio/PortfolioPreview";
import { exportPortfolioToHtml } from "../utils/exportPortfolioHtml";

function Portfolio() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ==================================================
  // FETCH SAVED PORTFOLIO
  // ==================================================

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/portfolio/${portfolioId}`
        );

        setPortfolio(response.data.portfolio);
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

  // ==================================================
  // COPY PUBLIC LINK
  // ==================================================
  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/portfolio/${portfolioId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setToastMessage(`Copied link to clipboard: ${publicUrl} (Local Development Link)`);
    setTimeout(() => {
      setCopiedLink(false);
      setToastMessage("");
    }, 4500);
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-purple-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // ==================================================
  // PORTFOLIO NOT FOUND
  // ==================================================

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
          <p className="text-slate-400 mt-2 text-sm">{error || "The requested portfolio could not be loaded."}</p>
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

  // ==================================================
  // PORTFOLIO DATA
  // ==================================================

  const sections =
    portfolio.section_order || [
      "about",
      "experience",
      "education",
      "skills",
      "projects",
      "certificates",
      "achievements",
      "languages",
    ];

  const theme = portfolio.theme || (portfolio.template_name === "dark" ? "dark" : "light");
  const photo = portfolio.photo_path || portfolio.personal?.photo || null;
  const template = portfolio.template_name || "professional";

  return (
    <div className="min-h-screen bg-[#080611] selection:bg-purple-500 selection:text-white">
      {/* Top Floating Control Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080611]/90 backdrop-blur-xl px-6 py-3.5">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              title="Dashboard"
            >
              <Home size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">
                  {portfolio.personal?.name ? `${portfolio.personal.name}'s Portfolio` : "Portfolio"}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Template: <span className="capitalize font-medium text-purple-300">{template}</span> • Theme: <span className="capitalize font-medium text-purple-300">{theme}</span>
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition border border-white/10 cursor-pointer"
              title="Copy shareable link"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copiedLink ? "Copied!" : "Copy Public Link"}</span>
            </button>

            {portfolio.resume_id && (
              <button
                onClick={() => navigate(`/portfolio/create/${portfolio.resume_id}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition border border-white/10 cursor-pointer"
                title="Choose different template"
              >
                <LayoutTemplate size={14} />
                <span>Change Template</span>
              </button>
            )}

            <button
              onClick={() => exportPortfolioToHtml(portfolio, { photo, template, theme })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition border border-white/10 cursor-pointer"
              title="Download standalone HTML portfolio"
            >
              <Download size={14} />
              <span>Download HTML</span>
            </button>

            <button
              onClick={() => navigate(`/portfolio/${portfolioId}/edit`)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Portfolio</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="max-w-2xl mx-auto px-6 pt-4 animate-fadeIn">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">localhost</span>
          </div>
        </div>
      )}

      {/* Render Selected Portfolio Template */}
      <main className="w-full">
        <PortfolioPreview
          resume={portfolio}
          photo={photo}
          sections={sections}
          template={template}
          theme={theme}
        />
      </main>
    </div>
  );
}

export default Portfolio;
