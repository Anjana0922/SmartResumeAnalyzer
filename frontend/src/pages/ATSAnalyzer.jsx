import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from "lucide-react";

import ATSScoreCard from "../components/ats/ATSScoreCard";
import ATSSuggestions from "../components/ats/ATSSuggestions";
import ATSResumePreviewModal from "../components/ats/ATSResumePreviewModal";

export default function ATSAnalyzer() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Existing resumes from user's account
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        fetchUserResumes(u.user_id);
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
  }, []);

  const fetchUserResumes = async (userId) => {
    if (!userId) return;
    try {
      setLoadingResumes(true);
      const res = await axios.get(`http://localhost:5000/api/resume/my-resumes?user_id=${userId}`);
      if (res.data && Array.isArray(res.data.resumes)) {
        setUserResumes(res.data.resumes);
      }
    } catch (err) {
      console.warn("Could not fetch user resumes:", err.message);
    } finally {
      setLoadingResumes(false);
    }
  };

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f) => {
    setError("");
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (ext !== ".pdf" && ext !== ".docx") {
      setError("Please upload a PDF (.pdf) or Word document (.docx).");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setFile(f);
    setSelectedResumeId(""); // Clear selected dropdown if new file chosen
  };

  // Trigger ATS Analysis
  const handleAnalyze = async () => {
    if (!user || !user.user_id) {
      setError("Please log in to your account to analyze your resume.");
      return;
    }

    if (!file && !selectedResumeId) {
      setError("Please select a resume file or choose an existing resume from your account.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const formData = new FormData();
      formData.append("user_id", user.user_id);

      if (file) {
        formData.append("resume", file);
      } else if (selectedResumeId) {
        formData.append("resume_id", selectedResumeId);
      }

      const response = await axios.post("http://localhost:5000/api/ats/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("[ATS] Analysis result received:", response.data);

      if (response.data && response.data.success) {
        setAnalysisResult(response.data);
      } else {
        setError(response.data?.message || "Failed to analyze resume.");
      }
    } catch (err) {
      console.error("[ATS] Analysis error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to ATS analysis service."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFile(null);
    setSelectedResumeId("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ========================================================
            Top Navigation Bar
        ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-3 group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                ATS Resume Analyzer
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Heuristic Scanner
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Scan your resume against 7 core ATS categories. Identify parsing drop-offs and convert to an ATS-friendly layout.
            </p>
          </div>

          {analysisResult && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition cursor-pointer border border-white/10"
              >
                <RefreshCw size={15} />
                Analyze Another
              </button>
              <button
                onClick={() => setShowPreviewModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-purple-600/25"
              >
                <FileText size={15} />
                View ATS Resume
              </button>
            </div>
          )}
        </div>

        {/* ========================================================
            State 1: Upload & Selector Section (When no analysis yet)
        ======================================================== */}
        {!analysisResult && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-3">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Dropzone Container */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-10 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : file
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-white/[0.04]"
              }`}
              onClick={() => document.getElementById("ats-file-input")?.click()}
            >
              <input
                id="ats-file-input"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base truncate max-w-sm mx-auto">
                      {file.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB &bull; Ready to analyze
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 font-medium">
                    Click to change file
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
                    <Upload size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Upload your resume
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Drag and drop your file here, or click to browse
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports PDF (.pdf) and Word (.docx) up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Alternative: Select from My Resumes */}
            {userResumes.length > 0 && (
              <div className="bg-[#0f0e17] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <FolderOpen size={14} className="text-purple-400" />
                  <span>Or select from your saved resumes</span>
                </div>

                <select
                  value={selectedResumeId}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value);
                    if (e.target.value) setFile(null); // Clear file upload
                  }}
                  className="w-full bg-[#08070d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                >
                  <option value="">-- Choose a resume from your account --</option>
                  {userResumes.map((r) => (
                    <option key={r.resume_id} value={r.resume_id}>
                      {r.name ? `${r.name} - ` : ""}{r.file_name} (#{r.resume_id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!file && !selectedResumeId)}
              className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Scanning Resume & Calculating ATS Score...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze ATS Compatibility</span>
                </>
              )}
            </button>

            {/* Information Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-slate-400">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="font-semibold text-white mb-0.5">100% Heuristic</div>
                <div>No API fees or token delays</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="font-semibold text-white mb-0.5">7 Categories</div>
                <div>Transparent 0-100 scoring</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="font-semibold text-white mb-0.5">Instant Fix</div>
                <div>Single-column ATS conversion</div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            State 2: Results Display (When analysisResult is present)
        ======================================================== */}
        {analysisResult && (
          <div className="space-y-8">
            
            {/* Header Summary Banner */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {analysisResult.fileName || "Uploaded Resume"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Analyzed on {new Date().toLocaleDateString()} &bull; ATS Compatibility Report
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-purple-600/20"
              >
                <span>Convert to ATS-Friendly Resume</span>
              </button>
            </div>

            {/* Score Card: 0-100 gauge + 7 categories */}
            <ATSScoreCard
              score={analysisResult.overall_score}
              breakdown={analysisResult.breakdown}
              scoreLabel={analysisResult.score_label}
            />

            {/* Suggestions & Conversion Callout */}
            <ATSSuggestions
              score={analysisResult.overall_score}
              strengths={analysisResult.strengths}
              problems={analysisResult.problems}
              suggestions={analysisResult.suggestions}
              onConvertToATS={() => setShowPreviewModal(true)}
            />

          </div>
        )}

        {/* ========================================================
            Modal: ATS-Friendly Resume Preview & Export Controls
        ======================================================== */}
        {analysisResult?.cleanATSData && (
          <ATSResumePreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            resumeData={analysisResult.cleanATSData}
            score={analysisResult.overall_score}
          />
        )}

      </div>
    </div>
  );
}
