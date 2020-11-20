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
    client.on('disconnect',()=>{
        console.log('disconnect',client.id)
    })
    client.on('client-change',()=>{
        io.sockets.emit('server-send','data');
    })
  });


};

module.exports = socket;
