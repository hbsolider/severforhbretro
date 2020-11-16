const router = require("express").Router();
const auth = require("../middlewares/auth");
const Card = require("../models/card");
const Column = require("../models/column");
router.use(auth);

router
  .route("/")
  .post(async (req, res) => {
    const card = {
      title: req.body.title,
      columnId: req.body.columnId,
    };
    try {
      const result = await Card.insertToColumn(card);
      if (result) res.status(201).json(result);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  })
  .patch(async (req, res) => {
    try {
      await Card.findByIdAndUpdate(req.body._id, {
        title: req.body.title,
      }).then((r) => {
        if (r) return res.status(200).json({ message: "Update success!" });
      });
    } catch (error) {
      return res.status(400).json({ error });
    }
  })
  .delete(async (req, res) => {
    try {
      await Card.delete(req.body._id).then((r) => {
        if (r) return res.status(200).json({ message: "Delete success!" });
      });
    } catch (error) {
      return res.status(400).json({ message: "Something wrong!" });
    }
  });
router.post("/changeIndex", async (req, res) => {
  try {
    const { sourceId, desId, cardId, sourceIndex, desIndex } = req.body;
    await Card.changeColumnAndIndex({
      sourceId,
      desId,
      cardId,
      sourceIndex,
      desIndex,
    }).then(r=>{
      res.status(200).json({message:"Change success!",column:r})
    });
  } catch (error) {
      res.status(400).json({message:'Bad request!'})
  }
});
module.exports = router;
