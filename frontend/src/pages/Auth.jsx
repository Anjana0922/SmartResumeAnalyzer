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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-purple-100/60 rounded-full blur-[120px] pointer-events-none" />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="hidden lg:block px-8">

          <div className="mb-8">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Profile Builder
            </div>

            <h1 className="text-5xl font-bold leading-tight text-slate-900">
              Create, improve, and present your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                {" "}professional profile.
              </span>
            </h1>

            <p className="text-slate-600 text-lg mt-6 max-w-lg leading-relaxed">
              Build your resume, check its ATS compatibility, improve it,
              and turn it into a professional portfolio.
            </p>

          </div>

          {/* Features */}
          <div className="space-y-4">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg">
                📄
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Smart Resume Parsing
                </h3>

                <p className="text-sm text-slate-500">
                  Extract education, skills, projects and more.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg">
                🎨
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Professional Portfolio
                </h3>

                <p className="text-sm text-slate-500">
                  Generate a clean portfolio from your resume.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg">
                ✏️
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
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

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">

            {/* Header */}
            <div className="text-center mb-8">

              <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-2xl text-white shadow-lg shadow-indigo-600/20">
                ✦
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                {isLogin
                  ? "Login to Profile Builder"
                  : "Create your account"}
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                {isLogin
                  ? "Enter your email and password to access your account"
                  : "Sign up to start building your resume and portfolio"}
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

                  <label className="text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Anjana M"
                    required
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition"
                  />

                </div>
              )}

              {/* Email */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition"
                />

              </div>

              {/* Phone */}
              {!isLogin && (
                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition"
                  />

                </div>
              )}

              {/* Category */}
              {!isLogin && (
                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    name="user_category"
                    value={formData.user_category}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition cursor-pointer"
                  >
                    <option value="Student">
                      Student
                    </option>
                    <option value="Job Seeker">
                      Job Seeker
                    </option>
                  </select>

                </div>
              )}

              {/* Password */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition"
                />

              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 font-semibold shadow-md shadow-indigo-200 transition cursor-pointer"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>

            </form>

            {/* Switch */}
            <div className="text-center mt-7 pt-6 border-t border-slate-100">

              <p className="text-sm text-slate-500">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-2 text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                >
                  {isLogin
                    ? "Sign Up"
                    : "Login"}
                </button>
              </p>

            </div>

          </div>

          <p className="text-center text-xs text-slate-500 mt-5">
            Profile Builder • Professional Profile Platform
          </p>

        </div>

      </div>

    </div>
  );
};

export default Auth;