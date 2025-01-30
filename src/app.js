const express = require("express");

const app = express();
const { adminAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All data send...");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("User Deleted...");
});
app.listen(3000, () => {
  console.log(`Example app listening on port 3000.....`);
});
