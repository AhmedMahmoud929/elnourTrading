const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    cover: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("news", newsSchema);
