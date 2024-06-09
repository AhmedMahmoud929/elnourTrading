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

router.post("/locales", (req, res) => {
  const enFilePath = path.join(__dirname, "..", "locales", "en.json");
  const arFilePath = path.join(__dirname, "..", "locales", "ar.json");
  const { key, en, ar } = req.body;

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
      enData = JSON.parse(enData);
      arData = JSON.parse(arData);
      const keyItems = key.split("#");
      if (keyItems.length == 3) {
        enData[keyItems[0]][keyItems[1]][keyItems[2]] = en;
        arData[keyItems[0]][keyItems[1]][keyItems[2]] = ar;
      } else {
        enData[keyItems[0]][keyItems[1]] = en;
        arData[keyItems[0]][keyItems[1]] = ar;
      }
      // Update the json files

      fs.writeFile(
        enFilePath,
        JSON.stringify(enData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res.status(500).json({ error: "" });
          }
          fs.writeFile(
            arFilePath,
            JSON.stringify(arData, null, 2),
            "utf8",
            (err) => {
              if (err) {
                return res.status(500).json({
                  error: "Could not write localization file"
                });
              }

              res.redirect("/dashboard/content");
            }
          );
        }
      );
    });
  });
});

module.exports = router;
