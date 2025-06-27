var jwt = require("jsonwebtoken");
const { userModel } = require("../model/user");

const adminAuth = (req, res, next) => {
  if (req.query.prev == "admin") next();
  else res.status(401).send("❌you are not admin❌");
};

const userAuth = async (req, res, next) => {
  // Read the token from the req cookies

  try {
    const { token } = req.cookies;
    if (!token) throw new Error("token is not valid!.");
    const decodedMessage = await jwt.verify(token, "Dev@Tinder#129");
    const { _id } = decodedMessage;
    const user = await userModel.findById(_id);
    if (!user) throw new Error("Invalid User please Login Again!.");
    req.user = user
    next();
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
};

module.exports = { adminAuth, userAuth };
