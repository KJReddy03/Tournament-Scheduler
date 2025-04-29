const { Sequelize, DataTypes } = require("sequelize");

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
const TeamModel = require("../models/team.model");

const Team = TeamModel(sequelize);
const User = UserModel(sequelize);
const Tournament = TournamentModel(sequelize);
const Participant = ParticipantModel(sequelize);

// Define associations
Tournament.hasMany(Participant, { foreignKey: "tournamentId" });
Participant.belongsTo(Tournament, { foreignKey: "tournamentId" });

Participant.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Participant, { foreignKey: "userId" });

User.hasMany(Team, { foreignKey: "captainId" });

const TeamUser = sequelize.define("TeamUser", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  teamId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

// Team belongs to User as captain
Team.belongsTo(User, {
  as: "captain",
  foreignKey: "captainId",
  onDelete: "CASCADE",
});

Team.belongsToMany(User, {
  through: "TeamUser",
  as: "members",
  foreignKey: "teamId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

// Participant associations
Participant.belongsTo(Team, {
  foreignKey: "teamId",
  as: "Team",
});

Team.hasMany(Participant, {
  foreignKey: "teamId",
  as: "Participants",
});

// Team-Tournament relationship
Participant.belongsTo(Team, { foreignKey: "teamId" });
Team.hasMany(Participant, { foreignKey: "teamId" });

module.exports = {
  sequelize,
  User,
  Tournament,
  Participant,
  Team,
  TeamUser,
};
