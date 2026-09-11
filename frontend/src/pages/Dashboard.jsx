import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Default to Student if category is missing
  const category = user?.user_category || "Student";

  const isStudent = category === "Student";

  const studentSections = [
    "Personal Details",
    "About / Objective",
    "Education",
    "Skills",
    "Projects",
    "Internships",
    "Certifications",
    "Achievements",
    "Languages",
    "Links",
  ];

  const jobSeekerSections = [
    "Personal Details",
    "About / Summary",
    "Education",
    "Skills",
    "Projects",
    "Experience",
    "Certifications",
    "Achievements",
    "Languages",
    "Links",
  ];

  const sections = isStudent
    ? studentSections
    : jobSeekerSections;

  return (
    <div className="min-h-screen bg-[#08070d] text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-purple-400 text-sm font-medium mb-2">
            Smart Resume Analyzer
          </p>

          <h1 className="text-4xl font-bold">
            Welcome, {user?.full_name || "User"} 👋
          </h1>

          <div className="mt-3">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          <button
            onClick={() => navigate("/resume/create")}
            className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-3xl mb-4">📝</div>
            <h2 className="font-semibold text-lg">
              Create Resume
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Build a professional resume from scratch.
            </p>
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-3xl mb-4">📄</div>
            <h2 className="font-semibold text-lg">
              Upload Resume
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Upload an existing resume and extract its information.
            </p>
          </button>

          <button
            className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-3xl mb-4">🌐</div>
            <h2 className="font-semibold text-lg">
              Generate Portfolio
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Create a professional portfolio from your resume.
            </p>
          </button>

          <button
            className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition text-left"
          >
            <div className="text-3xl mb-4">📊</div>
            <h2 className="font-semibold text-lg">
              ATS Analysis
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Analyze your resume and improve its ATS compatibility.
            </p>
          </button>

        </div>

        {/* Resume Sections */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Resume Sections
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Sections available for your {category.toLowerCase()} resume.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {sections.map((section, index) => (
              <div
                key={index}
                className="px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-slate-300"
              >
                {section}
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;