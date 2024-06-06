const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    path: { type: String, required: true, unique: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("gallery_imgs", gallerySchema);
