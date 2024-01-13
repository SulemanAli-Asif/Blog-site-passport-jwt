const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  googleId: { type: String, unique: true, sparse:true },
});

module.exports = mongoose.model("User", userSchema);
