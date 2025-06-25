const express = require("express");
const { adminAuth } = require("./middleware/middleware");
const { userModel } = require("./model/user");
const { DB } = require("./config/Databases");
const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "ganesh",
    lastName: "prabhu",
    password: "123456789",
    age: "21",
    gender: "male",
  };
  //   Creating new instance of userModel
  const user = new userModel(userObj);

  try {
    await user.save();
    res.json({
      message: "data save",
      status: true,
      userObj,
    });
  } catch (error) {
    res.status(401).json({
      message: "error to store data",
    });
  }
});

console.log("Trying to connect to DB...");
DB()
  .then(() => {
    console.log("DB is connected.");
    app.listen(3000, () => {
      console.log("server is running ");
    });
  })
  .catch((err) => {
    console.log("error in code DB ", err);
    process.exit(1);
  });



  