const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dayCreated: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
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
  const user = await User.findOne({ username });
  if (!user||user===null) {
    throw new Error({ error: "Invalid username!" });
  }
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid password" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  return {user,token};
};
const User = mongoose.model("User", userSchema);
//Export the model
module.exports = User;
