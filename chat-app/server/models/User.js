const mongoose = require("mongoose");

const userSchema = new mongoose.PSchema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
});

module.exports = mongoose.model("User", userSchema);
