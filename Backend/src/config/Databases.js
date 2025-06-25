const mongoose = require("mongoose");
// Step
// connecting with DB
// creating Schema
// compling schema into model

const DB = () => {
  return mongoose.connect(
    "mongodb+srv://keviljop9191:uKHN8uMfFPFoqlVK@cluster0.7jdzqk7.mongodb.net/devtinder",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

module.exports = { DB };
