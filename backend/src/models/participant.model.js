const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  status: {
    type: String,
    enum: ["registered", "active", "eliminated", "winner"],
    default: "registered",
  },
  score: { type: Number, default: 0 },
});

participantSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Participant", participantSchema);
