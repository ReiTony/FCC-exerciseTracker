const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  log: [
    {
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Log", logSchema);
