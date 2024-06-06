const Visit = require("../models/visit.model");

module.exports = async (req, res, next) => {
  const path = req.path;
  if (!path.includes("dashboard")) {
    const visit = await Visit.findOneAndUpdate(
      {},
      { $inc: { visits: 1 } },
      { new: true, upsert: true }
    );
  }
  next();
};
