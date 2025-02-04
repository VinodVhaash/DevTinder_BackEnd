const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  //creating a new instance of a User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
  });
  try {
    await user.save();
    res.status(200).send("User added successfully.");
  } catch (err) {
    res.status(400).send("User not inserted..." + err.message);
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Example app listening on port 3000.....`);
    });
    console.log("Database connection established...");
  })
  .catch((err) => {
    console.log("Database can not be connected !!!");
  });
