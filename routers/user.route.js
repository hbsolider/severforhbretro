const router = require("express").Router();
const auth = require("../middlewares/auth");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
let clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
require("../config/passport").config();
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.signInByUsername(username, password);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("/", async (req, res) => {
  userModel
    .find({ username: req.body.username })
    .then(async (result) => {
      if (result.length > 0) {
        return res.status(400).json({ message: "username existed!" });
      }
      const newUser = new userModel({
        ...req.body,
      });
      await newUser
        .save()
        .then((result) => {
          res
            .status(201)
            .json({ message: "user created!", userId: result._id });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      return res.status(403).json({ message: "something went wrong!", error });
    });
});
router.patch("/", auth, async (req, res) => {
  if (!req.body.passwordChange) {
    try {
      let rr = (dayCreated) => ({
        username: req.body.username,
        password: req.body.password,
        dayCreated,
        email: req.body.email,
        _id: req.body._id,
      });
      await userModel
        .findByIdAndUpdate(req.body._id, {
          username: req.body.username,
          email: req.body.email,
        })
        .then((r) => {
          if (r) res.status(200).json({ user: rr(r.dayCreated) });
        });
    } catch (error) {}
  } else {
    const salt = bcrypt.genSaltSync(10);
    const newpass = bcrypt.hashSync(req.body.password, salt);
    try {
      await userModel
        .findByIdAndUpdate(req.body._id, {
          username: req.body.username,
          email: req.body.email,
          password: newpass,
        })
        .then((r) => {
          if (r) res.status(200).json({ message: "Update success!" });
        });
    } catch (error) {}
  }
});
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect(`${clientUrl}#`);
  }
);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(`${clientUrl}#`);
  }
);
router.get("/", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.json({ user: req.user, isLogged: true });
    }
    if (!req.header("Authorization")) {
      return res.status(403).json({ message: "You must login!" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    await userModel.findById(data._id).then((user) => {
      if (!user) {
        return res.json({ user: {}, isLogged: false });
      }
      return res.json({ user, isLogged: true });
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Something went wrong with your account!" });
  }
});
router.get("/logout", (req, res) => {
  try {
    req.logOut();
    res.status(200).json({ message: "Logout success!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something not good!" });
  }
});
module.exports = router;
