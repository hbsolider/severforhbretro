const router = require("express").Router();
const auth = require("../middlewares/auth");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  await userModel
    .find()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});
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
module.exports = router;
