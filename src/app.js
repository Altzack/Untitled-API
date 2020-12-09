require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const watchlistRouter = require("./watchlist/watchlist-router");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";
app.use(cors());

app.use(morgan(morganOption));
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/watchlist", watchlistRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

module.exports = app;
