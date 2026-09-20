import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Edit3,
  AlertCircle,
  FileText,
  Download,
  LayoutTemplate,
  Loader2
} from "lucide-react";

import BasicTemplate from "../components/resume/templates/BasicTemplate";
import ClassicTemplate from "../components/resume/templates/ClassicTemplate";
import MinimalTemplate from "../components/resume/templates/MinimalTemplate";
import TwoColumnTemplate from "../components/resume/templates/TwoColumnTemplate";
import CreativeTemplate from "../components/resume/templates/CreativeTemplate";
import AtsTemplate from "../components/resume/templates/AtsTemplate";
import { generateResumePDF, getResumePdfFilename } from "../utils/pdfGenerator";
import { generateAtsTextPDF } from "../utils/atsResumeGenerator";

function ResumePreview() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateKey = searchParams.get("template");

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const resumePrintRef = useRef(null);

  // ==========================================================
  // Fetch Resume by ID
  // ==========================================================
  useEffect(() => {
    if (!resumeId) {
      setError("No Resume ID was provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/resume/${resumeId}`
        );

        console.log("Fetched resume details for preview:", response.data);

        if (response.data && response.data.resume) {
          setResume(response.data.resume);
        } else {
          setError("Resume data is missing from the server response.");
        }
      } catch (err) {
        console.error("Error loading resume preview:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load resume details. Please ensure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // ==========================================================
  // Handle Edit Action (Preserves Selected Template)
  // ==========================================================
  const handleEdit = () => {
    const editUrl = templateKey
      ? `/resume/edit/${resumeId}?template=${templateKey}`
      : `/resume/edit/${resumeId}`;

    if (resume) {
      navigate(editUrl, { state: { resumeData: resume, isEdit: true } });
    } else {
      navigate(editUrl);
    }
  };

  // ==========================================================
  // PDF Download Handler (Uses Direct html2canvas + jsPDF)
  // ==========================================================
  const handleDownloadPdf = async () => {
    if (downloadingPdf) return; // Prevent duplicate clicks

    console.log("PDF download started");
    console.log("Resume ID:", resumeId);
    console.log("Template:", templateKey);

    try {
      setDownloadingPdf(true);

      const filename = getResumePdfFilename(resume?.personal?.name, templateKey);
      console.log("Generated filename:", filename);

      if (templateKey === "ats") {
        console.log("[ResumePreview] Generating vector text PDF for ATS template:", filename);
        await generateAtsTextPDF(resume, filename);
      } else {
        const printableNode =
          document.getElementById("resume-print-node") || resumePrintRef.current;
        if (!printableNode) {
          console.error("Print container #resume-print-node not found!");
          alert("Error: Printable resume element not found. Please refresh the page.");
          return;
        }
        await generateResumePDF(printableNode, filename);
      }
      console.log("PDF download successfully completed:", filename);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert(`PDF download failed: ${err.message || "Please try again."}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Auto-download if ?download=true was passed (e.g. from My Resumes)
  useEffect(() => {
    if (resume && searchParams.get("download") === "true") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("download");
      navigate({ search: newParams.toString() }, { replace: true });

      const timer = setTimeout(() => {
        handleDownloadPdf();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [resume]);

  // ==========================================================
  // Select Template Component
  // ==========================================================
  const renderTemplateComponent = () => {
    switch (templateKey) {
      case "classic":
        return <ClassicTemplate resume={resume} />;
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      case "two-column":
        return <TwoColumnTemplate resume={resume} />;
      case "creative":
        return <CreativeTemplate resume={resume} />;
      case "ats":
        return <AtsTemplate resume={resume} />;
      default:
        return <ClassicTemplate resume={resume} />;
    }
  };

  // ==========================================================
  // Loading State
  // ==========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070d] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 font-medium text-sm">
            Loading resume preview...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // Error State
  // ==========================================================
  if (error || !resume) {
    return (
      <div className="min-h-screen bg-[#08070d] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.03] border border-red-500/30 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Resume Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            {error || "Unable to load resume information. It may have been deleted or never created."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition cursor-pointer"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/resume/create")}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition cursor-pointer"
            >
              Create Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ========================================================
            Top Navigation Bar
        ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (templateKey ? navigate(`/resume/templates/${resumeId}`) : navigate("/dashboard"))}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
              {templateKey ? "Template Gallery" : "Dashboard"}
            </button>

            <span className="text-slate-600">/</span>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                Resume #{resumeId}
              </span>
              {templateKey ? (
                <span className="text-xs px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/40 uppercase tracking-wider font-semibold">
                  {templateKey} Template
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10 font-semibold">
                  Basic Preview
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition cursor-pointer border border-white/10"
            >
              <Edit3 size={16} />
              Edit Resume
            </button>

            {templateKey ? (
              <>
                <button
                  onClick={() => navigate(`/resume/templates/${resumeId}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition cursor-pointer border border-white/10"
                >
                  <LayoutTemplate size={16} />
                  Change Template
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-purple-600/25 disabled:opacity-50"
                >
                  {downloadingPdf ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download PDF
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/resume/templates/${resumeId}`)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-purple-600/25"
                >
                  <LayoutTemplate size={16} />
                  Choose Template
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition cursor-pointer border border-white/10 disabled:opacity-50"
                >
                  {downloadingPdf ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download PDF
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================
            Resume Document Container (Dedicated Responsive Center Wrapper)
        ======================================================== */}
        <div className="w-full flex justify-center overflow-x-auto pb-4">
          <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-white">
            <div
              id="resume-print-node"
              ref={resumePrintRef}
              className="bg-white text-slate-900"
            >
              {templateKey ? renderTemplateComponent() : <BasicTemplate resume={resume} />}
            </div>
          </div>
        </div>

        {/* ========================================================
            Bottom Action Bar
        ======================================================== */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText size={15} className="text-purple-400" />
            <span>
              {templateKey
                ? `Template Preview: ${templateKey.toUpperCase()} Layout`
                : "Basic Resume Preview"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Edit3 size={14} />
              Edit Resume
            </button>

            {templateKey ? (
              <button
                onClick={() => navigate(`/resume/templates/${resumeId}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                <LayoutTemplate size={14} />
                Change Template
              </button>
            ) : (
              <button
                onClick={() => navigate(`/resume/templates/${resumeId}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer shadow-lg shadow-purple-600/25"
              >
                <LayoutTemplate size={14} />
                Choose Template
              </button>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer shadow-lg shadow-purple-600/25 disabled:opacity-50"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={14} />
                  Download PDF
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;
