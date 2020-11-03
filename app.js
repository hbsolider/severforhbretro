require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const db = require("./database/connect");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});
db.connectOnce();

//declare routes
const boardRoute = require("./routers/board.route");
const userRoute = require("./routers/user.route");
const indexRoute = require("./routers/index");
const cardRoute = require("./routers/card.route");
//use routes
app.use("/board", boardRoute);
app.use("/user", userRoute);
app.use("/", indexRoute);
app.use("/card", cardRoute);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listen port: ${PORT}`);
});
