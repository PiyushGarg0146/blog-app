const jwt = require("jsonwebtoken");
const secret = "PiyushGarg0146";

const setUser = (user) => {
  const payload = {
    userName: user.userName,
    email: user.email,
  };
  const token = jwt.sign(payload, secret);
  return token;
};

const getUser = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  setUser,
  getUser,
};
