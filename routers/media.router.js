const router = require("express").Router();
const path = require("path");
const fs = require("fs");

// GET index page
router.get("/media", async (req, res) => {
  try {
    res.render("admin/media/media");
  } catch (err) {
    res.send("Internal Server Error");
  }
});

module.exports = router;
