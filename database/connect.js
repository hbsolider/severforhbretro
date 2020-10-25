const mongoose = require("mongoose");
const URL = process.env.MONGODB_URI;
module.exports = {
  connectOnce: () => {
    //connect
    mongoose.connect(
      URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      (err) => {
        if (!err) {
          console.log("MongoDB Connection Succeeded.");
        } else {
          console.log("Error in DB connection: " + err);
        }
      }
    );
    db = mongoose.connection;
    db.once("open", () => {
      console.log("connected");
    });
  },
  connect: () => {
    const mongoose = require("mongoose");

    mongoose.Promise = global.Promise;

    // Connect MongoDB at default port 27017.
    mongoose.connect(
      URL,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
      },
      (err) => {
        if (!err) {
          console.log("MongoDB Connection Succeeded.");
        } else {
          console.log("Error in DB connection: " + err);
        }
      }
    );
  },
};
