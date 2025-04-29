const tournamentService = require("../services/tournament.service");
const { Tournament } = require("../config/db.config");

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
    const { name, game, startDate, endDate, maxParticipants } = req.body;

    console.log("BODY RECEIVED:", req.body);

    const gameImageMap = {
      Valorant: "/images/Valorant.jpg",
      CSGO: "/images/CSGO.jpg",
      FIFA: "/images/FIFA.jpg",
      "Dota 2": "/images/Dota2.jpg",
      BGMI: "/images/BGMI.jpg",
      FallGuys: "/images/Fall_guys.jpg",
      "Free Fire": "/images/Free_fire.jpg",
      "Pubg PC": "/images/Pubg.jpg",
      "Apex Legends": "/images/Apex.jpg",
      "Call of Duty": "/images/CallOfDuty.jpg",
      "League of Legends": "/images/League.jpg",
      "Rocket League": "/images/Rocket.jpg",
      "Clash Royale": "/images/ClashRoyale.jpg",
      "Clash of Clans": "/images/ClashOfClans.jpg",
      Fortnite: "/images/Fortnite.jpg",
      Brawlhalla: "/images/Brawlhalla.jpg",
    };

    const imagePath = gameImageMap[game] || "/images/default.jpg";

    const newTournament = await Tournament.create({
      name,
      game,
      startDate,
      endDate,
      maxParticipants,
      image: imagePath,
      creatorId: req.user?.id || null,
    });

    res.status(201).json(newTournament);
  } catch (error) {
    console.error("Create Tournament Error:", error);
    res.status(500).json({ message: "Failed to create tournament" });
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

const getTournamentTeams = async (req, res) => {
  try {
    const participants = await Participant.findAll({
      where: {
        tournamentId: req.params.id,
        teamId: { [Sequelize.Op.not]: null },
      },
      include: [Team],
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  getTournamentParticipants,
  createTournament,
  joinTournament,
  updateParticipantResults,
  getTournamentTeams,
};
