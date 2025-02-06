const jwt = require("jsonwebtoken");
const { getUser } = require("../services/auth");

const restrictToSigninUserOnly = (req, res, next) => {
  const sessionId = req.cookies?.uid;
  if (!sessionId) return res.redirect("/signin");

  const user = getUser(sessionId);
  if (!user) return res.redirect("/signin");
  req.user = user;
  return next();
};

const checkAuth = (req, res, next) => {
  const sessionId = req.cookies?.uid;
  if (!sessionId) {
    req.user = null;
    return next();
  }
  const user = getUser(sessionId);
  req.user = user;
  next();
};

module.exports = {
  restrictToSigninUserOnly,
  checkAuth,
};
