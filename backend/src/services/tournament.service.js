const tournamentRepo = require("../repositories/tournament.repository");
const participantRepo = require("../repositories/participant.repository");

const Tournament = require("../models/Tournament.model");
const Participant = require("../models/Participant.model");

class TournamentService {
  // Fetch all tournaments with participant counts
  async getAllTournaments() {
    const tournaments = await tournamentRepo.findAll();

    const enriched = await Promise.all(
      tournaments.map(async (tournament) => {
        const participantCount = await Participant.countDocuments({
          tournamentId: tournament._id,
        });

        return {
          ...tournament.toObject(),
          participantCount,
        };
      })
    );

    return enriched;
  }

  // Fetch a specific tournament with participants and populated refs
  async getTournamentById(id) {
    const tournament = await tournamentRepo.findById(id);
    if (!tournament) return null;

    const participantCount = await Participant.countDocuments({
      tournamentId: id,
    });

    return {
      ...tournament,
      participantCount,
    };
  }

  // Create a new tournament
  async createTournament(tournamentData) {
    return await tournamentRepo.create(tournamentData);
  }

  // Update tournament
  async updateTournament(id, tournamentData) {
    return await tournamentRepo.update(id, tournamentData);
  }

  // Delete tournament
  async deleteTournament(id) {
    return await tournamentRepo.delete(id);
  }

  // Join tournament (validating duplicates and limits)
  async joinTournament(userId, tournamentId) {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    const currentCount = await Participant.countDocuments({ tournamentId });

    if (currentCount >= tournament.maxParticipants) {
      throw new Error("Tournament is full");
    }

    const existing = await Participant.findOne({ userId, tournamentId });
    if (existing) throw new Error("Already joined this tournament");

    const participant = new Participant({
      userId,
      tournamentId,
      status: "registered",
    });

    return await participant.save();
  }

  // Update score/result for a participant
  async updateParticipantResults(participantId, updateData) {
    return await participantRepo.updateParticipant(participantId, updateData);
  }

  // Get participants of a tournament
  async getTournamentParticipants(tournamentId) {
    return await participantRepo.findByTournament(tournamentId);
  }
}

module.exports = new TournamentService();
