const express = require("express");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/task", dashboardRoutes);

module.exports = app;
