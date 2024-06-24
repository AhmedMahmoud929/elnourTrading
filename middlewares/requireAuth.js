module.exports = (req, res, next) => {
  if (req.session.admin) {
    res.locals.permissions = req.session.admin.permissions;
    res.locals.isSuper = req.session.admin.isSuper;
    next();
  } else {
    res.redirect("/login");
  }
};
