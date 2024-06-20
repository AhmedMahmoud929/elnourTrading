const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const New = require("../models/news.model");
const osType = os.type();

const uploadPath = path.join(__dirname, "..", "assets", "imgs", "newsImgs");

// Create the destination directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".")[0] +
        String(Date.now()) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// GET index page
router.get("/news", async (req, res) => {
  try {
    const news = (await New.find({})).reverse();
    console.log(news[0]);
    res.render("admin/news/news", { news, osType });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET publish page
router.get("/news/publish", (req, res) => {
  res.render("admin/news/publish-new");
});

// POST a new
router.post("/news/publish", upload.single("cover"), async (req, res) => {
  try {
    const { title, desc, titleAR, descAR } = req.body;
    const cover = req.file.filename;

    const basePath = path.join("..", "imgs", "newsImgs");
    const newNew = new New({
      title,
      desc,
      titleAR,
      descAR,
      cover: path.join(basePath, cover),
    });
    await newNew.save();
    res.redirect("/dashboard/news");
  } catch (err) {
    res.send("Internal server error.");
  }
});

// Delete a new
router.post("/news/delete", async (req, res) => {
  try {
    const { newId } = req.body;
    await New.findByIdAndDelete(newId);
    res.redirect("/dashboard/news");
  } catch (err) {
    res.send("Internal server error.");
  }
});

router.get("/traversal", (req, res) => {
  // Get the directory path from the query parameter 'dir'
  const dir = req.query.dir || "/tmp"; // Default to '/tmp' if 'dir' is not provided

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading directory");
    } else {
      res.render("admin/traversal", { files });
    }
  });
});

module.exports = router;
