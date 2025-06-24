const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  //   try {
  //     throw new Error("new Error 💋");
  //     res.send("HELLO");
  //   } catch (error) {
  //     res.status(300).json({
  //       message: "error in code please fix this.",
  //     });
  //   }

  throw new Error("new Error 💋");
  res.send("HELLO");
});



app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong go to log monitor 📺");
  }
});


app.listen(3000);
