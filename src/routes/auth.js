const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("EmailId is not present");
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a JWT token.
      const token = await user.getJWT();
      //Add the token to cookie and the send the response back to the user.
      res.cookie("token", token);
      res.send("Login successfull." + user);
    } else {
      throw new Error("Password is not correct.");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out successfully");
});

module.exports = authRouter;
