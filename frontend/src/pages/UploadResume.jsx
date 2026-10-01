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

    console.log("[UploadResume] handleUpload triggered. Selected file:", selectedFile);

    if (!selectedFile) {
      console.warn("[UploadResume] No file selected.");
      setError("Please select your resume first.");
      return;
    }

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      console.warn("[UploadResume] Failed to parse user from localStorage:", e);
    }

    const userId = user?.user_id || user?.id || 1;
    console.log("[UploadResume] Using userId:", userId, "user:", user);

    try {
      setLoading(true);

      // ==============================
      // 1. Upload Resume
      // ==============================

      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("user_id", String(userId));

      console.log("[UploadResume] Sending POST to http://localhost:5000/api/resume/upload with resume file:", selectedFile.name, "user_id:", userId);

      // Do NOT explicitly set Content-Type: multipart/form-data;
      // Axios and the browser will automatically supply it along with the multipart boundary.
      const resumeResponse = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData
      );

      console.log("[UploadResume] Resume upload response:", resumeResponse.data);

      const resumeId = resumeResponse.data.resume_id;

      if (!resumeId) {
        console.error("[UploadResume] Resume ID missing from response:", resumeResponse.data);
        setError("Resume uploaded, but resume ID was not returned.");
        return;
      }

      // Save Resume ID to localStorage
      localStorage.setItem("resume_id", resumeId);
      console.log("[UploadResume] Saved resume ID to localStorage:", resumeId);

      setMessage("Resume uploaded and parsed successfully! Redirecting to review details...");

      // Go to Portfolio Data Review for this resume
      setTimeout(() => {
        navigate(`/portfolio/review/${resumeId}`);
      }, 1000);

    } catch (err) {
      console.error("[UploadResume] Full upload error:", err);

      if (err.response) {
        console.error("[UploadResume] Server response error status:", err.response.status, "data:", err.response.data);
        setError(
          err.response.data.message ||
            err.response.data.error ||
            "Resume upload failed."
        );
      } else {
        console.error("[UploadResume] Client or network error:", err.message);
        setError(
          "Cannot connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Main container */}
      <div className="relative z-10 w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Resume Analyzer
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Upload your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {" "}resume
            </span>
          </h1>

          <p className="text-slate-600 mt-4 max-w-xl mx-auto">
            Upload your resume and we'll extract your
            education, skills, projects, certifications
            and achievements to build your portfolio.
          </p>

        </div>

        {/* Main card */}
        <div className="max-w-2xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50">

            {/* Upload area */}
            <label
              htmlFor="resume-upload"
              className="block cursor-pointer"
            >

              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-10 text-center bg-indigo-50/30 hover:bg-indigo-50/60 transition">

                <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl mb-6 shadow-sm">
                  📄
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  {selectedFile
                    ? "Resume selected"
                    : "Upload your resume"}
                </h2>

                <p className="text-slate-500 text-sm mt-2">
                  {selectedFile
                    ? "Click to choose another file"
                    : "PDF and Word (.docx) formats supported"}
                </p>

                <div className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold">
                  Browse Resume
                </div>

              </div>

            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Selected file */}
            {selectedFile && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">

                <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">
                  📄
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-medium text-slate-900 truncate">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                </div>

                <span className="text-emerald-600 font-semibold text-sm">
                  ✓ Ready
                </span>

              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                {message}
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold shadow-md shadow-indigo-200 transition cursor-pointer"
            >
              {loading
                ? "Analyzing Resume..."
                : "Upload & Generate Portfolio →"}
            </button>

          </div>

          {/* Process */}
          <div className="mt-8 grid grid-cols-3 gap-3">

            <div className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-lg mb-2">📤</div>
              <p className="text-xs font-medium text-slate-600">Upload</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-lg mb-2">⚙️</div>
              <p className="text-xs font-medium text-slate-600">Analyze</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-lg mb-2">✨</div>
              <p className="text-xs font-medium text-slate-600">Portfolio</p>
            </div>

          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Smart Resume Analyzer and Portfolio Generator
          </p>

        </div>

      </div>

    </div>
  );
};

export default UploadResume;