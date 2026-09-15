import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    setMessage("");
    setError("");

    if (!selectedFile) {
      setError("Please select your resume first.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setError("Please login before uploading your resume.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // 1. Upload Resume
      // ==============================

      const formData = new FormData();

      formData.append("resume", selectedFile);
      formData.append("user_id", user.user_id);

      const resumeResponse = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Resume upload response:", resumeResponse.data);

      const resumeId = resumeResponse.data.resume_id;

      if (!resumeId) {
        setError("Resume uploaded, but resume ID was not returned.");
        return;
      }

      // Save Resume ID to localStorage
      localStorage.setItem("resume_id", resumeId);
      console.log("Saved resume ID:", resumeId);

      setMessage("Resume uploaded and parsed successfully! Redirecting to portfolio templates...");

      // Go to Template Selection for this resume
      setTimeout(() => {
        navigate(`/portfolio/create/${resumeId}`);
      }, 1000);

    } catch (err) {
      console.error("Upload error:", err);

      if (err.response) {
        setError(
          err.response.data.message ||
            err.response.data.error ||
            "Resume upload failed."
        );
      } else {
        setError(
          "Cannot connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080611] text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Background glow */}

      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />

      {/* Main container */}

      <div className="relative z-10 w-full max-w-5xl">

        {/* Header */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-5">

            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

            Resume Analyzer

          </div>

          <h1 className="text-4xl md:text-5xl font-bold">

            Upload your

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500">
              {" "}resume
            </span>

          </h1>

          <p className="text-slate-400 mt-4 max-w-xl mx-auto">

            Upload your resume and we'll extract your
            education, skills, projects, certifications
            and achievements to build your portfolio.

          </p>

        </div>

        {/* Main card */}

        <div className="max-w-2xl mx-auto">

          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

            {/* Upload area */}

            <label
              htmlFor="resume-upload"
              className="block cursor-pointer"
            >

              <div className="border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-10 text-center bg-purple-500/[0.03] hover:bg-purple-500/[0.06] transition">

                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/20 flex items-center justify-center text-4xl mb-6">

                  📄

                </div>

                <h2 className="text-xl font-semibold">

                  {selectedFile
                    ? "Resume selected"
                    : "Upload your resume"}

                </h2>

                <p className="text-slate-500 text-sm mt-2">

                  {selectedFile
                    ? "Click to choose another file"
                    : "Click here to browse your files"}

                </p>

                <div className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-300 text-sm">

                  Browse Resume

                </div>

              </div>

            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Selected file */}

            {selectedFile && (

              <div className="mt-5 p-4 rounded-xl bg-slate-900/70 border border-white/10 flex items-center gap-4">

                <div className="w-11 h-11 rounded-lg bg-red-500/10 flex items-center justify-center">
                  📄
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-medium text-white truncate">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                </div>

                <span className="text-emerald-400 text-sm">
                  ✓ Ready
                </span>

              </div>

            )}

            {/* Error */}

            {error && (

              <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>

            )}

            {/* Success */}

            {message && (

              <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {message}
              </div>

            )}

            {/* Upload button */}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 font-semibold shadow-lg shadow-purple-600/20 transition"
            >

              {loading
                ? "Analyzing Resume..."
                : "Upload & Generate Portfolio →"}

            </button>

          </div>

          {/* Process */}

          <div className="mt-8 grid grid-cols-3 gap-3">

            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">

              <div className="text-lg mb-2">
                📤
              </div>

              <p className="text-xs text-slate-400">
                Upload
              </p>

            </div>

            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">

              <div className="text-lg mb-2">
                ⚙️
              </div>

              <p className="text-xs text-slate-400">
                Analyze
              </p>

            </div>

            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">

              <div className="text-lg mb-2">
                ✨
              </div>

              <p className="text-xs text-slate-400">
                Portfolio
              </p>

            </div>

          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Smart Resume Analyzer • Resume to Portfolio Generator
          </p>

        </div>

      </div>

    </div>
  );
};

export default UploadResume;