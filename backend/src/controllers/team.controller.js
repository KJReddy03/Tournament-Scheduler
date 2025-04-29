const { User, Team, TeamUser } = require("../config/db.config");

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
  try {
    const { teamId, tournamentId } = req.params;

    // Verify team exists and user is captain
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.captainId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only team captain can register team" });
    }

    // Check if team is already registered
    const existing = await Participant.findOne({
      where: { teamId, tournamentId },
    });

    if (existing) {
      return res.status(400).json({ message: "Team already registered" });
    }

    // Create participant record for the team
    const participant = await Participant.create({
      tournamentId,
      teamId,
      status: "registered",
    });

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeam,
  getTeam,
  joinTournamentAsTeam,
  getMyTeams,
};
