const { User, Tournament, Participant } = require("../config/db.config");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is trying to delete themselves
    if (user.id === req.user.id) {
      return res.status(403).json({ message: "Cannot delete yourself" });
    }

    // Prevent deleting admin users
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Tournament
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Delete associated participants first
    await Participant.destroy({ where: { tournamentId: tournament.id } });

    await tournament.destroy();
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a participant
const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    await participant.destroy();
    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update participant results (admin version)
const updateParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    await participant.update(req.body);
    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  deleteParticipant,
  updateParticipant: updateParticipant,
  deleteTournament,
};
