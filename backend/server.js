const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

// New API route
app.get("/api/message", (req, res) => {
  res.send("Frontend and Backend Connected Successfully!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});