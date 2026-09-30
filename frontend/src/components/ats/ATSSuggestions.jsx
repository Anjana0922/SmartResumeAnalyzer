import React from "react";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function ATSSuggestions({
  score = 0,
  strengths = [],
  problems = [],
  suggestions = [],
  onConvertToATS
}) {
  const isBelowThreshold = score < 75;

  return (
    <div className="space-y-6">
      {/* =========================================================
          Conversion Callout Banner
      ========================================================= */}
      {isBelowThreshold ? (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
              <Zap size={16} className="text-amber-500" />
              <span>Optimization Recommended</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              ATS Compatibility Score: {score}/100
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your resume contains formatting, symbol, or structural elements that may cause automated ATS parsers to drop information.
              Convert to our clean, single-column ATS-friendly layout to standardize your document while preserving 100% of your actual details.
            </p>
          </div>

          <button
            onClick={onConvertToATS}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer group"
          >
            <span>Create ATS-Friendly Resume</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-800">
                Good ATS Compatibility ({score}/100)
              </h4>
              <p className="text-xs text-emerald-600">
                Your resume is well structured and machine-readable. You can still generate a standardized single-column version if desired.
              </p>
            </div>
          </div>

          <button
            onClick={onConvertToATS}
            className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold transition cursor-pointer border border-emerald-300 shadow-sm"
          >
            Preview Standard ATS Version
          </button>
        </div>
      )}

      {/* =========================================================
          Strengths & Issues Grid
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <CheckCircle2 size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800">
              Strengths ({strengths.length})
            </h4>
          </div>

          {strengths.length > 0 ? (
            <ul className="space-y-2.5">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">
              No strong highlights detected yet.
            </p>
          )}
        </div>

        {/* Issues Found Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <AlertCircle size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800">
              Detected Issues ({problems.length})
            </h4>
          </div>

          {problems.length > 0 ? (
            <ul className="space-y-2.5">
              {problems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-600 font-medium">
              No critical formatting issues detected. Your document is well formatted for machine parsing.
            </p>
          )}
        </div>

      </div>

      {/* =========================================================
          Actionable Optimization Checklist
      ========================================================= */}
      {suggestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Sparkles size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800">
              Suggestions to Improve Compatibility
            </h4>
          </div>

          <div className="space-y-2.5">
            {suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
