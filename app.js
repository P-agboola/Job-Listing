const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

app.use(express.json());

// setup the logger
let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

module.exports = app;
