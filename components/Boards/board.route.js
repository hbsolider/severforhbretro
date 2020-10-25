const router = require("express").Router();
const boardModel = require("../../models/board");
// const userModel = require("../../models/user");
router.get("/", async (req, res) => {
  await boardModel
    .find({ userId: req.body.userId })
    .select('title cardAmount')
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((e) => {
      res.status(400).json({ error: e });
    });
});
router.post("/create", async (req, res) => {
  const newBoard = new boardModel({
    ...req.body,
    cardAmount: 0,
  });
  await newBoard
    .save()
    .then((result) => {
      res.status(201).json({ message: "Board created", boardId: result._id });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
});

module.exports = router;
