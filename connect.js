// connect.js
const mongoose = require("mongoose");

const connectToMongoDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = { connectToMongoDB };
