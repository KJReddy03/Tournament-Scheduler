const Tournament = require("../models/Tournament.model");
const Participant = require("../models/Participant.model");

exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    const tournamentsWithCounts = await Promise.all(
      tournaments.map(async (t) => {
        const count = await Participant.countDocuments({ tournamentId: t._id });
        return { ...t.toObject(), id: t._id, participantCount: count };
      })
    );
    res.json(tournamentsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).lean();
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    const participants = await Participant.find({ tournamentId: req.params.id })
      .populate({
        path: "teamId",
        populate: { path: "captainId", select: "id username email" },
      })
      .populate({ path: "userId", select: "id username email" });

    res.json({ ...tournament, participants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTournamentParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({
      tournamentId: req.params.id,
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTournament = async (req, res) => {
  try {
    const { name, game, startDate, endDate, maxParticipants } = req.body;
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

    const newTournament = new Tournament({
      name,
      game,
      startDate,
      endDate,
      maxParticipants,
      image: imagePath,
      creatorId: req.user?.id || null,
    });
    await newTournament.save();
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(500).json({ message: "Failed to create tournament" });
  }
};

exports.joinTournament = async (req, res) => {
  try {
    const userId = req.user.id;
    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    const participantCount = await Participant.countDocuments({ tournamentId });
    if (participantCount >= tournament.maxParticipants)
      return res.status(400).json({ message: "Tournament is full" });

    const existing = await Participant.findOne({ userId, tournamentId });
    if (existing)
      return res.status(400).json({ message: "Already registered" });

    const participant = new Participant({ userId, tournamentId });
    await participant.save();
    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateParticipantResults = async (req, res) => {
  try {
    const updated = await Participant.findByIdAndUpdate(
      req.params.participantId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTournamentTeams = async (req, res) => {
  try {
    const participants = await Participant.find({
      tournamentId: req.params.id,
      teamId: { $ne: null },
    }).populate("teamId");
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
