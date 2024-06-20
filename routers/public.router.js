const router = require("express").Router();
const Gallery = require("../models/gallery.model");
const Brochure = require("../models/brochure.model");
const New = require("../models/news.model");
const Message = require("../models/message.model");
const os = require("os");
const path = require("path");
const fs = require("fs");
const osType = os.type();
// GET index page
router.get("/", async (req, res) => {
  let galleryImgs = await Gallery.find().sort({ order: 1 });
  let news = (await New.find()).reverse();

  const { currentLocale, images } = getJsons(res);

  res.render("index", {
    galleryImgs,
    news,
    osType,
    t: res.__,
    currentLocale,
    images,
  });
});

// GET gallery page
router.get("/gallery", async (req, res) => {
  try {
    let galleryImgs = await Gallery.find().sort({ order: 1 });
    const { currentLocale, images } = getJsons(res);

    res.render("gallery", {
      galleryImgs,
      osType,
      currentLocale,
      t: res.__,
      images,
    });
  } catch (err) {
    res.send("Internal server error");
  }
});

// GET vision page
router.get("/vision", (req, res) => {
  const { currentLocale, images } = getJsons(res);
  res.render("vision", { images, currentLocale, t: res.__ });
});

// GET profile page
router.get("/profile", async (req, res) => {
  try {
    const brochures = await Brochure.find({});
    const { currentLocale, images } = getJsons(res);

    res.render("profile", {
      brochures,
      osType,
      images,
      currentLocale,
      t: res.__,
    });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET article page
router.get("/blog", async (req, res) => {
  let articles = (await New.find()).reverse();
  const { currentLocale, images } = getJsons(res);
  res.render("blog", { articles, images, currentLocale, t: res.__ });
});

// GET article page
router.get("/blog/article/:id", async (req, res) => {
  // const galleryImgs = await Gallery.find({});
  const { id } = req.params;
  const article = await New.findById(id);
  const { currentLocale, images } = getJsons(res);
  res.render("article", { currentLocale, images, article, osType, t: res.__ });
});

// POST new message
router.post("/messages", async (req, res) => {
  const reply = {
    success: {
      en: {
        title: "Success",
        msg: "Your message has been recieved",
        done: true,
      },
      ar: {
        title: "تم",
        msg: "تم استقبال رسالتك بنجاح",
        done: true,
      },
    },
    failed: {
      en: {
        title: "failed",
        msg: "Oops! Something went wrong. Please try again.",
        done: false,
      },
      ar: {
        title: "فشل",
        msg: "لم يتم ارسال الرسالة. يرجى المحاولة مجدداً",
        done: false,
      },
    },
  };
  let locale = "en";
  try {
    const { name, email, msg, lang } = req.body;
    locale = lang;
    const newMsg = new Message({
      name,
      email,
      msg,
    });
    await newMsg.save();

    res.status(200).json(reply.success[locale]);
  } catch (err) {
    res.status(500).json(reply.failed[locale]);
  }
});

// GET test page
router.get("/test", async (req, res) => {
  // const galleryImgs = await Gallery.find({});
  res.render("test");
});

const getJsons = (res) => {
  const currentLocale = res.getLocale();
  const imagesFilePath = path.join(
    __dirname,
    "..",
    "assets",
    "imgs",
    "images.json"
  );
  const images = require(imagesFilePath);
  return { currentLocale, imagesFilePath, images };
};

module.exports = router;
