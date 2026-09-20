import React, { useState, useRef } from "react";
import {
  Copy,
  Check,
  Download,
  FileDown,
  X,
  ShieldCheck,
  Loader2
} from "lucide-react";
import AtsTemplate from "../resume/templates/AtsTemplate";
import { generatePlainText, generateATSHTML, generateAtsTextPDF } from "../../utils/atsResumeGenerator";
import { getResumePdfFilename } from "../../utils/pdfGenerator";

export default function ATSResumePreviewModal({
  isOpen,
  onClose,
  resumeData,
  score = 0
}) {
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const printRef = useRef(null);

  if (!isOpen || !resumeData) return null;

  const candidateName = resumeData.personal?.name || "Candidate";

  // 1. Copy Plain Text
  const handleCopyPlainText = () => {
    const text = generatePlainText(resumeData);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // 2. Download Standalone ATS HTML
  const handleDownloadHTML = () => {
    const htmlContent = generateATSHTML(resumeData);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = candidateName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = `${safeName}-ats-resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 3. Direct Vector Text PDF Download using native jsPDF
  // Completely eliminates html2canvas, image rasterization, character distortion, and browser timestamps!
  const handleDownloadPDF = async () => {
    if (downloadingPdf) return;

    try {
      setDownloadingPdf(true);
      const filename = getResumePdfFilename(candidateName, "ats");
      console.log("[ATS] Generating pure vector text PDF via jsPDF:", filename);

      await generateAtsTextPDF(resumeData, filename);
      console.log("[ATS] PDF successfully downloaded:", filename);
    } catch (err) {
      console.error("[ATS] PDF generation error:", err);
      alert(`PDF generation failed: ${err.message || "Please try again."}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0a12] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#0f0e17]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  ATS-Friendly Standard Resume
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Single-Column &bull; Machine-Readable
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Standard typography, zero layout traps, pure candidate information.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Copy Plain Text */}
            <button
              onClick={handleCopyPlainText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer border border-white/10"
              title="Copy clean text formatted for ATS online application forms"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Plain Text</span>
                </>
              )}
            </button>

            {/* Download ATS HTML */}
            <button
              onClick={handleDownloadHTML}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer border border-white/10"
              title="Download standalone ATS HTML file"
            >
              <Download size={14} />
              <span>Download HTML</span>
            </button>

            {/* Direct PDF Download */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-purple-600/25 disabled:opacity-50"
              title="Download pristine A4 PDF without browser headers/footers"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown size={14} />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview Scroll Body */}
        <div className="p-6 overflow-y-auto bg-[#08070d] flex justify-center">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-300">
            <div ref={printRef} className="bg-white text-black">
              <AtsTemplate resume={resumeData} />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0f0e17] flex items-center justify-between text-xs text-slate-400">
          <span>
            Candidate: <strong className="text-white">{candidateName}</strong>
          </span>
          <span className="text-slate-500">
            PDF is rendered directly without browser headers, timestamps, or URLs.
          </span>
        </div>

      </div>
    </div>
  );
}
