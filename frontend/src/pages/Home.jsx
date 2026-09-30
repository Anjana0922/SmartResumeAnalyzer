import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  ShieldCheck,
  Globe,
  Sliders,
  CheckCircle2,
  LayoutTemplate,
  Download,
  Menu,
  X
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">
                Profile Builder
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Career & Profile Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#workflow"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Workflow
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Templates
            </a>
            <button
              onClick={() => navigate("/ats")}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck size={16} className="text-indigo-600" />
              ATS Scanner
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 px-6 py-5 space-y-3 bg-white shadow-lg">
            <a
              href="#workflow"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium py-1"
            >
              Workflow
            </a>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium py-1"
            >
              Features
            </a>
            <a
              href="#templates"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium py-1"
            >
              Templates
            </a>
            <button
              onClick={() => { setMenuOpen(false); navigate("/ats"); }}
              className="block w-full text-left text-indigo-600 font-medium py-1"
            >
              ATS Scanner
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { setMenuOpen(false); navigate("/auth"); }}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-center text-sm"
              >
                Log in
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleGetStarted(); }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-center text-sm shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-36 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide mb-6">
              <Sparkles size={14} />
              <span>Career & Profile Platform</span>
            </div>

            {/* Project Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Profile Builder
            </h1>

            {/* Main Tagline */}
            <p className="mt-5 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 leading-snug">
              Create, improve, and present your professional profile in one place.
            </p>

            {/* Supporting Line */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Build your resume, check its ATS compatibility, improve it, and turn it into a professional portfolio.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition cursor-pointer text-sm"
              >
                Get Started Free
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate("/ats")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer text-sm shadow-sm"
              >
                <ShieldCheck size={16} className="text-indigo-600" />
                Analyze ATS Score
              </button>
            </div>

            {/* Workflow Sequence Indicator */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="text-indigo-700">Create</span>
              <span>&rarr;</span>
              <span className="text-indigo-700">Analyze</span>
              <span>&rarr;</span>
              <span className="text-indigo-700">Improve</span>
              <span>&rarr;</span>
              <span className="text-indigo-700">Present</span>
            </div>
          </div>

          {/* ================= WORKFLOW SHOWCASE CARD ================= */}
          <div className="max-w-5xl mx-auto mt-14">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Integrated Career Platform
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Four core tools working together seamlessly
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">Resume Builder</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Structured creation with modern templates and clean typography.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">ATS Scanner</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    100-point heuristic analysis checking formatting and readability.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">ATS Optimizer</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Single-column vector text PDF export for machine readability.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mb-3">
                    04
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">Portfolio Generator</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Interactive web portfolio generated directly from your resume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW / HOW IT WORKS ================= */}
      <section id="workflow" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">
              Create &rarr; Analyze &rarr; Improve &rarr; Present
            </h2>
            <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
              A straightforward process to build, verify, and showcase your professional credentials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WorkflowStep
              stepNumber="01"
              title="Create your resume"
              description="Build a clean, structured resume from scratch or import your existing details with automatic section recognition."
            />
            <WorkflowStep
              stepNumber="02"
              title="Analyze with ATS"
              description="Evaluate your resume against applicant tracking systems to check contact clarity, layout safety, and machine readability."
            />
            <WorkflowStep
              stepNumber="03"
              title="Improve your resume"
              description="Review diagnostic recommendations and generate a clean, single-column ATS-friendly PDF with zero parsing drop-offs."
            />
            <WorkflowStep
              stepNumber="04"
              title="Generate your portfolio"
              description="Transform your verified resume details into an interactive, modern web portfolio ready to share with recruiters."
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">
              Everything you need for your career profile.
            </h2>
            <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
              Profile Builder unifies resume creation, ATS compliance, and web portfolio presentation in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={FileText}
              title="Resume Builder"
              description="Create standard, structured resumes with customized education, skills, experience, and project sections."
            />

            <FeatureCard
              icon={ShieldCheck}
              title="ATS Compatibility Scanner"
              description="Transparent 7-category heuristic analysis checking contact info, structure, layout safety, and reading order."
            />

            <FeatureCard
              icon={Download}
              title="ATS-Friendly PDF Export"
              description="Export clean, selectable single-column vector text PDFs with zero character distortion or header traps."
            />

            <FeatureCard
              icon={Globe}
              title="Portfolio Studio"
              description="Generate a responsive personal website from your resume data without manual web development."
            />

            <FeatureCard
              icon={Sliders}
              title="Structured Profile Review"
              description="Fine-tune and reorganize your achievements, certifications, technologies, and work history anytime."
            />

            <FeatureCard
              icon={CheckCircle2}
              title="Ready for Recruiter Sharing"
              description="Download your optimized resume, copy plain-text ATS snippets, and export standalone portfolio pages."
            />
          </div>
        </div>
      </section>

      {/* ================= TEMPLATES SECTION ================= */}
      <section id="templates" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">
                Designs
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">
                Professional templates for every field.
              </h2>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                Choose clean styles tailored for technical, corporate, and creative disciplines.
              </p>
            </div>

            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
            >
              Browse all templates
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <TemplateCard
              name="ATS Standard"
              category="Single-Column"
              badge="ATS Optimal"
              bgClass="bg-slate-100"
            />
            <TemplateCard
              name="Minimal"
              category="Clean & Simple"
              bgClass="bg-sky-50"
            />
            <TemplateCard
              name="Modern"
              category="Balanced & Fresh"
              bgClass="bg-slate-100"
            />
            <TemplateCard
              name="Technical"
              category="Developer Focused"
              bgClass="bg-emerald-50"
            />
            <TemplateCard
              name="Professional"
              category="Corporate & Crisp"
              bgClass="bg-amber-50"
            />
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={22} />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Ready to build your professional profile?
            </h2>

            <p className="text-slate-600 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Create your resume, verify its ATS compatibility, improve its layout, and present it as a modern portfolio.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer text-sm"
              >
                Start with Profile Builder
              </button>

              <button
                onClick={() => navigate("/ats")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer text-sm"
              >
                Scan Resume ATS Score
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles size={14} />
            </div>
            <span className="font-bold text-sm text-slate-900">
              Profile Builder
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Create &bull; Analyze &bull; Improve &bull; Present &bull; 2026
          </p>
        </div>
      </footer>

    </div>
  );
}

/* ==================================================
   SUBCOMPONENTS
================================================== */

function WorkflowStep({ stepNumber, title, description }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-indigo-300 transition flex flex-col justify-between">
      <div>
        <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs font-mono">
          Stage {stepNumber}
        </span>
        <h3 className="text-lg font-bold mt-4 text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md transition">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
        <Icon size={18} />
      </div>
      <h3 className="text-base font-bold text-slate-900">
        {title}
      </h3>
      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TemplateCard({ name, category, badge, bgClass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-indigo-300 transition">
      <div className={`h-36 rounded-lg ${bgClass} border border-slate-200/70 p-3 flex flex-col justify-between relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <div className="w-10 h-1.5 bg-slate-400/40 rounded-full" />
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              {badge}
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="w-20 h-2 bg-slate-400/50 rounded" />
          <div className="w-14 h-1.5 bg-slate-400/30 rounded" />
          <div className="w-24 h-1.5 bg-slate-400/30 rounded" />
        </div>
        <div className="w-12 h-1 bg-slate-400/30 rounded-full" />
      </div>
      <h4 className="font-semibold text-xs text-slate-900 mt-2.5">
        {name}
      </h4>
      <p className="text-[11px] text-slate-500 mt-0.5">
        {category}
      </p>
    </div>
  );
}

export default Home;