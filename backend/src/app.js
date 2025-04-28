const express = require("express");
const path = require("path");
const cors = require("cors");
const { sequelize } = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");
const tournamentRoutes = require("./routes/tournament.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

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
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);

// Database sync
sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Database synced successfully");
});

module.exports = app;
