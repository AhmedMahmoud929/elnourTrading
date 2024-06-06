const router = require("express").Router();
const Gallery = require("../models/gallery.model");
const Brochure = require("../models/brochure.model");
const New = require("../models/new.model");
const os = require("os");
const osType = os.type();
// GET index page
router.get("/", async (req, res) => {
  const currentLocale = res.getLocale();
  let galleryImgs = await Gallery.find().sort({ order: 1 });
  let news = (await New.find()).reverse();
  console.log(res.__);
  res.render("index", { galleryImgs, news, osType, t: res.__, currentLocale });
});

// GET gallery page
router.get("/gallery", async (req, res) => {
  try {
    let galleryImgs = await Gallery.find().sort({ order: 1 });
    res.render("gallery", { galleryImgs, osType });
  } catch (err) {
    res.send("Internal server error");
  }
});

// GET vision page
router.get("/vision", (req, res) => {
  res.render("vision");
});

// GET profile page
router.get("/profile", async (req, res) => {
  try {
    const brochures = await Brochure.find({});
    console.log(brochures);
    res.render("profile", { brochures, osType });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET article page
router.get("/article/:id", async (req, res) => {
  // const galleryImgs = await Gallery.find({});
  const { id } = req.params;
  const article = await New.findById(id);
  res.render("article", { article, osType });
});

// GET test page
router.get("/test", async (req, res) => {
  // const galleryImgs = await Gallery.find({});
  res.render("test");
});

module.exports = router;
