const router = require("express").Router();
const boardModel = require("../../models/board");
const userModel = require("../../models/user");
const columnModel = require("../../models/column");
const cardModel = require("../../models/card");
const auth = require("../../middlewares/auth");
const faker = require("faker");
const { fake } = require("faker");
// const userModel = require("../../models/user");

router.post("/", auth, async (req, res) => {
  const newBoard = new boardModel({
    userId: req.user._id,
    cardAmount: 0,
    ...req.body,
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
//clone data
router.get("/cc", async (req, res) => {
  res.send(faker.internet.userName());
});
router.get("/clone", async (req, res) => {
  const column = (boardId) => [
    { title: "Went well", boardId },
    { title: "To improve", boardId },
    { title: "Action Items", boardId },
  ];
  for (let i = 0; i < 5; i++) {
    const user = new userModel({
      username: faker.internet.userName(),
      password: "thisisapassword",
      email: faker.internet.email(),
    });
    await user.save().then(async(result) => {
      userId = result._id;
      for (let i = 0; i < 10; i++) {
        const newBoard = new boardModel({
          userId: userId,
          cardAmount: 0,
          title: faker.company.bsNoun(),
        })
          await newBoard.save().then((resa) => {
            const boardId = resa._id;
            const listColumn = column(boardId);
            listColumn.map(async(e) => {
              const newColumn = new columnModel(e)
              await newColumn.save().then((ress) => {
                let card = [];
                for (let k = 0; k < 5; k++) {
                  const newcard = {
                    title: faker.company.catchPhraseAdjective(),
                    idColumn: ress._id,
                    index: k,
                  };
                  card.push(newcard);
                }
                cardModel.insertMany(card).then(r=>{
                  res.send(r)
                })
              });
            });
          });
      }
    });
  }
});
router.get("/:userId", async (req, res) => {
  await boardModel
    .find({ userId: req.params.userId })
    .select("title cardAmount dayCreated")
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((e) => {
      res.status(400).json({ error: e });
    });
});
module.exports = router;
