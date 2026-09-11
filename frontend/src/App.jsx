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
import Portfolio from "./pages/Portfolio";
import PortfolioEditor from "./pages/PortfolioEditor";
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