const express = require("express");

const app = express();

const port = 3000;
app.get("/user", (req, res) => {
  res.send("getting information about user ");
});

app.get("/api", (req, res) => {
  res.status(404).send("404 Not Found");
});
app.delete("/user", (req, res) => {
  res.status(200).send("delete-user-data");
});

app.listen(port, () => {
  console.log("Server is running..");
});
