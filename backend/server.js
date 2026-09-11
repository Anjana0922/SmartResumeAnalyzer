require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Test API
app.get("/api/message", (req, res) => {
  res.send("Frontend and Backend Connected Successfully!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});