const User = require("../models/user.model");
const Tournament = require("../models/Tournament.model");
const Participant = require("../models/Participant.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "id username email role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user._id.toString() === req.user.id)
      return res.status(403).json({ message: "Cannot delete yourself" });
    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot delete admin users" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });
    await Participant.deleteMany({ tournamentId: tournament._id });
    await tournament.deleteOne();
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant)
      return res.status(404).json({ message: "Participant not found" });
    await participant.deleteOne();
    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!participant)
      return res.status(404).json({ message: "Participant not found" });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  deleteParticipant,
  updateParticipant,
  deleteTournament,
};
