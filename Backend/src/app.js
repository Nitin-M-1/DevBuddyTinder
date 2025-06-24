const express = require("express");

const app = express();

const port = 3000;
app.get("/abc", (req, res) => {
  res.send("getting information about user ");
});

app.get("/user", (req, res) => {
  res.status(200).send("delete-user-data");
});
app.get("/user/:id", (req, res) => {
  res.send(req.params.id);
});

app.listen(port, () => {
  console.log("Server is running..");
});
