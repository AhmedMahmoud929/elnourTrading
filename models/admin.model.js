const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    isSuper: { type: Boolean, default: false },
    permissions: {
      canManageText: { type: Boolean, default: false },
      canManageImages: { type: Boolean, default: false },
      canManageNews: { type: Boolean, default: false },
      canManageGallery: { type: Boolean, default: false },
      canManageCareers: { type: Boolean, default: false },
      canManageBroshures: { type: Boolean, default: false },
      canViewMessages: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Pre-save hook to set permissions for super admins
adminSchema.pre("save", function (next) {
  if (this.isSuper) {
    for (let permission in this.permissions) {
      this.permissions[permission] = true;
    }
  }
  next();
});
module.exports = mongoose.model("admin", adminSchema);
