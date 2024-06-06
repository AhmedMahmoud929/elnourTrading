const mongoose = require("mongoose");

const brochureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    file: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("brochure", brochureSchema);
