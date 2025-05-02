const Team = require("../models/team.model");

class TeamRepository {
  async create({ name, captainId, userIds }) {
    const team = new Team({
      name,
      captainId,
      members: [...new Set([captainId, ...userIds])],
    });
    return await team.save();
  }

  async findById(id) {
    return await Team.findById(id)
      .populate("captain", "id username email")
      .populate("members", "id username email");
  }

  async findByUser(userId) {
    return await Team.find({
      $or: [{ captainId: userId }, { members: userId }],
    }).populate("captain members", "id username email");
  }
}

module.exports = new TeamRepository();
