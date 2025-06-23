const express = require("express");
// creating server
const app = express();
const port = 3000;

// middleware
// app.use((req, res) => {
//   res.send("Hello From the server!..");
// });

app.get("/", (req, res) => {
  res.json([
    {
      message: "message send ",
    },
  ]);
});
app.get("/random.text", (req, res) => {
  res.send("random.text");
});

app.all("/app", (req, res) => {
  console.log("you coming from", req.method);
  res.send("Hello123").status(200);
});

const add = (req, res, next) => {
  console.log("the response will be sent by the next function ...");
  next();
};
app.get("/example/b", add, (req, res) => {
  res.send("Hello from B!");
});

app.listen(port);
