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
        await mongoose.model('Column').findOneAndUpdate(
          { _id: columnId },
          {
            $push: { orderCard: _id },
          }
        ).then((rr) => {
          if (!rr) throw new Error("Failed push to column");
          result = r;
        });
      });
  } catch (error) {
    console.log(error);
  }
  return result;
};

const Card = mongoose.model("card", card);

module.exports = Card;
