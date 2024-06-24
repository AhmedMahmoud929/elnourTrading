const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const Gallery = require("../models/gallery.model");
const osType = os.type();
const checkPerms = require("../middlewares/checkPermissions");

/*
const uploadPath =
  osType === "Windows_NT"
    ? path.join(__dirname, "..", "assets", "imgs", "gallery_imgs")
    : "/tmp";
*/
const uploadPath = path.join(__dirname, "..", "assets", "imgs", "gallery_imgs");

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
        "@@@" +
        String(Date.now()) +
        +"@@@" +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// GET index page
router.get("/gallery", checkPerms("canManageGallery"), async (req, res) => {
  try {
    // Fetch gallery images from the database
    let rows = await Gallery.find().sort({ order: 1 });
    // console.log(rows);

    // Render the EJS template with the fetched images
    res.render("admin/gallery/gallery-list", { rows, osType });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET gallery page
router.get("/gallery/upload", checkPerms("canManageGallery"), (req, res) => {
  res.render("admin/gallery/upload-image");
});

// POST uploaded images
router.post(
  "/gallery/upload",
  checkPerms("canManageGallery"),
  upload.array("files"),
  async (req, res) => {
    try {
      const docsCount = await Gallery.countDocuments();
      const images = [];
      req.files.map((f, ix) =>
        images.push({
          path: `../imgs/gallery_imgs/${f.filename}`,
          order: docsCount + ix + 1,
        })
      );
      await Gallery.insertMany(images);
      res.send("Files uploaded successfully.");
    } catch (err) {
      res.send("Internal server error.");
    }
  }
);

// DELETE an exist image
router.post(
  "/gallery/delete",
  checkPerms("canManageGallery"),
  async (req, res) => {
    try {
      const { imageId } = req.body;
      await Gallery.findByIdAndDelete(imageId);
      res.redirect("/dashboard/gallery");
    } catch (err) {
      console.log(err);
      res.send("Internal server error");
    }
  }
);

// REORDER gallery rows
router.post(
  "/gallery/reorder",
  checkPerms("canManageGallery"),
  async (req, res) => {
    try {
      let { firstId, secondId } = req.body;
      let firstEle = await Gallery.findById(firstId);
      let secondEle = await Gallery.findById(secondId);

      await Gallery.findByIdAndUpdate(firstId, { order: secondEle.order });
      await Gallery.findByIdAndUpdate(secondId, { order: firstEle.order });

      res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating order" });
    }
  }
);

module.exports = router;
