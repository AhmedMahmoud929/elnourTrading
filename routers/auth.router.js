const router = require("express").Router();
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const requireAuth = require("../middlewares/requireAuth");
const Visit = require("../models/visit.model");
const New = require("../models/news.model");
const Gallery = require("../models/gallery.model");
const Brochure = require("../models/brochure.model");
const path = require("path");

// Get login-admin page
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const storedAdmin = req.session.admin;
    let { visits } = await Visit.findOne();
    let newsCount = await New.countDocuments();
    let imagesCount = await Gallery.countDocuments();
    let brochuresCount = await Brochure.countDocuments();
    if (visits > 1000) visits = (visits / 1000).toFixed(2) + "K";
    res.render("admin/dashboard", {
      username: storedAdmin.username,
      visits,
      newsCount,
      imagesCount,
      brochuresCount,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get login-admin page
router.get("/login", (req, res) => {
  if (req.session.admin) {
    res.redirect("/dashboard");
  } else {
    const imagesFilePath = path.join(
      __dirname,
      "..",
      "assets",
      "imgs",
      "images.json"
    );
    const images = require(imagesFilePath);
    res.render("admin/login", { images });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      res.send("Invalid username or password");
      return;
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.send("Invalid username or password");
      return;
    }

    if (!admin.isActive) {
      res.send("This account is not active");
      return;
    }

    // Store user information in session
    req.session.admin = admin;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.get("/create-admin", async (req, res) => {
//   try {
//     const { fullName, username, password } = req.query;
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

//     // Create new user with hashed password
//     const newAdmin = new Admin({
//       fullName,
//       username,
//       password: hashedPassword,
//     });

//     // Save the new user
//     await newAdmin.save();
//     res.send("Admin Created Successfully");
//   } catch (err) {
//     res.status(500).send("Msh nafe3 elshoghl da ya 3am");
//   }
// });

// LOGOUT
router.get("/dashboard/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
