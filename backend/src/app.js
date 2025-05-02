const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");
const tournamentRoutes = require("./routes/tournament.routes");
const adminRoutes = require("./routes/admin.routes");
const teamRoutes = require("./routes/team.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);

module.exports = app;
