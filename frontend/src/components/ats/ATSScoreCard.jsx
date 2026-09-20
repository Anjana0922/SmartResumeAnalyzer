import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export default function ATSScoreCard({ score = 0, breakdown = {}, scoreLabel = "" }) {
  const isGood = score >= 75;
  const isAverage = score >= 50 && score < 75;
  const isPoor = score < 50;

  const scoreColor = isGood ? "text-emerald-400" : isAverage ? "text-amber-400" : "text-rose-400";
  const strokeColor = isGood ? "#10b981" : isAverage ? "#f59e0b" : "#f43f5e";
  const badgeBg = isGood
    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
    : isAverage
    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
    : "bg-rose-500/10 text-rose-300 border-rose-500/30";

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const categories = [
    { key: "contact", label: "Contact Information Readability", max: 15 },
    { key: "readability", label: "Machine-Readable Text Quality", max: 15 },
    { key: "layout", label: "Formatting & Layout Safety", max: 20 },
    { key: "clarity", label: "Section Clarity & Organization", max: 15 },
    { key: "structure", label: "Readability & Structure", max: 15 },
    { key: "consistency", label: "Formatting Consistency", max: 10 },
    { key: "risks", label: "ATS-Risk Elements", max: 10 }
  ];

  return (
    <div className="bg-[#0f0e17] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Circular Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#27272a"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-5xl font-extrabold tracking-tight ${scoreColor}`}>
                {score}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                / 100
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
              {isGood ? <CheckCircle size={14} /> : isAverage ? <AlertTriangle size={14} /> : <XCircle size={14} />}
              {scoreLabel || (isGood ? "Good ATS Compatibility" : isAverage ? "Average Compatibility" : "Needs Improvement")}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2 max-w-xs">
            {isGood
              ? "Your resume satisfies major ATS machine-reading criteria and will parse cleanly across most applicant tracking systems."
              : "Your resume has layout, symbol, or structural elements that may cause automated ATS screeners to drop critical information."}
          </p>
        </div>

        {/* Right: 7-Category Breakdown */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              ATS Compatibility Criteria
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              7 Evaluation Dimensions
            </span>
          </div>

          <div className="space-y-2.5">
            {categories.map((cat) => {
              const catData = breakdown[cat.key] || {};
              const catScore = catData.score !== undefined ? catData.score : 0;
              const catMax = catData.max || cat.max;
              const pct = Math.round((catScore / catMax) * 100);

              const barColor =
                pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";

              return (
                <div key={cat.key} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.label}</span>
                    <span className="font-mono text-slate-400">
                      <strong className="text-white">{catScore}</strong> / {catMax} pts
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {catData.details && (
                    <p className="text-[11px] text-slate-500 truncate">
                      {catData.details}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <Info size={13} className="shrink-0" />
            <span>
              Evaluates machine readability and layout safety. Missing optional sections do not penalize your score.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
