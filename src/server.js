import express from "express";

const app = express();

const hostname = "localhost";
const port = 8017;

app.get("/", (req, res) => {
  res.send("<h1>Hello Duc Phong DEV</h1>");
});

app.listen(port, hostname, () => {
  console.log(`Hello, I am running server at http://${hostname}:${port}`);
});