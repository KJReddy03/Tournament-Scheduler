const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const {
  Team,
  User,
  TeamUser,
  Participant,
  Tournament,
} = require("../config/db.config");
const {
  createTeam,
  getTeam,
  joinTournamentAsTeam,
} = require("../controllers/team.controller");
const { Op } = require("sequelize");

router.use(auth);

router.post("/", createTeam);
router.post("/:teamId/join-tournament/:tournamentId", joinTournamentAsTeam);

router.post("/", auth, async (req, res) => {
  try {
    const { name, userIds = [] } = req.body;
    const captainId = req.user.id;

    // Create team
    const team = await Team.create({ name, captainId });

    // Add members (including captain)
    const members = [...new Set([captainId, ...userIds])];
    await TeamUser.bulkCreate(
      members.map((userId) => ({ teamId: team.id, userId }))
    );

    // Fetch the complete team with associations
    const createdTeam = await Team.findByPk(team.id, {
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
      ],
    });

    res.status(201).json(createdTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { captainId: req.user.id },
      include: [
        {
          model: User,
          as: "captain",
          attributes: ["id", "username"],
        },
        {
          model: User,
          through: { attributes: [] },
        },
      ],
    });
    res.json(teams);
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ message: "Failed to fetch user teams" });
  }
});

router.get("/user/my-teams", auth, async (req, res) => {
  try {
    // Find teams where user is either captain or member
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
    res.status(500).json({ message: "Failed to fetch user teams" });
  }
});

router.get("/:id", auth, async (req, res) => {
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
          through: { attributes: [] }, // Hide join table attributes
        },
        {
          model: Participant,
          include: [
            {
              model: Tournament,
              attributes: ["id", "name", "game", "startDate"],
            },
          ],
        },
      ],
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Transform the data for easier frontend consumption
    const responseData = {
      id: team.id,
      name: team.name,
      captainId: team.captainId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      captain: team.captain,
      members: team.members,
      participants: team.Participants.map((p) => ({
        id: p.id,
        status: p.status,
        score: p.score,
        tournament: p.Tournament,
      })),
    };

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team details",
      error: error.message,
    });
  }
});

router.get("/:id", getTeam);
router.put("/:id", auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.captainId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team captain can update the team" });
    }

    const updated = await team.update(req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/members", async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.captainId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team captain can add members" });
    }

    const { userIds } = req.body;

    // Add new members
    await TeamUser.bulkCreate(
      userIds.map((userId) => ({ teamId: team.id, userId }))
    );

    // Fetch the updated team with all associations
    const updatedTeam = await Team.findByPk(team.id, {
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
              attributes: ["id", "name", "game", "startDate"],
            },
          ],
        },
      ],
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error("Error adding team members:", error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.captainId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team captain can disband the team" });
    }

    await team.destroy();
    res.json({ message: "Team disbanded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:teamId/members/:userId", auth, async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    // Verify team exists and user is captain
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.captainId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only team captain can remove members" });
    }

    // Cannot remove captain
    if (userId == team.captainId) {
      return res.status(400).json({ message: "Cannot remove team captain" });
    }

    // Remove member from team
    await TeamUser.destroy({
      where: {
        teamId,
        userId,
      },
    });

    res.json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing team member:", error);
    res.status(500).json({ message: "Failed to remove team member" });
  }
});

module.exports = router;
