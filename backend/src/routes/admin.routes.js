const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const {
  getAllUsers,
  deleteUser,
  deleteTournament,
} = require("../controllers/admin.controller");

// Admin routes
router.get("/users", adminAuth, getAllUsers);
router.delete("/users/:id", adminAuth, deleteUser);
router.delete("/tournaments/:id", adminAuth, deleteTournament);

module.exports = router;
