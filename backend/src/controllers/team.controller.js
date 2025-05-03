const Team = require("../models/team.model");
const Tournament = require("../models/Tournament.model");
const Participant = require("../models/Participant.model");
const TeamUser = require("../models/teamUser.model");

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, userIds = [] } = req.body;
    const captainId = req.user.id;

    const team = new Team({
      name,
      captainId,
      members: [...new Set([captainId, ...userIds])],
    });

    await team.save();

    // Create TeamUser mappings
    const teamUserDocs = [...new Set([captainId, ...userIds])].map(
      (userId) => ({
        teamId: team._id,
        userId,
      })
    );
    await TeamUser.insertMany(teamUserDocs);

    const populated = await Team.findById(team._id)
      .populate("captainId", "id username email")
      .populate("members", "id username email");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await Team.find({
      $or: [{ captainId: userId }, { members: userId }],
    })
      .populate("captainId", "id username email")
      .populate("members", "id username email");

    res.json(
      teams.map((t) => ({ ...t.toObject(), id: t._id, captain: t.captainId }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("captainId", "id username email")
      .populate("members", "id username email")
      .lean();

    if (!team) return res.status(404).json({ message: "Team not found" });

    const participants = await Participant.find({ teamId: team._id }).populate(
      "tournamentId",
      "id name game startDate"
    );

    res.json({
      success: true,
      data: {
        ...team,
        id: team._id,
        captain: team.captainId,
        captainId: team.captainId?._id,
        participants: participants.map((p) => ({
          id: p._id,
          status: p.status,
          score: p.score,
          tournament: p.tournamentId,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.joinTournamentAsTeam = async (req, res) => {
  try {
    const { teamId, tournamentId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId).populate("captainId");
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.captainId._id.toString() !== userId)
      return res
        .status(403)
        .json({ message: "Only team captain can register team" });

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    const participantCount = await Participant.countDocuments({ tournamentId });
    if (participantCount >= tournament.maxParticipants)
      return res.status(400).json({ message: "Tournament is full" });

    const existing = await Participant.findOne({
      $or: [
        { teamId, tournamentId },
        { userId: team.captainId._id, tournamentId },
      ],
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "Team or captain already registered" });

    const participant = new Participant({
      tournamentId,
      teamId,
      userId: team.captainId._id,
      status: "registered",
      score: 0,
    });

    await participant.save();
    res.status(201).json(participant);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to join tournament", error: error.message });
  }
};

exports.addTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.captainId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Only the team captain can add members" });

    const { userIds } = req.body;
    const currentMembers = new Set(team.members.map((id) => id.toString()));
    const newMembers = userIds.filter((id) => !currentMembers.has(id));

    team.members.push(...newMembers);
    await team.save();

    // Create new TeamUser entries
    const teamUserDocs = newMembers.map((userId) => ({
      teamId: team._id,
      userId,
    }));
    await TeamUser.insertMany(teamUserDocs);

    const updatedTeam = await Team.findById(team._id)
      .populate("captainId", "id username email")
      .populate("members", "id username email");

    res.json(updatedTeam);
  } catch (error) {
    console.error("Error adding team members:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.captainId.toString() !== req.user.id)
      return res.status(403).json({ message: "Only captain can update team" });

    team.name = req.body.name;
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.disbandTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.captainId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Only the captain can disband team" });

    await Participant.deleteMany({ teamId: team._id });
    await TeamUser.deleteMany({ teamId: team._id }); // ✅ Clean up TeamUser
    await team.deleteOne();

    res.json({ message: "Team disbanded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeTeamMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.captainId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Only captain can remove members" });
    if (userId === team.captainId.toString())
      return res.status(400).json({ message: "Cannot remove captain" });

    team.members = team.members.filter((id) => id.toString() !== userId);
    await team.save();

    await TeamUser.deleteOne({ teamId, userId });

    res.json({ success: true, message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
