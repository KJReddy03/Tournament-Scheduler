const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Participant = sequelize.define("Participant", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    tournamentId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("registered", "active", "eliminated", "winner"),
      defaultValue: "registered",
    },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  return Participant;
};
