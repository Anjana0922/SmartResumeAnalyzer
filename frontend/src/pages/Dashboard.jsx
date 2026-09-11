import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const category = user?.user_category || "Student";

  return (
    <div className="min-h-screen bg-[#08070d] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-purple-400 text-sm font-medium mb-2">
            Smart Resume Analyzer
          </p>

          <h1 className="text-4xl font-bold">
            Welcome, {user?.full_name || "User"} 👋
          </h1>

          <p className="text-slate-400 mt-3">
            Create, analyze, and build your professional portfolio.
          </p>

          <div className="mt-4">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Create Resume */}
          <button
            onClick={() => navigate("/resume/create")}
            className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-4xl mb-5">📝</div>

            <h2 className="font-semibold text-xl">
              Create Resume
            </h2>

            <p className="text-sm text-slate-400 mt-3 leading-6">
              Build a professional resume from scratch using our resume
              templates.
            </p>
          </button>

          {/* Generate Portfolio */}
          <button
            onClick={() => navigate("/upload")}
            className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-4xl mb-5">🌐</div>

            <h2 className="font-semibold text-xl">
              Generate Portfolio
            </h2>

            <p className="text-sm text-slate-400 mt-3 leading-6">
              Upload your existing resume and turn it into a professional
              portfolio website.
            </p>
          </button>

          {/* ATS Analysis */}
          <button
            onClick={() => navigate("/ats")}
            className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-4xl mb-5">📊</div>

            <h2 className="font-semibold text-xl">
              ATS Analysis
            </h2>

            <p className="text-sm text-slate-400 mt-3 leading-6">
              Analyze your resume and get suggestions to improve its ATS
              compatibility.
            </p>
          </button>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;