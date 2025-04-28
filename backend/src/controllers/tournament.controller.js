const tournamentService = require("../services/tournament.service");

// GET /api/tournaments
const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tournaments/:id
const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tournaments/:id/participants
const getTournamentParticipants = async (req, res) => {
  try {
    const participants = await tournamentService.getTournamentParticipants(
      req.params.id
    );
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tournaments (Protected)
const createTournament = async (req, res) => {
  try {
    const tournamentData = {
      ...req.body,
      creatorId: req.user.id, // Make sure Tournament model has creatorId field
    };
    const tournament = await tournamentService.createTournament(tournamentData);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/tournaments/:id/join (Protected)
const joinTournament = async (req, res) => {
  try {
    const result = await tournamentService.joinTournament(
      req.user.id,
      req.params.id
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("🔥 Join tournament error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/tournaments/:id/participants/:participantId (Admin only)
const updateParticipantResults = async (req, res) => {
  try {
    const updated = await tournamentService.updateParticipantResults(
      req.params.participantId,
      req.body
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  getTournamentParticipants,
  createTournament,
  joinTournament,
  updateParticipantResults,
};
