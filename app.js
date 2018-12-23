const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./api/routes/user");

const config = require('./config');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure which db to use based on env variable. 
var dbName = config.DEV_DB;
if (process.env.NODE_ENV === "test") {
  dbName = config.TEST_DB
} 
mongoose.connect("mongodb+srv://user1:" + config.MONGO_ATLAS_PW + "@ivylifts-cmrfp.mongodb.net/", 
  {
    dbName: dbName,
    useNewUrlParser: true
  }
);
mongoose.Promise = global.Promise;

// Catches COR related errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/user", userRoutes);

// Catches any errors when using the wrong route
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;