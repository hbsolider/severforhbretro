const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
async function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (!req.header("Authorization")) {
    return res.status(403).json({ message: "You must login!" });
  }
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    await userModel.findById(data._id).then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Unauthenticated" });
      }
      req.user = user;
      req.token = token;
    });
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Something went wrong with your account!" });
  }
}

module.exports = auth;
