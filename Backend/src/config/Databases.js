const mongoose = require("mongoose");
// Step
// connecting with DB
// creating Schema
// compling schema into model

const DB = () => {
  return mongoose.connect(
    "mongodb+srv://keviljop9191:LQtPNYPWRkrJwx92@cluster0.zv9t0uv.mongodb.net/devtinder"
  ); 
};

module.exports = { DB };
