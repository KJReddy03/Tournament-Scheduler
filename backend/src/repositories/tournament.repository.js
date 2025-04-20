const { Tournament, Participant } = require("../config/db.config");

class TournamentRepository {
  async findAll() {
    return await Tournament.findAll();
  }

  async findById(id) {
    return await Tournament.findByPk(id, {
      include: [Participant],
    });
  }

  async create(tournamentData) {
    return await Tournament.create(tournamentData);
  }

  async update(id, tournamentData) {
    return await Tournament.update(tournamentData, { where: { id } });
  }

  async delete(id) {
    return await Tournament.destroy({ where: { id } });
  }

  async findByCreator(creatorId) {
    return await Tournament.findAll({ where: { creatorId } });
  }
}

module.exports = new TournamentRepository();
