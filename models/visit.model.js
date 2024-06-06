const mongoose = require("mongoose");

const visitsSchema = new mongoose.Schema({
  visits: { type: Number, default: 0 },
});

module.exports = mongoose.model("visits", visitsSchema);
