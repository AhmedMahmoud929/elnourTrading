module.exports = (perm) => (req, res, next) => {
  if (req.session.admin.permissions[perm]) {
    next();
  } else {
    res.redirect("/dashboard");
  }
};
