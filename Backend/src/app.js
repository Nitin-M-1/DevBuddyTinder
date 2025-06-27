const express = require("express");
const { adminAuth } = require("./middleware/middleware");
const { userModel } = require("./model/user");
const { DB } = require("./config/Databases");
const helmet = require("helmet");
const validator = require("validator");
const { validateSignUpData } = require("../utils/Validation");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const app = express();
var jwt = require("jsonwebtoken");
// every single time hit
app.use((req, res, next) => {
  console.log("Always runs");
  next();
});

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
//-----------------------------routes------------------------------
app.post("/signup", async (req, res) => {
  // Use for registering new user

  // Validation

  try {
    const userObj = req.body;
    validateSignUpData(req);
    userObj.password = await bcrypt.hash(userObj.password, 10);
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

// Login-API

app.post("/login", async (req, res) => {
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
      expiresIn: "10s",
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

app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  try {
    if (!cookies.token) throw new Error("Invalid Credentials");

    const decodedMessage = await jwt.verify(cookies.token, "Dev@Tinder#129");
    const { _id } = decodedMessage;

    const user = await userModel.findById(_id);
    if (!user) throw new Error("Invalid User please Login Again!.");

    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
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
      if (key == "photURL") {
        if (!validator.isURL(updateData.photURL)) {
          throw new Error("invalid URL");
        }
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
