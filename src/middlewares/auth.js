const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
  console.log("Authorization checked...");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized user...");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  //read the token from the req cookies
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$0823");
    //valiadate the token
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
  //Find the user
};

module.exports = { adminAuth, userAuth };
