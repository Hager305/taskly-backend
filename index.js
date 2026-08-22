const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const path = require("path");
const dbConnect = require("./config/db-connect");
const taskRouter = require("./routes/task-routes");
const authRouter = require("./routes/auth-routes");

const app = express();

// Middleware
app.use(express.json());
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB
dbConnect();

// Routes
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/auth", authRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});