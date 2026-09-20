require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const atsRoutes = require("./routes/atsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/ats", atsRoutes);

// Test API
app.get("/api/message", (req, res) => {
  res.send("Frontend and Backend Connected Successfully!");
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("SERVER ERROR:", err);
});

server.on("close", () => {
  console.log("SERVER CLOSED");
});