const express = require("express");
const { adminAuth, userAuth } = require("../middleware/middleware");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  res.send("Important Data send " + req.user);
});

module.exports = requestRouter;