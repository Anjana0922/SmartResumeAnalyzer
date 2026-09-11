import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    user_category: "Student",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:5000/users/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        console.log("Login response:", response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setMessage("Login successful!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        const response = await axios.post(
          "http://localhost:5000/users/",
          {
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            user_category: formData.user_category,
          }
        );

        console.log("Register response:", response.data);

        setMessage(
          "Account created successfully! Please login."
        );

        setIsLogin(true);

        setFormData({
          full_name: "",
          email: "",
          password: "",
          phone: "",
          user_category: "Student",
        });
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data.message ||
            err.response.data.error ||
            "Something went wrong."
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

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setError("");

    setFormData({
      full_name: "",
      email: "",
      password: "",
      phone: "",
      user_category: "Student",
    });
  };

  return (
    <div className="min-h-screen bg-[#08070d] text-white flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Background glow */}

      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />

      {/* Main container */}

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}

        <div className="hidden lg:block px-8">

          <div className="mb-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Resume → Portfolio
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Turn your resume into a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500">
                {" "}professional portfolio.
              </span>
            </h1>

            <p className="text-slate-400 text-lg mt-6 max-w-lg leading-relaxed">
              Smart Resume Analyzer extracts your resume
              information and transforms it into a structured,
              editable professional portfolio.
            </p>

          </div>

          {/* Features */}

          <div className="space-y-4">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                📄
              </div>

              <div>
                <h3 className="font-semibold">
                  Smart Resume Parsing
                </h3>

                <p className="text-sm text-slate-500">
                  Extract education, skills, projects and more.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                🎨
              </div>

              <div>
                <h3 className="font-semibold">
                  Professional Portfolio
                </h3>

                <p className="text-sm text-slate-500">
                  Generate a clean portfolio from your resume.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                ✏️
              </div>

              <div>
                <h3 className="font-semibold">
                  Fully Editable
                </h3>

                <p className="text-sm text-slate-500">
                  Customize your portfolio before publishing.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full max-w-md mx-auto">

          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            {/* Header */}

            <div className="text-center mb-8">

              <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                ✦
              </div>

              <h2 className="text-2xl font-bold">
                {isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                {isLogin
                  ? "Login to continue building your portfolio"
                  : "Start creating your professional portfolio"}
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Full name */}

              {!isLogin && (
                <div>

                  <label className="text-sm text-slate-400">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Anjana M"
                    required
                    className="mt-2 w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                  />

                </div>
              )}

              {/* Email */}

              <div>

                <label className="text-sm text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                />

              </div>

              {/* Phone */}

              {!isLogin && (
                <div>

                  <label className="text-sm text-slate-400">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="mt-2 w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                  />

                </div>
              )}

              {/* Category */}

              {!isLogin && (
                <div>

                  <label className="text-sm text-slate-400">
                    Category
                  </label>

                  <select
                    name="user_category"
                    value={formData.user_category}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition cursor-pointer"
                  >
                    <option value="Student" className="bg-[#11101a] text-white">
                      Student
                    </option>
                    <option value="Job Seeker" className="bg-[#11101a] text-white">
                      Job Seeker
                    </option>
                  </select>

                </div>
              )}

              {/* Password */}

              <div>

                <label className="text-sm text-slate-400">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="mt-2 w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                />

              </div>

              {/* Error */}

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Success */}

              {message && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  {message}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 font-semibold shadow-lg shadow-purple-600/20 transition"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login to Continue →"
                  : "Create Account →"}
              </button>

            </form>

            {/* Switch */}

            <div className="text-center mt-7 pt-6 border-t border-white/10">

              <p className="text-sm text-slate-500">

                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-2 text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {isLogin
                    ? "Create one"
                    : "Login"}
                </button>

              </p>

            </div>

          </div>

          <p className="text-center text-xs text-slate-600 mt-5">
            Smart Resume Analyzer • Resume to Portfolio Generator
          </p>

        </div>

      </div>

    </div>
  );
};

export default Auth;