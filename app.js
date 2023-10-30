require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
const hbs = require("hbs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let session = require("express-session");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
let menuRouter = require("./routes/menu");

var app = express();

hbs.registerPartials(path.join(__dirname, "views/partials"), (err) => {});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/menu", menuRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Connecting to mongodb:
mongoose
  .connect(`${process.env.URL}`)
  .then(() =>
    app.listen(() => {
      console.log("Connected to mongodb");
    })
  )
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
