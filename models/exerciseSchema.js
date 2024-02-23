const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true},
});

module.exports = mongoose.model("Exercise", exerciseSchema);
