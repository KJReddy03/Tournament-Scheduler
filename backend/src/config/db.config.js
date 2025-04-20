const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "tournament_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// Inject sequelize into each model
const UserModel = require("../models/user.model");
const TournamentModel = require("../models/tournament.model");
const ParticipantModel = require("../models/participant.model");

const User = UserModel(sequelize);
const Tournament = TournamentModel(sequelize);
const Participant = ParticipantModel(sequelize);

// Define associations
Tournament.hasMany(Participant, { foreignKey: "tournamentId" });
Participant.belongsTo(Tournament, { foreignKey: "tournamentId" });

Participant.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Participant, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Tournament,
  Participant,
};
