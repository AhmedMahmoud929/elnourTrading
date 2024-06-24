const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const checkPerms = require("../middlewares/checkPermissions");

const imagesFilePath = path.join(
  __dirname,
  "..",
  "assets",
  "imgs",
  "images.json"
);

const uploadPath = path.join(
  __dirname,
  "..",
  "assets",
  "imgs",
  "uploadedImages"
);

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
router.get("/media", checkPerms("canManageImages"), async (req, res) => {
  try {
    const images = await require(imagesFilePath);
    res.render("admin/media/media", { images });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

router.post(
  "/media",
  checkPerms("canManageImages"),
  upload.single("file"),
  async (req, res) => {
    try {
      const images = require(imagesFilePath);
      const keys = req.body.key.split("-");
      if (req.body.type == "video/mp4")
        images[keys[0]][keys[1]].src =
          "/imgs/uploadedImages/" + req.file.filename;
      else
        images[keys[0]][keys[1]] = "/imgs/uploadedImages/" + req.file.filename;

      fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2));
      res.status(200).json({ msg: "Image has been updated successfully" });
    } catch (err) {
      res.send("Internal Server Error");
    }
  }
);

module.exports = router;
