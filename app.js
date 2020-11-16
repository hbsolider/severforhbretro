require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const expressSession = require("express-session");
const db = require("./database/connect");
const app = express();
db.connectOnce();
// app.use(cors());
app.use(cors({
  credentials: true,
  origin:'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "hihihiopipoi",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//declare routes
const boardRoute = require("./routers/board.route");
const userRoute = require("./routers/user.route");
const indexRoute = require("./routers/index");
const cardRoute = require("./routers/card.route");
//use routes
app.use("/api/board", boardRoute);
app.use("/api/user", userRoute);
app.use("/api/", indexRoute);
app.use("/api/card", cardRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listen port: ${PORT}`);
});
