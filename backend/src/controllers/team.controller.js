const {
  User,
  Team,
  TeamUser,
  Participant,
  Tournament,
} = require("../config/db.config");
const { Op } = require("sequelize");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, userIds } = req.body;
    const captainId = req.user.id;

    // Create team
    const team = await Team.create({ name, captainId });

    // Add team members (including captain)
    const members = [...new Set([captainId, ...userIds])];
    await Promise.all(
      members.map((userId) => TeamUser.create({ teamId: team.id, userId }))
    );

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// backend/src/controllers/team.controller.js

const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: User,
          as: "captain",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "members",
          attributes: ["id", "username", "email"],
          through: { attributes: [] },
          where: { id: req.user.id },
        },
      ],
      where: {
        [Op.or]: [{ captainId: req.user.id }, { "$members.id$": req.user.id }],
      },
      distinct: true,
    });

    res.json(teams);
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get team details
const getTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "captain",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "members",
          attributes: ["id", "username", "email"],
          through: { attributes: [] },
        },
        {
          model: Participant,
          include: [
            {
              model: Tournament,
              attributes: ["id", "name", "game"],
            },
          ],
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: error.message });
  }
};

// Join tournament as a team
const joinTournamentAsTeam = async (req, res) => {
  console.log("Starting team tournament join process");
  try {
    const { teamId, tournamentId } = req.params;
    const userId = req.user.id;

    // 1. Verify team exists
    const team = await Team.findByPk(teamId, {
      include: [{ model: User, as: "captain" }],
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 2. Verify user is captain

    if (team.captain.id !== userId) {
      return res
        .status(403)
        .json({ message: "Only team captain can register team" });
    }

    // 3. Verify tournament exists
    const tournament = await Tournament.findByPk(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // 4. Check tournament capacity
    const participantCount = await Participant.count({
      where: { tournamentId },
    });

    if (participantCount >= tournament.maxParticipants) {
      return res.status(400).json({ message: "Tournament is full" });
    }

    // 5. Check for existing participation
    const existing = await Participant.findOne({
      where: {
        [Op.or]: [
          { teamId, tournamentId },
          { userId: team.captain.id, tournamentId },
        ],
      },
    });
    console.log("Existing participation check:", existing);
    if (existing) {
      return res
        .status(400)
        .json({ message: "Team or captain already registered" });
    }

    // 6. Create participant record

    const participant = await Participant.create({
      tournamentId,
      teamId,
      userId: team.captain.id,
      status: "registered",
      score: 0,
    });

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({
      message: "Failed to join tournament",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = {
  createTeam,
  getTeam,
  joinTournamentAsTeam,
  getMyTeams,
};
