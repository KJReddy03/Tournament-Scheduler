const Tournament = require("../models/Tournament.model");
const Participant = require("../models/Participant.model");

class TournamentRepository {
  // Get all tournaments
  async findAll() {
    return await Tournament.find({});
  }

  // Get tournament by ID with participants, teams, captains, and users
  async findById(id) {
    const tournament = await Tournament.findById(id).lean();

    if (!tournament) return null;

    const participants = await Participant.find({ tournamentId: id })
      .populate({
        path: "teamId",
        populate: {
          path: "captainId",
          select: "id username email",
        },
      })
      .populate({
        path: "userId",
        select: "id username email",
      });

    return {
      ...tournament,
      participants,
    };
  }

  // Create tournament
  async create(tournamentData) {
    const tournament = new Tournament(tournamentData);
    return await tournament.save();
  }

  // Update tournament by ID
  async update(id, tournamentData) {
    return await Tournament.findByIdAndUpdate(id, tournamentData, {
      new: true,
    });
  }

  // Delete tournament by ID
  async delete(id) {
    return await Tournament.findByIdAndDelete(id);
  }

  // Find tournaments by creator
  async findByCreator(creatorId) {
    return await Tournament.find({ creatorId });
  }
}

module.exports = new TournamentRepository();
