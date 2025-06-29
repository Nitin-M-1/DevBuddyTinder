const express = require("express");
const { adminAuth, userAuth } = require("../middleware/middleware");
const { userModel } = require("../model/user");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const validator = require("validator");
// View Profile
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// profile Edit
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    const updateData = {};
    const allowedFields = [
      "skill",
      "about",
      "photURL",
      "gender",
      "age",
      "password",
    ];
    const keys = Object.keys(req.body);
    if (keys.length > allowedFields.length)
      throw new Error("maximum number of field ");

    for (const key of keys) {
      if (allowedFields.includes(key)) {
        if (key === "password") {
          updateData[key] = await userModel.hashPassword(req.body[key]);
        } else {
          updateData[key] = req.body[key];
        }
      }
    }
    const user = await userModel.findByIdAndUpdate(req.user, updateData, {
      new: true,
    });
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});

// update-password! - api
profileRouter.patch("/forget-password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      throw new Error("invalid Password please Check ");

    const isOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!isOldPasswordMatch) throw new Error("invalid old password ");
    if (!validator.isStrongPassword(newPassword))
      throw new Error("new Password is not strong");
    const newHashPassword = await userModel.hashPassword(newPassword);
    const user = await userModel.findByIdAndUpdate(
      req.user,
      { password: newHashPassword },
      {
        new: true,
      }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = profileRouter;







