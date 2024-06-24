const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const Brochure = require("../models/brochure.model");
const osType = os.type();
const checkPerms = require("../middlewares/checkPermissions");

const uploadPath = path.join(__dirname, "..", "assets", "files");

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
router.get("/brochures", checkPerms("canManageBroshures"), async (req, res) => {
  try {
    const brochures = await Brochure.find({});
    res.render("admin/brochures/brochures", { brochures, osType });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET gallery page
router.get(
  "/brochures/upload",
  checkPerms("canManageBroshures"),
  (req, res) => {
    res.render("admin/brochures/upload-brochure");
  }
);

// POST uploaded file
router.post(
  "/brochures/upload",
  checkPerms("canManageBroshures"),
  upload.fields([{ name: "cover" }, { name: "file" }]),
  async (req, res) => {
    try {
      const { title } = req.body;
      const cover = req.files["cover"][0].filename;
      const file = req.files["file"][0].filename;
      const basePath = "../files/";
      const newBrochure = new Brochure({
        title,
        cover: basePath + cover,
        file: basePath + file,
      });
      console.log(cover);
      await newBrochure.save();
      res.redirect("/dashboard/brochures");
    } catch (err) {
      res.send("Internal server error.");
    }
  }
);

// Delete a brochure
router.post(
  "/brochures/delete",
  checkPerms("canManageBroshures"),
  async (req, res) => {
    try {
      const { brochureId } = req.body;
      await Brochure.findByIdAndDelete(brochureId);
      res.redirect("/dashboard/brochures");
    } catch (err) {
      res.send("Internal Server Error");
    }
  }
);

module.exports = router;
