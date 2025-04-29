const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define("Team", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    captainId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Team.associate = (models) => {
    Team.belongsTo(models.User, {
      as: "captain",
      foreignKey: "captainId",
    });
    Team.belongsToMany(models.User, {
      through: "TeamUser",
      as: "members",
      foreignKey: "teamId",
    });
  };

  return Team;
};
