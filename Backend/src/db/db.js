const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to DB");
  } catch (err) {
    console.log("Error connecting DB: ", err);
  }
}

module.exports = connectDB;
