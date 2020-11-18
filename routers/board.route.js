const router = require("express").Router();
const boardModel = require("../models/board");
const userModel = require("../models/user");
const columnModel = require("../models/column");
const cardModel = require("../models/card");
const auth = require("../middlewares/auth");
const faker = require("faker");
const { fake } = require("faker");

router
  .route("/")
  .get(auth, async (req, res, next) => {
    await boardModel
      .find({ userId: req.user._id })
      .select("title cardAmount dayCreated public")
      .then((result) => {
        return res.status(200).json({ data: result });
      })
      .catch((e) => {
        return res.status(400).json({ error: e });
      });
  })
  .post(auth, async (req, res) => {
    const newBoard = {
      userId: req.user._id,
      title: req.body.title,
    };

    await boardModel
      .insertBoard(newBoard)
      .then((r) => {
        if (!r) return res.status(400).json("Something went wrong!");
        return res.status(201).json(r);
      })
      .catch((err) => {
        return res.status(400).json({ message: err });
      });
  })
  .patch(auth, async (req, res) => {
    try {
      await boardModel
        .findByIdAndUpdate(req.body._id, { title: req.body.title })
        .then((r) => {
          if (r)
            return res.status(200).json({ message: "Update board success!" });
        });
    } catch (error) {
      return res.status(400).json({ message: "Something wrong in updating!" });
    }
  })
  .delete(auth, async (req, res) => {
    try {
      await boardModel.deleteSelf(req.body._id).then((r) => {
        res.status(200).json({ message: "Delete board success!" });
      });
    } catch (error) {
      res.status(400).json({ message: "Something wrongs" });
    }
  });

router.get("/data", auth, async (req, res) => {
  const boardId = req.query.boardId;
  await boardModel
    .findById(boardId)
    .then(async (r) => {
      if (!r) {
        return res.status(400).json({ message: "Not exist board!" });
      }
      if (!r.public) {
        if (!r.userId.equals(req.user._id)) {
          return res.status(400).json({ message: "Not allowed!" });
        }
      }
      await boardModel.getCard(boardId).then((result) => {
        return res.status(200).json({ title: r.title, column: result });
      });
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).json({ error: err });
    });
});
router.post("/public", auth, async (req, res) => {
  const { _id } = req.body;
  try {
    await boardModel.findByIdAndUpdate(_id, { public: true }).then((r) => {
      res.status(200).json({ message: "Public!" });
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
router.get("/clone", async (req, res) => {
  let result = [];
  try {
    for (let i = 0; i < 5; i++) {
      await new userModel({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "admin1",
      })
        .save()
        .then(async (r) => {
          const { _id } = r;
          for (let c = 0; c < 8; c++) {
            const newBoard = {
              userId: _id,
              title: faker.company.catchPhraseNoun(),
            };
            await boardModel.insertBoard(newBoard).then(async (r) => {
              const col = r[1].column;
              for (let b = 0; b < col.length; b++) {
                const { _id } = col[b];
                for (let c = 0; c < 5; c++) {
                  const newcard = {
                    title: faker.company.bsBuzz(),
                    columnId: _id,
                  };
                  await cardModel.insertToColumn(newcard).then((rr) => {
                    result.push(rr._id);
                  });
                }
              }
            });
          }
        });
    }
    return res.send({ result });
  } catch (error) {
    return res.send({ error });
  }
});
module.exports = router;
