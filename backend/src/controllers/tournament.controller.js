const express = require("express");
const router = express.Router();
const tournamentService = require("../services/tournament.service");
const { auth } = require("../middleware/auth.middleware");

// Public routes
router.get("/", async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/participants", async (req, res) => {
  try {
    const participants = await tournamentService.getTournamentParticipants(
      req.params.id
    );
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected routes
router.use(auth);

router.post("/", async (req, res) => {
  try {
    const tournament = await tournamentService.createTournament({
      ...req.body,
      creatorId: req.user.id,
    });
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/join", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID missing from token" });
    }

    const result = await tournamentService.joinTournament(
      req.user.id,
      req.params.id
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("🔥 Join tournament error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id/participants/:participantId", async (req, res) => {
  try {
    const result = await tournamentService.updateParticipantResults(
      req.params.participantId,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
