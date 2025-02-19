const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

//profile api.
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong...");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser.firstName);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser.firstName);
    await loggedInUser.save();
    //res.send(loggedInUser.firstName + ", your profile updated successfully.");
    res.json({
      message: loggedInUser.firstName + ", your profile updated successfully. ",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error:" + Error);
  }
});

module.exports = profileRouter;
