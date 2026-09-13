import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Edit3 } from "lucide-react";

import PortfolioPreview from "../components/portfolio/PortfolioPreview";

function Portfolio() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        console.log("Saved portfolio:", response.data);

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
  // LOADING
  // ==================================================

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

  // ==================================================
  // PORTFOLIO NOT FOUND
  // ==================================================

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold">
            Portfolio not found
          </h2>

          <p className="text-gray-500 mt-3">
            {error || "The requested portfolio could not be loaded."}
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

  const theme = portfolio.theme || "light";

  const photo = portfolio.photo_path || null;

  const template =
    portfolio.template_name || "minimal";

  // ==================================================
  // VIEW
  // ==================================================

  return (
    <div className="min-h-screen bg-[#080611]">

      {/* ==================================================
          CONTROL BAR
      ================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080611]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              title="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-white">
                Portfolio
              </h1>

              <p className="text-xs text-gray-500">
                Saved version
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <button
            onClick={() =>
              navigate(`/portfolio/${portfolioId}/edit`)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition"
          >
            <Edit3 size={16} />
            Edit Portfolio
          </button>

        </div>
      </nav>

      {/* ==================================================
          SAVED PORTFOLIO
      ================================================== */}

      <main>
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