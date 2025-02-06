require('dotenv').config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const staticRoute = require("./routes/static");
const blogRoute = require("./routes/blog");
const { restrictToSigninUserOnly, checkAuth } = require("./middlewares/auth");

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log("MongoDB connection error", e));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/", checkAuth, staticRoute);
app.use("/my-blog", restrictToSigninUserOnly, blogRoute);

// ✅ Export app for Vercel
module.exports = app;
