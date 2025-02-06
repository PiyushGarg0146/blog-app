require('dotenv').config()

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const staticRoute = require("./routes/static");
const blogRoute = require("./routes/blog");
const {restrictToSigninUserOnly, checkAuth} = require("./middlewares/auth")

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongo db connected"))
  .catch((e) => console.log("mongo db error", e));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// routes
app.use("/", checkAuth, staticRoute);
app.use("/my-blog", restrictToSigninUserOnly, blogRoute);

app.listen(PORT, () => {
  console.log(`server listening on Port : http://localhost:${PORT}`);
});
