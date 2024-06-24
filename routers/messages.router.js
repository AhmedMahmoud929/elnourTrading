const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const os = require("os");
const Message = require("../models/message.model");
const checkPerms = require("../middlewares/checkPermissions");

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

const timeAgo = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  const units = [
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];

  for (const { label, seconds } of units) {
    const interval = Math.floor(diff / seconds);
    if (interval >= 1)
      return `${interval} ${label}${interval > 1 ? "s" : ""} ago`;
  }

  return "just now";
};

module.exports = router;
