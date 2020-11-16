const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Column = require("./column");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return this.from === "local";
    },
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: function () {
      return this.from === "local";
    },
  },
  dayCreated: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
  },
  displayName: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  from: {
    type: mongoose.SchemaTypes.String,
    default: "local",
  },
  id: {
    type: mongoose.SchemaTypes.String,
    required: function () {
      return this.from !== "local";
    },
  },
});
userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  const salt = bcrypt.genSaltSync(10);
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, salt);
  }
  next();
});
userSchema.statics.signInByUsername = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user || user === null) {
      throw { error: "Invalid username!" };
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      throw { error: "Invalid password" };
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    return { user, token };
  } catch (error) {
    throw error;
  }
};
userSchema.statics.findAndCreate = async ({
  id,
  displayName,
  provider,
  emails,
}) => {
  let result = null;
  await User.find({ id }).then(async (r) => {
    if (r.length>0) {
      result = r[0];
    } else {
      let email = null;
      if (typeof emails !== "undefined") {
        email = emails[0].value;
      }
      await User.create({
        id,
        displayName,
        from: provider,
        email,
      })
      .then((rr) => {
        result = rr;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
  return result;
};
const User = mongoose.model("User", userSchema);
//Export the model
module.exports = User;
