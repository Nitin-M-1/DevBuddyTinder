const express = require("express");
const app = express();
let data = 0;
app.get("/user", (req, res,next) =>{
    console.log("first function ")
    next()
})

app.get("/user", (req, res,next) =>{
    console.log("first function ")
    res.send("From second function ")
})

app.listen(3000);


