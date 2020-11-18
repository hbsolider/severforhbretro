const User = require("../models/user");
const Board = require("../models/board");

const getBoardData = async (boardId, client) => {
  try {
    return await Board.getCard(boardId).then((result) => {
      client.emit("getBoardData", result);
    });
  } catch (error) {
    return null;
  }
};
const socket = (io) => {
  io.on("connection", (client) => {
    console.log("New connection", client.id);
    client.on("subscribeToDateEvent", (boardId) => {
      setInterval(() => {
        getBoardData(boardId, client);
      }, 1500);
    });
  });
};

module.exports = socket;
