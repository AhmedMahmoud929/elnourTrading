const router = require("express").Router();
const path = require("path");
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");

// GET admins page
router.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.render("admin/admins/admins", { admins });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET admins page
router.get("/admins/add", async (req, res) => {
  try {
    const permissions = Admin.schema.obj.permissions;
    console.log(permissions);
    res.render("admin/admins/addAdmin", { permissions });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET admins page
router.get("/admins/permissions/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);
    res.render("admin/admins/permissions", {
      admin,
      formatSpacedString,
    });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// POST new admin
router.post("/admins/new", async (req, res) => {
  try {
    const { fullName, username, yourPass, isSuper, newAdminPass, permissions } =
      req.body;

    // Create a new Admin object
    const passwordIsValid = await bcrypt.compare(
      yourPass,
      req.session.admin.password
    );

    if (passwordIsValid) {
      const hashedNewPassword = await bcrypt.hash(newAdminPass, 10);
      const newAdmin = new Admin({
        fullName,
        username,
        password: hashedNewPassword,
        isSuper,
        permissions: parsePermissions(permissions),
      });

      // Save the new admin to the database
      const savedAdmin = await newAdmin.save();
      console.log(savedAdmin);
      res.redirect("/dashboard/admins");
    } else {
      res.status(400).send("<center><h1>Password is not correct</h1></center>"); // Handle error if save fails
    }
  } catch (err) {
    res.status(400).send(err); // Handle error if save fails
  }
});

// DELETE an exist admin
router.post("/admins/delete", async (req, res) => {
  try {
    const { adminId } = req.body;
    await Admin.findByIdAndDelete(adminId);
    res.redirect("/dashboard/admins");
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE an exist admin
router.post("/admins/update-permissions/", async (req, res) => {
  try {
    const { id, key, value } = req.body;
    const update = {};
    update[`permissions.${key}`] = value;
    await Admin.findByIdAndUpdate(id, { $set: update });
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

function parsePermissions(permissions) {
  // Define all possible permissions as an array
  const permissionsTemplate = Admin.schema.obj.permissions;
  for (let key in permissionsTemplate) permissionsTemplate[key] = false;

  // If permissions are only one element, so it'll sent as a string not an array
  if (permissions != undefined) {
    if (typeof permissions == "string") permissions = [permissions];
    // Loop on array of permissions
    permissions.forEach((permission) => {
      if (permissionsTemplate.hasOwnProperty(permission)) {
        permissionsTemplate[permission] = true;
      }
    });
  }

  return permissionsTemplate;
}

function formatSpacedString(camelCaseStr) {
  // Insert a space before each uppercase letter
  const spacedStr = camelCaseStr.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter of each word
  const result = spacedStr
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return result;
}

module.exports = router;
