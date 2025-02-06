const express = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const user = req.user;
  const userId = await User.findOne({ email: user.email });
  const blogs = await Blog.find({ createdBy: userId._id }).populate(
    "createdBy",
    "userName email"
  );
  return res.render("home", { blogs, user });
});

router.get("/blog/:id", async (req, res) => {
  const blogId = req.params.id;
  const user = req.user;
  const blog = await Blog.findById(blogId).populate(
    "createdBy",
    "userName email"
  );
  const comments = await Comment.find({ blogId }).populate("userId", "userName");
  res.render("blogDetail", { blog, user, comments });
});

router.post("/blog/:id", async (req, res) => {
  const blogId = req.params.id;
  const user = req.user;
  const userId = await User.findOne({email: user.email});
  const {content} = req.body;
  await Comment.create({
    blogId,
    userId,
    content,
  }) 
  res.redirect(`/my-blog/blog/${blogId}`);
});

router.get("/new-blog", (req, res) => {
  const user = req.user;
  res.render("newBlog", { user });
});

router.post("/new-blog", upload.single("blogImageUrl"), async (req, res) => {
  const user = req.user;
  const userId = await User.findOne({ email: user.email });
  const { title, description } = req.body;
  const blogImageUrl = req.file.filename;
  const newBlog = await Blog.create({
    title,
    description,
    blogImageUrl,
    createdBy: userId,
  });

  res.redirect("/my-blog");
});

module.exports = router;
