const { Tournament, Participant, Team, User } = require("../config/db.config");

class TournamentRepository {
  async findAll() {
    return await Tournament.findAll();
  }

  async findById(id) {
    return await Tournament.findByPk(id, {
      include: [
        {
          model: Participant,
          include: [
            {
              model: Team,
              as: "Team",
              include: [
                {
                  model: User,
                  as: "captain",
                  attributes: ["id", "username", "email"],
                },
              ],
            },
            {
              model: User,
              as: "User",
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
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
