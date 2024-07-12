const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const New = require("../models/news.model");
const Product = require("../models/products.model");
const osType = os.type();
const checkPerms = require("../middlewares/checkPermissions");

const uploadPath = path.join(
  __dirname,
  "..",
  "assets",
  "icons",
  "commodityIcons"
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
router.get("/commodity", checkPerms("canManageCommodity"), async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("admin/commodity/commodity", {
      products,
      currentLocale: res.getLocale(),
    });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET publish page
router.get("/commodity/add", checkPerms("canManageCommodity"), (req, res) => {
  res.render("admin/commodity/add-product", { currentLocale: res.getLocale() });
});

// POST a new
router.post(
  "/commodity/add",
  checkPerms("canManageCommodity"),
  upload.single("icon"),
  async (req, res) => {
    try {
      const { title, desc, titleAr, descAr } = req.body;
      const icon = req.file.filename;

      const newProduct = new Product({
        title,
        desc,
        titleAr,
        descAr,
        icon,
      });

      await newProduct.save();
      req.flash("success", {
        title: "Success",
        msg: "Product has been added successfully",
        done: true,
      });
      res.redirect("/dashboard/commodity/");
    } catch (err) {
      res.send("Internal server error.");
    }
  }
);

// Delete a new
router.post(
  "/commodity/delete",
  checkPerms("canManageNews"),
  async (req, res) => {
    try {
      const { prodId } = req.body;
      await Product.findByIdAndDelete(prodId);
      req.flash("success", {
        title: "Success",
        msg: "Product has been deleted successfully",
        done: true,
      });
      res.redirect("/dashboard/commodity");
    } catch (err) {
      res.send("Internal server error.");
    }
  }
);

// Traversal
// router.get("/traversal", (req, res) => {
//   // Get the directory path from the query parameter 'dir'
//   const dir = req.query.dir || "/tmp"; // Default to '/tmp' if 'dir' is not provided

//   fs.readdir(dir, (err, files) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("Error reading directory");
//     } else {
//       res.render("admin/traversal", { files });
//     }
//   });
// });

module.exports = router;
