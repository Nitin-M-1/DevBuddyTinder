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
      message: error._message,
    });
  }
});

// get email id

app.get("/user-email", async (req, res) => {
  try {
    const userModelData = await userModel
      .findOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
      .exec();
    if (!userModelData) {
      res.status(401).send({
        message: "not found!.😢",
        status: "❌user not found!❌",
      });
    }
    res.send({
      firstName: userModelData.firstName,
      lastName: userModelData.lastName,
      emailId: userModelData.emailId,
    });
  } catch (error) {
    res.status(401).send({
      message: "Error 404",
      error,
    });
  }
});
// get User By Id
app.get("/single-user-by-id", async (req, res) => {
  const userId = req.body.userId; // Should print your userId
  try {
    const userData = await userModel.findById(userId);
    console.log(userData);
    res.send(userData);
  } catch (error) {
    res.send({
      message: "error in code ",
      error,
    });
  }
});

// get all users
app.get("/feed", async (req, res) => {
  // creating instance of db
  try {
    // sending Request to get all data
    const userData = await userModel.find();
    res.send(userData);
  } catch (error) {
    res.send("error in code", error);
  }
});

// delete User from the database base on ID

app.delete("/delete-user-by-id", async (req, res) => {
  try {
    const userId = req.body.userId;
    const dbUser = await userModel.deleteOne({ _id: userId });
    console.log(dbUser);
    if (!dbUser) {
      // invalid User
      res.send({
        message: "invalid user",
      });
    }
    res.json({
      message: "user is deleted!.",
      data: dbUser,
    });

    res.send(userId);
  } catch (error) {
    res.json({
      message: "error",
      error,
    });
  }
});
// update API
app.patch("/update-user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const { ...updateData } = req.body; // Destructure userId and get the rest as updateData
    console.log(userId, updateData);
    const ALLOWED_UPDATE = [
      "photURL",
      "gender",
      "about",
      "skill",
      "age",
      "password",
    ];
    // Validate checking is allowed or not
    Object.keys(updateData).forEach((key) => {
      if (!ALLOWED_UPDATE.includes(key)) {
        throw new Error("Can't Update");
      }
      if (updateData?.skill.length > 5) {
        console.log("---------------------->");
        throw new Error("skill length is greater then 5");
      }
    });
    //
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({ message: err.message });
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
