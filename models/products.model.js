const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    desc: { type: String, required: true },
    descAr: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productsSchema);
