import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Languages as LanguagesIcon,
  Layers,
  Sparkles,
  AlertCircle,
  FileText,
  Download,
  LayoutTemplate,
  Loader2,
  ChevronRight
} from "lucide-react";

import ClassicTemplate from "../components/resume/templates/ClassicTemplate";
import MinimalTemplate from "../components/resume/templates/MinimalTemplate";
import TwoColumnTemplate from "../components/resume/templates/TwoColumnTemplate";
import CreativeTemplate from "../components/resume/templates/CreativeTemplate";
import AtsTemplate from "../components/resume/templates/AtsTemplate";

const formatCategoryTitle = (key) => {
  const k = key.toLowerCase().trim();
  if (k === "professional") return "Professional Skills";
  if (k === "technical") return "Technical Skills";
  if (k === "tools") return "Tools & Systems";
  if (k === "soft") return "Core Competencies";
  if (k === "industry") return "Industry Knowledge";
  if (k === "frameworks") return "Frameworks & Libraries";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

function ResumePreview() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateKey = searchParams.get("template");

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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
  // Handle Edit Action
  // ==========================================================
  const handleEdit = () => {
    if (resume) {
      navigate(`/resume/edit/${resumeId}`, { state: { resumeData: resume, isEdit: true } });
    } else {
      navigate(`/resume/edit/${resumeId}`);
    }
  };

  // ==========================================================
  // PDF Download Handler (html2pdf.js)
  // ==========================================================
  const handleDownloadPdf = async () => {
    const element = document.getElementById("resume-print-node");
    if (!element) {
      console.error("Print container #resume-print-node not found!");
      return;
    }

    try {
      setDownloadingPdf(true);

      // 1. Ensure all custom fonts (Inter, serif, etc.) are loaded
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (fontErr) {
          console.warn("Font readiness check warning:", fontErr);
        }
      }

      // 2. Ensure all images inside resume-print-node are loaded
      const images = element.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Avoid blocking if an image fails to load
        });
      });
      await Promise.all(imagePromises);

      // 3. Prepare clean filename
      const rawName = resume?.personal?.name || "Candidate";
      const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `${cleanName}_Resume.pdf`;

      // 4. Calibrated A4 PDF options
      const opt = {
        margin: [0, 0, 0, 0],
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        enableLinks: true,
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          windowWidth: 794,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          avoid: [
            ".pdf-avoid-break",
            ".resume-entry",
            ".resume-section-block",
            ".resume-section-header",
            "header",
            "section",
            "h1",
            "h2",
            "h3"
          ]
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

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

  // ==========================================================
  // Safe Extraction of Fields
  // ==========================================================
  const personal = resume.personal || {};
  const metadata = resume.metadata || {};
  const summaryText = resume.summary || resume.about || "";
  const education = Array.isArray(resume.education) ? resume.education : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const certificates = Array.isArray(resume.certificates)
    ? resume.certificates
    : Array.isArray(resume.certifications)
    ? resume.certifications
    : [];
  const achievements = Array.isArray(resume.achievements) ? resume.achievements : [];
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const customSections = Array.isArray(resume.custom_sections) ? resume.custom_sections : [];

  // Categorized Skills handling
  const skillsObj = resume.skills || resume.categorized_skills || {};
  const skillCategories =
    typeof skillsObj === "object" &&
    skillsObj !== null &&
    !Array.isArray(skillsObj)
      ? Object.entries(skillsObj).filter(
          ([key, val]) => key !== "all" && Array.isArray(val) && val.length > 0
        )
      : [];

  const flatSkills = Array.isArray(resume.skills)
    ? resume.skills
    : Array.isArray(resume.flat_skills)
    ? resume.flat_skills
    : Array.isArray(skillsObj.all)
    ? skillsObj.all
    : [];

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
                <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">
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
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition cursor-pointer"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>

        {templateKey ? (
          <div>
            {/* Dedicated Responsive Center Wrapper for Preview */}
            <div className="w-full flex justify-center overflow-x-auto pb-4">
              <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-white">
                <div id="resume-print-node" className="resume-print-root bg-white text-slate-900">
                  {renderTemplateComponent()}
                </div>
              </div>
            </div>

            {/* Template Bottom Action Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText size={15} className="text-purple-400" />
                <span>Template Preview: {templateKey.toUpperCase()} Layout</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
                >
                  <Edit3 size={14} />
                  Edit Resume
                </button>

                <button
                  onClick={() => navigate(`/resume/templates/${resumeId}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
                >
                  <LayoutTemplate size={14} />
                  Change Template
                </button>

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
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* ========================================================
                Resume Document Container
            ======================================================== */}
            <div className="bg-[#0e0d16] border border-white/10 rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-10">
          {/* ------------------------------------------------------
              1. Personal Header
          ------------------------------------------------------ */}
          <div className="pb-8 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {personal.name || "Untitled Resume"}
                </h1>

                {personal.title && (
                  <p className="text-lg text-purple-400 font-medium mt-1">
                    {personal.title}
                  </p>
                )}

                {/* Contact items */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-4 text-xs sm:text-sm text-slate-300">
                  {personal.email && (
                    <a
                      href={`mailto:${personal.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-purple-300 transition"
                    >
                      <Mail size={14} className="text-purple-400 shrink-0" />
                      <span>{personal.email}</span>
                    </a>
                  )}

                  {personal.phone && (
                    <a
                      href={`tel:${personal.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-purple-300 transition"
                    >
                      <Phone size={14} className="text-purple-400 shrink-0" />
                      <span>{personal.phone}</span>
                    </a>
                  )}

                  {personal.location && (
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      <MapPin size={14} className="text-purple-400 shrink-0" />
                      <span>{personal.location}</span>
                    </span>
                  )}
                </div>

                {/* Web Links */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {personal.github && (
                    <a
                      href={
                        personal.github.startsWith("http")
                          ? personal.github
                          : `https://${personal.github}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs border border-white/10 transition cursor-pointer"
                    >
                      <span>GitHub</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  )}

                  {personal.linkedin && (
                    <a
                      href={
                        personal.linkedin.startsWith("http")
                          ? personal.linkedin
                          : `https://${personal.linkedin}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs border border-white/10 transition cursor-pointer"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  )}

                  {personal.portfolio_url && (
                    <a
                      href={
                        personal.portfolio_url.startsWith("http")
                          ? personal.portfolio_url
                          : `https://${personal.portfolio_url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 text-xs border border-purple-500/20 transition cursor-pointer"
                    >
                      <Globe size={12} />
                      <span>Portfolio / Website</span>
                      <ExternalLink size={12} className="text-purple-400" />
                    </a>
                  )}
                </div>
              </div>

              {personal.photo && (
                <div className="shrink-0 mt-2 md:mt-0">
                  <img
                    src={
                      personal.photo.startsWith("http")
                        ? personal.photo
                        : `http://localhost:5000${personal.photo}`
                    }
                    alt={personal.name || "Candidate"}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl shadow-purple-950/40"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------
              2. Professional Summary / About
          ------------------------------------------------------ */}
          {summaryText && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <Sparkles size={16} />
                <h2>Professional Summary</h2>
              </div>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line pl-1">
                {summaryText}
              </p>
            </section>
          )}

          {/* ------------------------------------------------------
              3. Experience & Work History
          ------------------------------------------------------ */}
          {experience.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <Briefcase size={16} />
                <h2>Experience & Work History</h2>
              </div>

              <div className="space-y-6 pl-1">
                {experience.map((exp, idx) => {
                  const role = exp.role || exp.title || exp.position || "Role";
                  const company = exp.company || exp.organization || "";
                  const duration = exp.duration || exp.year || "";
                  const location = exp.location || "";
                  const description = exp.description || "";
                  const empType = exp.employment_type || (exp.is_internship ? "Internship" : null);
                  const highlights = Array.isArray(exp.highlights) ? exp.highlights : [];
                  const responsibilities = Array.isArray(exp.responsibilities)
                    ? exp.responsibilities
                    : typeof exp.responsibilities === "string" && exp.responsibilities
                    ? [exp.responsibilities]
                    : [];
                  const achievements = Array.isArray(exp.achievements)
                    ? exp.achievements
                    : typeof exp.achievements === "string" && exp.achievements
                    ? [exp.achievements]
                    : [];
                  const technologies = Array.isArray(exp.technologies)
                    ? exp.technologies
                    : typeof exp.technologies === "string" && exp.technologies
                    ? exp.technologies.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {role}
                          </h3>
                          {company && (
                            <span className="text-sm font-medium text-slate-300">
                              @ {company}
                            </span>
                          )}
                          {empType && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {empType}
                            </span>
                          )}
                          {exp.is_current && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                          {duration && <span>{duration}</span>}
                          {location && <span>• {location}</span>}
                        </div>
                      </div>

                      {description && (
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {description}
                        </p>
                      )}

                      {responsibilities.length > 0 && (
                        <ul className="space-y-1 pl-1 pt-1">
                          {responsibilities.map((resp, rIdx) => (
                            <li
                              key={rIdx}
                              className="text-xs sm:text-sm text-slate-300 flex items-start gap-2"
                            >
                              <span className="text-purple-400 font-bold leading-none mt-1">
                                •
                              </span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {highlights.length > 0 && (
                        <ul className="space-y-1.5 pl-1 pt-1">
                          {highlights.map((bullet, hIdx) => (
                            <li
                              key={hIdx}
                              className="text-xs sm:text-sm text-slate-300 flex items-start gap-2"
                            >
                              <span className="text-purple-400 font-bold leading-none mt-1">
                                •
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {achievements.length > 0 && (
                        <ul className="space-y-1 pl-1 pt-1">
                          {achievements.map((ach, aIdx) => (
                            <li
                              key={aIdx}
                              className="text-xs sm:text-sm text-emerald-300 flex items-start gap-2"
                            >
                              <span className="text-emerald-400 font-bold leading-none mt-1">
                                ★
                              </span>
                              <span><strong>Achievement:</strong> {ach}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-xs bg-white/[0.04] text-slate-300 border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------
              4. Education
          ------------------------------------------------------ */}
          {education.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <GraduationCap size={16} />
                <h2>Education</h2>
              </div>

              <div className="space-y-4 pl-1">
                {education.map((edu, idx) => {
                  const degree = edu.degree || edu.course || "Degree";
                  const institution =
                    edu.institution || edu.university || edu.college || "";
                  const board = edu.board || "";
                  const year = edu.year || edu.duration || "";
                  const score =
                    typeof edu.score === "object"
                      ? edu.score?.value || ""
                      : edu.score || edu.gpa || "";
                  const location = edu.location || "";
                  const coursework = Array.isArray(edu.coursework)
                    ? edu.coursework
                    : typeof edu.coursework === "string" && edu.coursework
                    ? edu.coursework.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];
                  const additionalDetails = edu.additional_details || "";

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-white/10 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {degree}
                          </h3>
                          {institution && (
                            <p className="text-sm text-slate-300 mt-0.5">
                              {institution}
                              {board ? ` • Board/Council: ${board}` : ""}
                              {location ? ` • ${location}` : ""}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {score && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              Grade: {score}
                            </span>
                          )}
                          {year && (
                            <span className="text-xs text-slate-400 font-mono">
                              {year}
                            </span>
                          )}
                        </div>
                      </div>

                      {coursework.length > 0 && (
                        <div className="pt-2">
                          <span className="text-xs text-slate-400 font-medium mr-2">
                            Coursework / Focus:
                          </span>
                          <span className="text-xs text-slate-300">
                            {coursework.join(" • ")}
                          </span>
                        </div>
                      )}

                      {additionalDetails && (
                        <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                          {additionalDetails}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------
              5. Skills & Competencies
          ------------------------------------------------------ */}
          {(skillCategories.length > 0 || flatSkills.length > 0) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <Code2 size={16} />
                <h2>Skills & Competencies</h2>
              </div>

              {skillCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
                  {skillCategories.map(([catKey, skills]) => (
                    <div key={catKey} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-xs uppercase tracking-wider text-purple-300 font-semibold mb-2.5">
                        {formatCategoryTitle(catKey)}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-md text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pl-1">
                  {flatSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs bg-white/[0.04] text-slate-200 border border-white/10"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ------------------------------------------------------
              6. Projects & Professional Work
          ------------------------------------------------------ */}
          {projects.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <FolderGit2 size={16} />
                <h2>Projects & Professional Work</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
                {projects.map((proj, idx) => {
                  const title = proj.title || proj.name || "Project";
                  const subtitle = proj.subtitle || "";
                  const role = proj.role || "";
                  const organization = proj.organization || "";
                  const description = proj.description || "";
                  const responsibilities = Array.isArray(proj.responsibilities)
                    ? proj.responsibilities
                    : typeof proj.responsibilities === "string" && proj.responsibilities
                    ? [proj.responsibilities]
                    : [];
                  const outcomes = proj.outcomes || "";
                  const duration = proj.duration || "";
                  const link = proj.link || proj.url || "";
                  const github = proj.github || "";
                  const technologies = Array.isArray(proj.technologies)
                    ? proj.technologies
                    : typeof proj.technologies === "string" && proj.technologies
                    ? proj.technologies.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between space-y-3 hover:border-white/10 transition"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base font-bold text-white">
                            {title}
                          </h3>
                          {duration && (
                            <span className="text-[11px] font-mono text-slate-400 shrink-0">
                              {duration}
                            </span>
                          )}
                        </div>

                        {subtitle && (
                          <p className="text-xs text-purple-300 font-medium mt-0.5">
                            {subtitle}
                          </p>
                        )}

                        {(role || organization) && (
                          <p className="text-xs text-slate-300 font-medium mt-1">
                            {role}{role && organization ? " — " : ""}{organization}
                          </p>
                        )}

                        {description && (
                          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                            {description}
                          </p>
                        )}

                        {responsibilities.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {responsibilities.map((r, rIdx) => (
                              <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-purple-400">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {outcomes && (
                          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                            <strong className="text-purple-300">Outcomes:</strong> {outcomes}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        {technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {technologies.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded text-[11px] bg-white/[0.04] text-slate-400 border border-white/5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {(link || github) && (
                          <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                            {link && (
                              <a
                                href={link.startsWith("http") ? link : `https://${link}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
                              >
                                <Globe size={12} />
                                <span>Link</span>
                              </a>
                            )}
                            {github && (
                              <a
                                href={github.startsWith("http") ? github : `https://${github}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                              >
                                <ExternalLink size={12} />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------
              7. Certifications
          ------------------------------------------------------ */}
          {certificates.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <Award size={16} />
                <h2>Certifications</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {cert.name || cert.title || "Certificate"}
                      </h4>
                      {cert.issuer && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {cert.issuer}
                        </p>
                      )}
                      {cert.link && (
                        <a
                          href={cert.link.startsWith("http") ? cert.link : `https://${cert.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2"
                        >
                          <span>View Credential</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    {cert.year && (
                      <span className="text-xs font-mono text-slate-500 shrink-0">
                        {cert.year}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------
              8. Achievements & Honors
          ------------------------------------------------------ */}
          {achievements.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <Award size={16} />
                <h2>Achievements & Honors</h2>
              </div>

              <ul className="space-y-2 pl-2">
                {achievements.map((ach, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="text-purple-400 font-bold leading-none mt-1">
                      ★
                    </span>
                    <span>{typeof ach === "string" ? ach : ach?.title || ""}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ------------------------------------------------------
              9. Languages
          ------------------------------------------------------ */}
          {languages.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                <LanguagesIcon size={16} />
                <h2>Languages</h2>
              </div>

              <div className="flex flex-wrap gap-3 pl-1">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-2 text-xs"
                  >
                    <span className="font-semibold text-white">
                      {lang.name || lang}
                    </span>
                    {lang.level && (
                      <span className="text-slate-400 font-mono">
                        ({lang.level})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------
              10. Additional / Custom Sections
          ------------------------------------------------------ */}
          {customSections.length > 0 && (
            <div className="space-y-8">
              {customSections.map((sec, sIdx) => {
                const heading = sec.heading || "Additional Section";
                const items = Array.isArray(sec.items) ? sec.items : [];
                if (!items.length) return null;

                return (
                  <section key={sIdx} className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
                      <Layers size={16} />
                      <h2>{heading}</h2>
                    </div>

                    <div className="space-y-3 pl-1">
                      {items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                {item.title}
                              </h4>
                              {item.subtitle && (
                                <p className="text-xs text-purple-300 font-medium">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            {item.date && (
                              <span className="text-xs font-mono text-slate-400 shrink-0">
                                {item.date}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-xs sm:text-sm text-slate-300 pt-1 leading-relaxed whitespace-pre-line">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================
            Bottom Action Bar
        ======================================================== */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText size={15} className="text-purple-400" />
            <span>Structured Resume Preview (Canonical Schema v1.0)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Edit3 size={14} />
              Edit Information
            </button>
            <button
              onClick={() => navigate(`/resume/templates/${resumeId}`)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-purple-600/25"
            >
              <LayoutTemplate size={14} />
              Choose Template
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
}

export default ResumePreview;
