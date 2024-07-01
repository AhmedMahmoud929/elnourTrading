const router = require("express").Router();
const Gallery = require("../models/gallery.model");
const Brochure = require("../models/brochure.model");
const New = require("../models/news.model");
const Message = require("../models/message.model");
const Job = require("../models/job.model");
const os = require("os");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const osType = os.type();
const timeAgo = require("../utilies/timeAgo");
const formatCreatedAt = require("../utilies/formatCreatedAt");

// Set up multer storage and file filter
const uploadPath = path.join(__dirname, "..", "assets", "files", "uploadedCVs");

// Create the destination directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /pdf/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .pdf files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

// GET job-profile page
router.get("/careers/job-profile/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  job.viewsCount = job.viewsCount + 1;
  await job.save();
  const { currentLocale, images } = getJsons(res);
  res.render("job-profile", {
    currentLocale,
    images,
    job,
    formatCreatedAt,
    t: res.__,
  });
});

// GET job-profile page
router.get("/careers", async (req, res) => {
  const jobs = await Job.find({});
  const { currentLocale, images } = getJsons(res);
  res.render("careers", {
    currentLocale,
    images,
    jobs,
    timeAgo,
    t: res.__,
  });
});

// POST new cv on job-profile
router.post(
  "/careers/job-profile/:id",
  upload.single("cv"),
  async (req, res) => {
    try {
      if (req.file) {
        const { id } = req.params;
        const { lang } = req.body;
        const job = await Job.findById(req.params.id);
        if (job) {
          job.uploadedCVs.push(req.file.filename);
          await job.save();
          res.req.flash("success", {
            en: {
              title: "Success",
              msg: "CV has been uploaded successfully",
              done: true,
            },
            ar: {
              title: "تم بنجاح",
              msg: "تم رفع السيرة الذاتية بنجاح",
              done: true,
            },
          });
          res.redirect(`/careers/job-profile/${id}?lang=${lang}`);
        } else {
          res.status(404).send("Job not found");
        }
      } else {
        res.status(404).send("CV pdf is required");
      }
    } catch (err) {
      res.req.flash("failed", {
        en: {
          title: "Failed",
          msg: "There is a problem, please try again leter",
          done: false,
        },
        ar: {
          title: "فشلت العملية",
          msg: "هناك مشكلة ما, من فضلك حاول مجددا في وقت لاحق",
          done: false,
        },
      });
      res.redirect(`/careers/job-profile/${id}`);
    }
  }
);

// GET test page
router.get("/test", async (req, res) => {
  // const galleryImgs = await Gallery.find({});
  res.render("test");
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    res.status(400).send("File upload failed. File size exceeds 10MB limit.");
  } else if (err) {
    res.status(400).send(err.message);
  } else {
    next();
  }
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
