const express = require("express");
const { adminAuth } = require("./middleware/middleware");
const { userModel } = require("./model/user");

// connecting DB
const { DB } = require("./config/Databases");
const app = express();

DB()
  .then(() => {
    console.log("DB is connected.");
    app.listen(port, () => {
      console.log("Server is running..");
    });
  })
  .catch(() => {
    console.log("error in code DB ");
    process.exit(1); // Optional: exit if DB connection fails
  });



app.use("/admin", adminAuth);

const port = 3000;

app.get("/admin/get-all-user", (req, res) => {
  res.send("get all user");
});

app.get("/admin/delete-all-user", (req, res) => {
  res.send("delete all user");
});

app.get("/abc", (req, res) => {
  res.send("getting information about user ");
});

app.get("/user", (req, res) => {
  res.status(200).send("delete-user-data");
});
app.get("/user/:id", (req, res) => {
  res.send(req.params.id);
});
