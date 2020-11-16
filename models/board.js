const mongoose = require("mongoose");
const Column = require("./column");
const Card = require("./card");
const board = mongoose.Schema({
  title: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  dayCreated: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  isDelete: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
  },
  public: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
  },
});
board.statics.findColumn = async (_id) => {
  const column = await Column.find({ boardId: _id });
  if (!column) {
    throw "Not exist!";
  }
  let results = [];
  for (let i = 0; i < column.length; i++) {
    const { _id, title, orderCard } = column[i];
    const card = await Card.find({ columnId: _id });
    if (!card) {
      throw "column not exist!";
    }
    results.push({ _id, title, orderCard, card });
  }
  return results;
};
board.statics.getCard = async (boardId) => {
  let result = [];
  try {
    const col = await Column.find({ boardId });
    if (!col || col.length === 0) {
      throw "Something went wrong";
    }
    for (let i = 0; i < col.length; i++) {
      let listCard = [];
      const { orderCard, title, _id } = col[i];
      for(let j = 0;j<orderCard.length;j++){
        await Card.findById(orderCard[j]).then(r=>{
          if(r){
            listCard.push(r)
          }
        })
      }
      result.push({ _id, title, card: listCard });
    }
  } catch (error) {
    throw error;
  }
  return result;
};
board.statics.insertBoard = async (feild) => {
  const columns = (boardId) => [
    { title: "Went well", boardId },
    { title: "To improve", boardId },
    { title: "Action Items", boardId },
  ];
  let result = [];
  try {
    const newboard = new Board({ ...feild });
    await newboard
      .save()
      .then(async (r) => {
        result.push(r);
        const boardId = r._id;
        await Column.insertMany(columns(boardId))
          .then((r2) => {
            result.push({ column: r2 });
          })
          .catch((err) => {
            console.log(err);
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    throw new Error(err);
  }
  return result;
};
board.statics.deleteSelf = async (_id) => {
  try {
    await Board.findByIdAndDelete(_id);
    await Column.deleteMany({ boardId: _id });
    return { message: "Delete board success!" };
  } catch (error) {
    throw new Error(error);
  }
};
const Board = mongoose.model("Board", board);

module.exports = Board;
