const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const ErrorObject = require("./utils/error");
const ErrorHandler = require("./contollers/error-controller");

const userRouter = require("./routes/user-routes");

app.use(express.json());

// setup the logger
let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  const err = new ErrorObject(`http:localhost:5000${req.url} not found`, 400);
  next(err);
});

app.use(ErrorHandler);

module.exports = app;
