const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    //route handler
    //res.send("route handler 1");
    next();
  },
  (req, res, next) => {
    res.send("route handler 2");
    next();
  },
  (req, res, next) => {
    // res.send("route handler 3");
  }
);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000.....`);
});
