const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    redirect: true,
  },
  email: {
    type: String,
    redirect: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "NORMAL",
  },
  password: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
