const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    //validation of data.
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password.
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //creating a new instance of a User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // if (req.body.skills.length > 3) {
    //   throw new Error("More than 3 skills not allowed");
    //}
    await user.save();
    res.status(200).send("User added successfully.");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    console.log(user);
    if (!user) {
      throw new Error("EmailId is not present");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create a JWT token.
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$0823");

      console.log(token);
      //Add the token to cookie and the send the response back to the user.
      res.cookie("token", token);
      res.send("Login successfull.");
    } else {
      throw new Error("Password is not correct.");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

//profile api.
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    //validate my token.
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$0823");
    const { _id } = decodedMessage;
    console.log("Logged in user is:" + _id);
    console.log(decodedMessage);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found!!");
    }
    res.send(user);
    console.log(cookies);
    res.send("cookie recived.");
  } catch (err) {
    res.status(400).send("Something went wrong...");
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
    const ALLOWED_UPDATES = ["userId", "age", "gender", "about"];
    const isAllowedUpdates = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowedUpdates) {
      console.log(isAllowedUpdates);
      throw new Error("Update is not allowed");
    }
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
