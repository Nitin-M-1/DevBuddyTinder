const express = require("express");
const bcrypt = require("bcryptjs");
const { userModel } = require("../model/user");
const authRouter = express.Router();
const { validateSignUpData } = require("../../utils/Validation");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const validator = require("validator");
const { adminAuth, userAuth } = require("../middleware/middleware");

authRouter.post("/signup", async (req, res) => {
  // Use for registering new user
  // Validation
  try {
    const userObj = req.body;
    validateSignUpData(req);
    userObj.password = await userModel.hashPassword(userObj.password);
    const user = new userModel(userObj);
    await user.save();
    res.json({
      message: "data save",
      status: true,
      userObj,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  // take user input

  try {
    const { emailId, password } = req.body;

    // if (!emailId || !password) throw new Error("Invalid Email Id or Password");
    if (!validator.isEmail(emailId))
      throw new Error("Invalid Email Id or Credentials");

    const userModelData = await userModel.findOne({ emailId });

    // if (!userModelData) {
    //   throw new Error("Invalid Credentials.");
    // }

    const isMatch = await bcrypt.compare(password, userModelData.password);

    if (!isMatch) {
      throw new Error("Invalid Password Credentials.");
    }

    const token = await jwt.sign({ _id: userModelData._id }, "Dev@Tinder#129", {
      expiresIn: "20m",
    });

    console.log(token);
    res.cookie("token", token);
    res.send("Login SuccessFull!.123");
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    if (!req.user) throw new Error("Jump To Login Page ");
    res
      .cookie("token", null, {
        expires: new Date(0),
      })
      .send("user logout Successfully✅ ");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = authRouter;
