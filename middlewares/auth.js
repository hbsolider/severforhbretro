const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
function auth(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    userModel.findById(data._id).then((user) => {
      if (!user) {
        throw new Error({ message: "Failed to authorization" });
      }
      req.user = user;
      req.token = token;
      next();
    });
  } catch (error) {
    throw new Error({ message: error });
  }
}

module.exports = auth;
