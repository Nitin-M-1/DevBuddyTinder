const mongoose = require("mongoose");
var validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: 2,
      maxlength: 10,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      minlength: 2,
      maxlength: 20,
    },

    password: { type: String, required: true, minlength: 7, maxlength: 30 },

    age: { type: Number, required: true, min: 18, max: 70 },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },

    gender: { type: String, required: true, enum: ["male", "female", "other"] },

    //  i can use validator ( but it called only once ) instead of enum
    photURL: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/398/577/non_2x/man-avatar-clipart-illustration-free-png.png",
    },
    about: {
      type: String,
      default: "Bio",
    },
    skill: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Creating Model
const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
