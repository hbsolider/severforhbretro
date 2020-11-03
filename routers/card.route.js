const router = require("express").Router();
const auth = require("../middlewares/auth");
const Card = require("../models/card");
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
      await Card.findByIdAndUpdate(req.body._id, { title: req.body.title }).then(r=>{
        if(r)
        return  res.status(200).json({message:'Update success!'})
      });
    } catch (error) {
      return res.status(400).json({error})
    }
  })
  .delete(async (req, res) => {
    try {
      await Card.findByIdAndDelete({ _id: req.body._id }).then((r) => {
        if (r) return res.status(200).json({ message: "Delete success!" });
      });
    } catch (error) {
      return res.status(400).json({ message: "Something wrong!" });
    }
  });

module.exports = router;
