var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var bcrypt= require('bcrypt');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
require('dotenv').config()
var flash = require('connect-flash');

mongoose.connect("mongodb://127.0.0.1:27017/Login_singup", (err) => {
console.log(err ? err : "connected to database");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session for cookies

app.use(session({
  secret : process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  // store: MongoStore.create({ clientPromise })
   store: new MongoStore({mongooseConnection:mongoose.connection})
}));

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
