const { Participant } = require("../config/db.config");

async function findByUserAndTournament(userId, tournamentId) {
  return await Participant.findOne({
    where: { userId, tournamentId },
  });
}

async function joinTournament(data) {
  return await Participant.create(data);
}

async function updateParticipant(id, data) {
  return await Participant.update(data, { where: { id } });
}

async function findByTournament(tournamentId) {
  return await Participant.findAll({
    where: { tournamentId },
  });
}

module.exports = {
  findByUserAndTournament,
  joinTournament,
  updateParticipant,
  findByTournament,
};
