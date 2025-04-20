const tournamentRepo = require("../repositories/tournament.repository");
const participantRepo = require("../repositories/participant.repository");
const { Tournament, Participant, User } = require("../config/db.config");

class TournamentService {
  async getAllTournaments() {
    const tournaments = await tournamentRepo.findAll();

    const enriched = await Promise.all(
      tournaments.map(async (tournament) => {
        const participantCount = await Participant.count({
          where: { tournamentId: tournament.id },
        });

        return {
          ...tournament.dataValues,
          participantCount,
        };
      })
    );

    return enriched;
  }

  async getTournamentById(id) {
    const tournament = await Tournament.findByPk(id, {
      include: [
        {
          model: Participant,
          include: [
            {
              model: User,
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    if (!tournament) return null;

    const participantCount = await Participant.count({
      where: { tournamentId: id },
    });

    return {
      ...tournament.dataValues,
      participantCount,
    };
  }

  async createTournament(tournamentData) {
    return await tournamentRepo.create(tournamentData);
  }

  async updateTournament(id, tournamentData) {
    return await tournamentRepo.update(id, tournamentData);
  }

  async deleteTournament(id) {
    return await tournamentRepo.delete(id);
  }

  async joinTournament(userId, tournamentId) {
    const tournament = await tournamentRepo.findById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    const currentCount = await Participant.count({ where: { tournamentId } });

    if (currentCount >= tournament.maxParticipants) {
      throw new Error("Tournament is full");
    }

    const existing = await participantRepo.findByUserAndTournament(
      userId,
      tournamentId
    );
    if (existing) throw new Error("Already joined this tournament");

    return await participantRepo.joinTournament({
      userId,
      tournamentId,
      status: "registered",
    });
  }

  async updateParticipantResults(participantId, updateData) {
    return await participantRepo.updateParticipant(participantId, updateData);
  }

  async getTournamentParticipants(tournamentId) {
    return await participantRepo.findByTournament(tournamentId);
  }
}

module.exports = new TournamentService();
