const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournament.controller");
const { adminAuth } = require("../middleware/auth.middleware");

// Public routes
router.get("/", tournamentController.getAllTournaments);
router.get("/:id", tournamentController.getTournamentById);
router.get("/:id/participants", tournamentController.getTournamentParticipants);

// Protected routes
router.use(require("../middleware/auth.middleware").auth);

router.post("/", tournamentController.createTournament);
router.post("/:id/join", tournamentController.joinTournament);

// Admin-only routes
router.put(
  "/:id/participants/:participantId",
  adminAuth,
  tournamentController.updateParticipantResults
);

module.exports = router;
