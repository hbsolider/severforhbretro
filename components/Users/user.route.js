const user = require("../../models/user");

const router = require("express").Router();
const userModel = require("../../models/user");
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

module.exports = router;
