const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (!req.header("Authorization")) {
    return res.status(403).json({ message: "You must login!" });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    userModel.findById(data._id).then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Unauthenticated" });
      }
      req.user = user;
      req.token = token;
      next();
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Something went wrong with your account!" });
  }
}

module.exports = auth;
