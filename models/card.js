const mongoose = require("mongoose");
const Column = require("./column");
const card = mongoose.Schema({
  title: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  columnId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  feedBack: {
    commentList: {
      type: mongoose.SchemaTypes.Array,
    },
    likeList: {
      type: mongoose.SchemaTypes.Array,
    },
  },
});
card.statics.insertToColumn = async (feild) => {
  let result = null;
  try {
    await new Card({
      title: feild.title,
      columnId: feild.columnId,
    })
      .save()
      .then(async (r) => {
        if (!r) throw new Error("Something went wrong in saving!");
        const { _id, columnId } = r;
        await mongoose
          .model("Column")
          .findOneAndUpdate(
            { _id: columnId },
            {
              $push: { orderCard: _id },
            }
          )
          .then((rr) => {
            if (!rr) throw new Error("Failed push to column");
            result = r;
          });
      });
  } catch (error) {
    console.log(error);
  }
  return result;
};
card.statics.delete = async (_id) => {
  try {
    const { columnId } = await Card.findById(_id);
    const { orderCard } = await Column.findById(columnId);
    const order = orderCard.filter((e) => {
      return !e.equals(_id);
    });
    await Column.findOneAndUpdate({ _id: columnId }, { orderCard: order });
    return await Card.findByIdAndDelete(_id).then((r) => {
      return r;
    });
  } catch (error) {
    throw error;
  }
};
card.statics.changeColumnAndIndex = async ({
  sourceId,
  desId,
  sourceIndex,
  desIndex,
  cardId,
}) => {
  try {
    if (sourceId === desId) {
      let { orderCard } = await Column.findById(sourceId);
      orderCard.splice(sourceIndex, 1);
      orderCard.splice(desIndex, 0, cardId);
      return await Column.findByIdAndUpdate(sourceId, { orderCard }).then(
        (r) => {
          return r;
        }
      );
    } else {
      let result = [];
      const colS = await Column.findById(sourceId);
      let sourceOrderCard = colS.orderCard;
      const colD = await Column.findById(desId);
      let desOrderCard = colD.orderCard;
      sourceOrderCard.splice(sourceIndex, 1);
      desOrderCard.splice(desIndex, 0, cardId);
      result.push(await colS.save())
      result.push(await colD.save())
      // result.push(await Column.updateOne({_id:sourceIndex},{ orderCard: newSourceOrderCard }));
      // result.push(await Column.updateOne({_id:desId},{ orderCard: newDesOrderCard }));
      return result;
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};
const Card = mongoose.model("card", card);

module.exports = Card;
