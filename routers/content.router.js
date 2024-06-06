const router = require("express").Router();
const path = require("path");
const fs = require("fs");

// GET index page
router.get("/content", async (req, res) => {
  try {
    res.render("admin/content/content");
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// API endpoint to get localization data
router.get("/locales", (req, res) => {
  const enFilePath = path.join(__dirname, "..", "locales", "en.json");
  const arFilePath = path.join(__dirname, "..", "locales", "ar.json");

  fs.readFile(enFilePath, "utf8", (err, enData) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Could not read English localization file" });
    }

    fs.readFile(arFilePath, "utf8", (err, arData) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Could not read Arabic localization file" });
      }

      res.json({
        en: JSON.parse(enData),
        ar: JSON.parse(arData),
      });
    });
  });
});
module.exports = router;
