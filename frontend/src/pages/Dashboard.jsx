import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const category = user?.user_category || "Student";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-indigo-600 text-sm font-semibold tracking-wide uppercase mb-2">
            Smart Resume Analyzer and Portfolio Generator
          </p>

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.full_name || "User"} 👋
          </h1>

          <p className="text-slate-600 mt-2">
            Analyze your resume, improve its ATS compatibility, and generate a professional portfolio from your resume.
          </p>

          <div className="mt-4">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* My Resumes */}
          <button
            onClick={() => navigate("/my-resumes")}
            className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left cursor-pointer group shadow-sm"
          >
            <div className="text-4xl mb-5 group-hover:scale-110 transition duration-200">📂</div>

            <h2 className="font-semibold text-xl text-slate-900 group-hover:text-indigo-600 transition">
              My Resumes
            </h2>

            <p className="text-sm text-slate-600 mt-3 leading-6">
              View, edit, choose templates, preview, and download all your saved and uploaded resumes.
            </p>
          </button>

          {/* Create Resume */}
          <button
            onClick={() => navigate("/resume/create")}
            className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left cursor-pointer group shadow-sm"
          >
            <div className="text-4xl mb-5 group-hover:scale-110 transition duration-200">📝</div>

            <h2 className="font-semibold text-xl text-slate-900 group-hover:text-indigo-600 transition">
              Create Resume
            </h2>

            <p className="text-sm text-slate-600 mt-3 leading-6">
              Build a professional resume from scratch using our resume
              templates.
            </p>
          </button>

          {/* Generate Portfolio */}
          <button
            onClick={() => navigate("/upload")}
            className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left cursor-pointer group shadow-sm"
          >
            <div className="text-4xl mb-5 group-hover:scale-110 transition duration-200">🌐</div>

            <h2 className="font-semibold text-xl text-slate-900 group-hover:text-indigo-600 transition">
              Generate Portfolio
            </h2>

            <p className="text-sm text-slate-600 mt-3 leading-6">
              Upload your existing resume and turn it into a professional
              portfolio website.
            </p>
          </button>

          {/* ATS Analysis */}
          <button
            onClick={() => navigate("/ats")}
            className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left cursor-pointer group shadow-sm"
          >
            <div className="text-4xl mb-5 group-hover:scale-110 transition duration-200">📊</div>

            <h2 className="font-semibold text-xl text-slate-900 group-hover:text-indigo-600 transition">
              ATS Analysis
            </h2>

            <p className="text-sm text-slate-600 mt-3 leading-6">
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