const mongoose = require("mongoose");

const msgsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    msg: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", msgsSchema);
