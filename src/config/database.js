const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vinodpatil2101:owrimhP9lL6rAlGX@pronamastenode.jbazw.mongodb.net/devTinderBackend"
  );
};

module.exports = connectDB;
