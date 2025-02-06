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

//find user by email.

app.get("/user", async (req, res) => {
  //const user = req.body;
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

//find user by first Name.
app.get("/userbyfname", async (req, res) => {
  const userName = req.body.firstName;
  const fname = await User.find({ firstName: userName });
  res.send(fname);
});

//find user by last Name.
app.get("/userbylastname", async (req, res) => {
  const lastN = req.body.lastName;
  try {
    const user = await User.find({ lastName: lastN });
    if (user === 0) {
      res.send("User not found...");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong...");
  }
});

//find user by last Name.
app.get("/userbyage", async (req, res) => {
  const userAge = req.body.age;
  try {
    if ((userAge.length = 0)) {
      res.status(400).send("User with this age is not found.");
    } else {
      const user = await User.findOne({ age: userAge });
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong.");
  }
});

//delete a user through id.
app.delete("/deleteuser", async (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  if (userId == 0) {
    res.status(400).send("User not found");
  } else {
    await User.findByIdAndDelete(userId);
    res.status(200).send("User is deleted.");
  }
});

//update a user through a id.
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  console.log(data);
  try {
    await User.findByIdAndUpdate(userId, data);
    res.send("user updated successfully.");
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

//read the data from the mongoDB database.
app.get("/feed", async (req, res) => {
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
  const users = await User.find({});
  res.send(users);
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
