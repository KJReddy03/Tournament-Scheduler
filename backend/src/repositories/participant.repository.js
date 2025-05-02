const Participant = require("../models/Participant.model");

async function findByUserAndTournament(userId, tournamentId) {
  return await Participant.findOne({ userId, tournamentId });
}

async function joinTournament(data) {
  const participant = new Participant(data);
  return await participant.save();
}

async function updateParticipant(id, data) {
  return await Participant.findByIdAndUpdate(data, { id });
}

async function findByTournament(tournamentId) {
  return await Participant.find({
    tournamentId,
  });
}

module.exports = {
  findByUserAndTournament,
  joinTournament,
  updateParticipant,
  findByTournament,
};
