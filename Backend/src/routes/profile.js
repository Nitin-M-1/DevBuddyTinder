const express = require("express");
const { adminAuth, userAuth } = require("../middleware/middleware");

const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = profileRouter;
