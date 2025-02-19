const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//Api for sending a connection request.
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  //Sending a connection request.
  console.log("Sending a connection request.");
  res.send(
    user.firstName + " " + user.lastName + " sent the connection request."
  );
});

module.exports = requestRouter;
