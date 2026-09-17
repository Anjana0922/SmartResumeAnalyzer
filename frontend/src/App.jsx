import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import CreateResume from "./pages/CreateResume";
import ResumePreview from "./pages/ResumePreview";
import ResumeTemplates from "./pages/ResumeTemplates";
import MyResumes from "./pages/MyResumes";
import Portfolio from "./pages/Portfolio";
import PortfolioEditor from "./pages/PortfolioEditor";
import PortfolioDataReview from "./pages/PortfolioDataReview";
import TemplateSelection from "./components/portfolio/TemplateSelection";

function App() {
  return (
    <Routes>

      {/* ==================================================
          HOME
      ================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* ==================================================
          AUTHENTICATION
      ================================================== */}

      <Route
        path="/auth"
        element={<Auth />}
      />

      <Route
        path="/login"
        element={<Auth />}
      />


      <Route
        path="/dashboard"
         element={<Dashboard />}
      />

      {/* ==================================================
          RESUME UPLOAD & CREATION
      ================================================== */}

      <Route
        path="/upload"
        element={<UploadResume />}
      />

      <Route
        path="/resume/create"
        element={<CreateResume />}
      />

      <Route
        path="/resume/edit/:resumeId"
        element={<CreateResume />}
      />

      <Route
        path="/resume/preview/:resumeId"
        element={<ResumePreview />}
      />

      <Route
        path="/resume/templates/:resumeId"
        element={<ResumeTemplates />}
      />

      <Route
        path="/my-resumes"
        element={<MyResumes />}
      />

      {/* ==================================================
          PORTFOLIO DATA REVIEW
      ================================================== */}

      <Route
        path="/portfolio/review/:resumeId"
        element={<PortfolioDataReview />}
      />

      {/* ==================================================
          TEMPLATE SELECTION / PORTFOLIO CREATION
      ================================================== */}

      <Route
        path="/portfolio/create/:resumeId"
        element={<TemplateSelection />}
      />

      {/* ==================================================
          PORTFOLIO EDITOR
      ================================================== */}

      <Route
        path="/portfolio/:portfolioId/edit"
        element={<PortfolioEditor />}
      />

      {/* ==================================================
          SAVED PORTFOLIO VIEW
      ================================================== */}

      <Route
        path="/portfolio/:portfolioId"
        element={<Portfolio />}
      />

      <Route
        path="/portfolio/view/:portfolioId"
        element={<Portfolio />}
      />

      {/* ==================================================
          FALLBACK
      ================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;