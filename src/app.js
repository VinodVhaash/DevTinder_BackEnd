const express = require("express");

const app = express();
app.get("/getUserData", (req, res) => {
  //error hadling using try catch
  try {
    throw new Error("dsdfsf");
    res.send("User data sent");
  } catch (err) {
    res.status(500).send("Some error occured...contact support team.");
  }
});

//error handler.
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong.");
  }
});
app.listen(3000, () => {
  console.log(`Example app listening on port 3000.....`);
});
