import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function TemplateSelection() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const templates = [
    {
      name: "minimal",
      title: "Minimal",
      description: "Clean and simple",
      className: "bg-[#eef5f8]",
    },
    {
      name: "dark",
      title: "Dark",
      description: "Elegant and modern",
      className: "bg-[#24202b]",
    },
    {
      name: "tech",
      title: "Tech",
      description: "Modern and structured",
      className: "bg-[#dceee8]",
    },
    {
      name: "professional",
      title: "Professional",
      description: "Corporate and polished",
      className: "bg-[#e9e7df]",
    },
    {
      name: "aesthetic",
      title: "Aesthetic",
      description: "Soft and creative",
      className: "bg-[#f2e3e8]",
    },
  ];

  // Get resume details
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/resume/${resumeId}`
        );

        console.log("Resume:", response.data);

        setResume(response.data.resume);
      } catch (err) {
        console.error("Error fetching resume:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load resume."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // Create portfolio from resume
  const handleContinue = async () => {
    if (!resume) return;

    try {
      setCreating(true);
      setError("");

      const photoUrl =
        resume.metadata?.photo_path ||
        resume.personal?.photo ||
        resume.photo_path ||
        null;

      const portfolioData = {
        resume_id: resumeId,

        template_name: selectedTemplate,

        theme: selectedTemplate === "dark" ? "dark" : "light",

        photo_path: photoUrl,

        about: resume.about || resume.summary || "",

        experience: resume.experience || [],

        education: resume.education || [],

        skills: resume.skills || [],

        projects: resume.projects || [],

        certificates: resume.certificates || resume.certifications || [],

        achievements: resume.achievements || [],

        languages: resume.languages || [],

        section_order: [
          "about",
          "experience",
          "education",
          "skills",
          "projects",
          "certificates",
          "achievements",
          "languages",
        ],
      };

      console.log("Creating portfolio:", portfolioData);

      const response = await axios.post(
        "http://localhost:5000/api/portfolio",
        portfolioData
      );

      console.log("Portfolio created:", response.data);

      const portfolioId = response.data.portfolio_id;

      if (!portfolioId) {
        setError("Portfolio ID was not returned by the server.");
        return;
      }

      // Open editor for the generated portfolio
      navigate(`/portfolio/${portfolioId}/edit`);
    } catch (err) {
      console.error("Error creating portfolio:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create portfolio."
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-400">
            Loading resume...
          </p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Resume not found
          </h2>

          <p className="text-gray-500 mt-3">
            {error}
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="mt-6 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080611] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#080611]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold">
              SmartResume
            </h1>

            <p className="text-xs text-gray-500">
              Portfolio Studio
            </p>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Back
          </button>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center max-w-2xl mx-auto">

          <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
            Step 1
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-4">
            Choose your template
          </h1>

          <p className="text-gray-400 mt-5">
            Your portfolio will be generated using the
            information extracted from your resume.
          </p>

        </div>

        {/* Templates */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-14">

          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() =>
                setSelectedTemplate(template.name)
              }
              className={`text-left transition ${
                selectedTemplate === template.name
                  ? "scale-[1.02]"
                  : ""
              }`}
            >

              <div
                className={`h-72 rounded-2xl ${template.className} p-6 overflow-hidden border-4 ${
                  selectedTemplate === template.name
                    ? "border-purple-500"
                    : "border-transparent"
                }`}
              >

                <div className="w-16 h-2 bg-black/10 rounded-full" />

                <div className="w-36 h-5 bg-black/10 rounded-full mt-7" />

                <div className="w-24 h-2 bg-black/10 rounded-full mt-3" />

                <div className="grid grid-cols-2 gap-3 mt-8">

                  <div className="h-24 rounded-xl bg-black/5" />

                  <div className="h-24 rounded-xl bg-black/5" />

                </div>

                <div className="space-y-2 mt-6">

                  <div className="h-2 rounded-full bg-black/10" />

                  <div className="h-2 w-4/5 rounded-full bg-black/10" />

                  <div className="h-2 w-3/5 rounded-full bg-black/10" />

                </div>

              </div>

              <h3 className="font-semibold mt-4">
                {template.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {template.description}
              </p>

            </button>
          ))}

        </div>

        {/* Error */}
        {error && (
          <div className="max-w-xl mx-auto mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Continue */}
        <div className="flex justify-center mt-12">

          <button
            onClick={handleContinue}
            disabled={creating}
            className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition font-semibold"
          >
            {creating
              ? "Generating Portfolio..."
              : `Use ${selectedTemplate} Template →`}
          </button>

        </div>

      </main>
    </div>
  );
}

export default TemplateSelection;