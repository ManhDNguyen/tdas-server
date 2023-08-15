const mongoose = require("mongoose");

const connectDatabase = () => {
  try {
    mongoose.connect(
      "mongodb+srv://server:M6itL9TnBsDwWEvh@cluster0.ubi3g7m.mongodb.net/?retryWrites=true&w=majority",
      { useUnifiedTopology: true, useNewUrlParser: true }
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDatabase;
