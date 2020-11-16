const mongoose = require('mongoose');
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
router.route('/test').get(async(req,res)=>{
  try {
    await Column.findOne({_id:req.body.columnId}).deleteOne({orderCard:req.body.id}).then(r=>{
      res.send(r)
    })
  } catch (error) {
    res.send(error)
  }
})
router.get('/test1',async(req,res)=>{
  const id = mongoose.Types.ObjectId(JSON.parse(12342156561651));
  res.send(id.toHexString())
})
module.exports = router