const mongoose = require("mongoose");
const Card = require("./card");
const column = mongoose.Schema({
  title: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  dayCreated: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
  },
  boardId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  orderCard: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },
});
module.exports = mongoose.model("Column", column);
