module.exports = (req, res, next) => {
  if (req.session.admin.isSuper) {
    next();
    console.log(TRUE);
  } else {
    res.redirect("/dashboard");
  }
};
