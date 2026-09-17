import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Plus,
  Upload,
  Trash2,
  Edit3,
  Eye,
  Download,
  ExternalLink,
  Calendar,
  User,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  Loader2,
  Globe,
  LayoutTemplate
} from "lucide-react";

export default function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState("all"); // 'all' | 'scratch' | 'upload'
  
  // Delete modal state
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Download state for direct card download
  const [downloadingId, setDownloadingId] = useState(null);

  // Current logged in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.user_id || 1; // Fallback to 1 if testing without login

  const fetchUserResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/resume/my-resumes?user_id=${userId}`
      );

      if (response.data && Array.isArray(response.data.resumes)) {
        setResumes(response.data.resumes);
      } else {
        setResumes([]);
      }
    } catch (err) {
      console.error("Error loading user resumes:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load your resumes. Please ensure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserResumes();
  }, [userId]);

  // Handle Delete Resume
  const confirmDelete = async () => {
    if (!resumeToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await axios.delete(
        `http://localhost:5000/api/resume/${resumeToDelete.resume_id}`,
        {
          data: { user_id: userId }
        }
      );

      setResumes((prev) =>
        prev.filter((r) => r.resume_id !== resumeToDelete.resume_id)
      );

      setSuccessMessage(
        `Resume #${resumeToDelete.resume_id} ("${resumeToDelete.name}") was deleted successfully.`
      );
      setResumeToDelete(null);

      // Auto clear message after 4s
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error deleting resume:", err);
      setError(
        err.response?.data?.message || "Failed to delete the resume."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Direct Card PDF Download - Navigates to Preview where printable element is reliably rendered
  const handleCardDownloadPdf = (resumeItem) => {
    navigate(`/resume/preview/${resumeItem.resume_id}?download=true`);
  };

  // Filtered resumes
  const filteredResumes = resumes.filter((r) => {
    // Filter by source
    if (filterSource !== "all" && r.source !== filterSource) {
      return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (r.name || "").toLowerCase().includes(q);
      const matchTitle = (r.title || "").toLowerCase().includes(q);
      const matchFile = (r.file_name || "").toLowerCase().includes(q);
      const matchTarget = (r.career_target || "").toLowerCase().includes(q);
      return matchName || matchTitle || matchFile || matchTarget;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 px-4 py-8 md:px-8">
      

      <div className="max-w-6xl mx-auto space-y-8">
        {/* ========================================================
            Top Header
        ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                Dashboard
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs text-purple-300 font-medium">My Resumes</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2 flex items-center gap-3">
              My Resumes
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View, edit, choose templates, preview, and download your resumes across all professions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/resume/create")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-purple-600/25"
            >
              <Plus size={16} />
              Create Resume
            </button>

            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition cursor-pointer border border-white/10"
            >
              <Upload size={16} />
              Upload Resume
            </button>
          </div>
        </div>

        {/* ========================================================
            Success & Error Banners
        ======================================================== */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================
            Search & Filter Controls
        ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, title, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/60 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterSource("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                filterSource === "all"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              All ({resumes.length})
            </button>

            <button
              onClick={() => setFilterSource("scratch")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                filterSource === "scratch"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Created ({resumes.filter((r) => r.source === "scratch").length})
            </button>

            <button
              onClick={() => setFilterSource("upload")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                filterSource === "upload"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Uploaded ({resumes.filter((r) => r.source === "upload").length})
            </button>
          </div>
        </div>

        {/* ========================================================
            Resumes Grid / List
        ======================================================== */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading your resumes...</p>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="py-20 px-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
              <FileText size={28} />
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white mb-1">
                {searchQuery || filterSource !== "all"
                  ? "No matching resumes found"
                  : "No Resumes Created Yet"}
              </h3>
              <p className="text-sm text-slate-400">
                {searchQuery || filterSource !== "all"
                  ? "Try adjusting your search query or filter settings."
                  : "Start by creating a structured resume from scratch, or upload an existing PDF resume to analyze and convert into a portfolio."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate("/resume/create")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer"
              >
                <Plus size={16} />
                Create Resume from Scratch
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition cursor-pointer border border-white/10"
              >
                <Upload size={16} />
                Upload Existing Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResumes.map((item) => {
              const isCreated = item.source === "scratch";
              const photoUrl = item.photo
                ? item.photo.startsWith("http")
                  ? item.photo
                  : `http://localhost:5000${item.photo}`
                : null;

              const initials = (item.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={item.resume_id}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition p-6 flex flex-col justify-between space-y-6 group shadow-lg"
                >
                  {/* Card Header */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={item.name}
                            className="w-13 h-13 rounded-full object-cover border-2 border-purple-500/40 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center border-2 border-purple-500/40 shrink-0">
                            {initials}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                              {item.name || "Untitled Resume"}
                            </h2>
                            <span className="text-[11px] font-mono text-slate-500">
                              #{item.resume_id}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-purple-400 mt-0.5">
                            {item.title || item.career_target || "Professional"}
                          </p>
                        </div>
                      </div>

                      {/* Source Badge */}
                      <div>
                        {isCreated ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-semibold">
                            <Sparkles size={11} />
                            Created
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/25 text-[11px] font-semibold">
                            <Upload size={11} />
                            Uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta info & About snippet */}
                    {item.about && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                        "{item.about}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-500" />
                        {item.last_updated
                          ? new Date(item.last_updated).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })
                          : item.upload_date}
                      </span>

                      {item.email && (
                        <span className="text-slate-400 truncate max-w-[160px]">
                          {item.email}
                        </span>
                      )}

                      {item.location && (
                        <span className="text-slate-400">
                          {item.location}
                        </span>
                      )}

                      {item.portfolio_id && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                          <Globe size={11} />
                          Portfolio Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Preview Button */}
                      <button
                        onClick={() => navigate(`/resume/preview/${item.resume_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm shadow-purple-600/20"
                        title="View Resume Preview"
                      >
                        <Eye size={14} />
                        Preview
                      </button>

                      {/* Choose Template Button */}
                      <button
                        onClick={() => navigate(`/resume/templates/${item.resume_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer border border-white/10"
                        title="Choose Template Layout"
                      >
                        <LayoutTemplate size={14} />
                        Templates
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => navigate(`/resume/edit/${item.resume_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer border border-white/10"
                        title="Edit Resume Information"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      {/* Download PDF Button */}
                      <button
                        onClick={() => handleCardDownloadPdf(item)}
                        disabled={downloadingId === item.resume_id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer border border-white/10 disabled:opacity-50"
                        title="Download PDF"
                      >
                        {downloadingId === item.resume_id ? (
                          <Loader2 size={14} className="animate-spin text-purple-400" />
                        ) : (
                          <Download size={14} />
                        )}
                        PDF
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Portfolio Generator Link */}
                      <button
                        onClick={() => navigate(`/portfolio/create/${item.resume_id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 text-xs font-medium transition cursor-pointer"
                        title="Generate Portfolio Website"
                      >
                        <Globe size={13} />
                        Portfolio
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setResumeToDelete(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        title="Delete Resume"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================
          Delete Confirmation Modal
      ======================================================== */}
      {resumeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-[#12111d] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 size={24} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Delete Resume?</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to delete resume #{resumeToDelete.resume_id}{" "}
                <span className="text-white font-semibold">"{resumeToDelete.name}"</span>?
                This will permanently delete this resume and its associated details.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-red-600/25 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
