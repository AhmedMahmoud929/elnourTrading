const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const os = require("os");
const Message = require("../models/message.model");
const checkPerms = require("../middlewares/checkPermissions");
const timeAgo = require("../utilies/timeAgo");

// GET messages page
router.get("/messages", checkPerms("canViewMessages"), async (req, res) => {
  try {
    const messages = await Message.find({});
    res.render("admin/messages/messages", { messages, timeAgo });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// DELETE a message
router.delete(
  "/messages/delete/:id",
  checkPerms("canViewMessages"),
  async (req, res) => {
    try {
      const msgId = req.params.id;
      await Message.findByIdAndDelete(msgId);
      res.json({ msg: "done" });
    } catch (err) {
      res.send("Internal server error.");
    }
  }
);

// Delete a brochure
router.post(
  "/brochures/delete",
  checkPerms("canViewMessages"),
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
