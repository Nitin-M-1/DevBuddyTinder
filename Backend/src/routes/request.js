const express = require("express");
const { adminAuth, userAuth } = require("../middleware/middleware");
const ConnectionRequestModel = require("../model/connectionRequest");
const requestRouter = express.Router();
const { userModel } = require("../model/user");
const { Model, mongoose } = require("mongoose");
const { equals } = require("validator");
const reviewId = requestRouter.post(
  "/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // status can be ignored or interested!..
      const fromUser = req.user._id;
      const toUser = req.params.toUserId;
      const status = req.params.status;

      if (!["interested", "ignore"].includes(status))
        throw new Error("Bad Request: invalid status type " + status);
      // Validation : checking user is present of not ?
      const isUserPresent = await userModel.findOne({ _id: toUser });
      if (!isUserPresent) throw new Error(" Invalid User bad Request ");

      // Checking if connection already exists
      const isConnectionPresent = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUser, toUserId: toUser },
          { fromUserId: toUser, toUserId: fromUser },
        ],
      });

      if (isConnectionPresent) {
        throw new Error("Connection request already Exist");
      }

      // Create new connection request
      const connectionRequest = new ConnectionRequestModel({
        fromUserId: fromUser,
        toUserId: toUser,
        status, // e.g., "pending"
      });

      await connectionRequest.save();
      const data = await connectionRequest.save();
      res.send(data);
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  }
);



// for accepting or rejecting Request
requestRouter.post("/review/:status/:reviewId", userAuth, async (req, res) => {
  // http://localhost:3000/request/review/accepted/685f98f612b5de7e4ef33c77
  try {
    const status = req.params.status;
    const reviewId = new mongoose.Types.ObjectId(req.params.reviewId);
    if (!["accepted", "rejected"].includes(status))
      throw new Error("Invalid Status ");
    console.log({
      fromUserId: req.user._id,
      toUserId: reviewId,
    });
    const reviewUser = await userModel.findById(reviewId);
    if (!reviewUser) {
      throw new Error("User not found");
    }
    const isConnectionSendData = await ConnectionRequestModel.findOneAndUpdate(
      {
        fromUserId: reviewId,
        toUserId: req.user._id,
        status: "interested",
      },
      {
        $set: { status },
      },
      {
        new: true,
      }
    );
    if (!isConnectionSendData)
      throw new Error("Connection Request not found!.");
    res.send(isConnectionSendData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
module.exports = requestRouter;



