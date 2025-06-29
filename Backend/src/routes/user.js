const express = require("express");
const userRouter = express.Router();
const { adminAuth, userAuth } = require("../middleware/middleware");
const ConnectionRequestModel = require("../model/connectionRequest");
const mongoose = require("mongoose");
const requestRouter = require("./request");
const { userModel } = require("../model/user");
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    if (!req.user._id) throw new Error("Invalid User ");

    // const data = await ConnectionRequestModel.find({
    //   $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    //   status: "interested",
    // })
    //   .populate("toUserId", "firstName lastName emailId")
    //   .populate("toUserId", "firstName lastName emailId");

    const data = await ConnectionRequestModel.find({
      toUserId: req.user._id,
      status: "interested",
    })
      .populate("fromUserId", "firstName lastName photoURL") // populate sender's info
      .populate("toUserId", "firstName lastName photoURL"); // populate receiver's info

    // Populate

    //     "toUserId": {
    //     "_id": "685e2ebf6171bb883ba2aa46",
    //     "firstName": "Ritik",
    //     "lastName": " Singh",
    //     "emailId": "ritik.singh@example.com"
    // },

    res.send({
      message: "Request Successful ✅",
      data,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Connections API

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
      throw new Error("Invalid ID");

    const data = await ConnectionRequestModel.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
      status: "accepted",
    })
      .populate("fromUserId", "firstName lastName photURL") // populate sender's info
      .populate("toUserId", "firstName lastName photURL"); // populate receiver's info

    let arr = data.map((row) => {
      if (row.fromUserId.firstName == req.user.firstName) return row.toUserId;
      else return row.fromUserId;
    });
    res.send({
      data: arr,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pageNumber = req.query.page || 0;
    const pageLimit = req.query.limit <= 5 ? req.query.limit : 5 || 2;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    }).select("fromUserId toUserId");
    const hideUserFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFeed.add(req.fromUserId.toString());
      hideUserFeed.add(req.toUserId.toString());
    });
    hideUserFeed.add(req.user._id);
    const users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFeed) } },
          { _id: { $ne: req.user._id } },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageLimit)
      .limit(pageLimit);

    res.send(users);
  } catch (error) {
    res.status(400).send({
      data: error.message,
    });
  }
});

module.exports = userRouter;
