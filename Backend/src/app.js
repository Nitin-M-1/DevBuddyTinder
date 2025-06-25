const express = require("express");
const { adminAuth } = require("./middleware/middleware");
const { userModel } = require("./model/user");
const { DB } = require("./config/Databases");
const helmet = require("helmet");

const app = express();



// every single time hit 
app.use((req, res, next) => {
  console.log("Always runs");
  next();
});


app.use(express.json());
app.use(helmet());




//-----------------------------routes------------------------------
app.post("/signup", async (req, res) => {
  const userObj = req.body;
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






// DB Connection 
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

// creating DB connection
// create schema
// create model
// create new instance of this model
