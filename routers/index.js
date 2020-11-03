const { Router } = require("express");
const { route } = require("./board.route");

const router = require("express").Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");
const Column = require("../models/column");
const Board = require("../models/board");
router.get("/", async (req, res) => {
  await Board.findColumn(req.body.boardId).then((result) => {
    return res.status(200).json({ column: result });
  });
});

module.exports = router