const express = require("express");
const app = express();
let data = 0;
app.get("/user", [
  (req, res, next) => {
    data++;
    console.log("Current value of data:", data);
    next();
    console.log("You calling me later ");
    // res.send("from first request");
  },
  (req, res, next) => {
    next();
    console.log(data);
    res.send(`Data: ${data}, de`);
  },
  (req, res) => {
    console.log("1--> Request");
  },
]);
app.listen(3000);
