const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: { type: String },
  password: { type: String },
  age: { type: String },
  emailId: {type:String},
  gender: { type: String },
});

// Creating Model
const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };