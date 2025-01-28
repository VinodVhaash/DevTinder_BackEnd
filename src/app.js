const express = require("express");

const app = express();

app.use("/hello/about/do", (req, res) => {
  res.send("do from the server...");
});

app.use("/hello/about", (req, res) => {
  res.send("about from the server...");
});

app.use("/hello", (req, res) => {
  res.send("hello from the server...");
});

app.use("/test", (req, res) => {
  res.send("Test from the server...");
});

app.use("/", (req, res) => {
  res.send("slash from the server...");
});

app.use((req, res) => {
  res.send("Hiiiiiiiii from the server...");
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000.....`);
});
