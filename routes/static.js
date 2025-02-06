const express = require("express");

const User = require("../models/user");
const Blog = require("../models/blog");
const { setUser } = require("../services/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const user = req.user;
  const blogs = await Blog.find({}).populate("createdBy", "userName email");
  return res.render("home", { user, blogs });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  const emailExist = await User.findOne({ email });
  if (emailExist) return res.render("signup", { error: "email already exist" });
  const newUser = await User.create({
    userName,
    email,
    password,
  });
  const token = setUser(newUser);
  res.cookie("uid", token);
  return res.redirect("/");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email, password });
  if (!userExist) {
    return res.render("signin", { error: "email or password is wrong" });
  }

  const token = setUser(userExist);
  res.cookie("uid", token);
  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("uid");
  res.redirect("/");
});

module.exports = router;
