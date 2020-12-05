var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const apiRouter = require("./routes/api");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
// Import mongoose
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://wahyu:liburanyuk@cluster0-shard-00-00.tnbx4.mongodb.net:27017,cluster0-shard-00-01.tnbx4.mongodb.net:27017,cluster0-shard-00-02.tnbx4.mongodb.net:27017/db_liburanyuk?ssl=true&replicaSet=atlas-yelf3o-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db Connect");
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors({
  origin: "https://liburanyuk.vercel.app",
  methods: ['GET', 'PUT', 'POST']
}));
app;
app.use(methodOverride("_method"));
app.use(flash());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
// router end point me
app.use("/admin", adminRouter);
app.use("/api/v1/member", apiRouter);

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://liburanyuk.vercel.app");
  res.setHeader("Access-Control-Allow-Methoods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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

module.exports = app;
