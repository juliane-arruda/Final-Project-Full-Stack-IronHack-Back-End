/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
require('./configs/rekognition');

const app = express();

const session = require('express-session');
const passport = require('passport');
require('./configs/passport');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((x) => {
    // eslint-disable-next-line no-console
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Error connecting to mongo', err);
  });

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
  // <== this will be the URL of our React app (it will be running on port 3000)
}));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'I cat your pet',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth-routes');
const pets = require('./routes/pet-route');

// include your new routes here:
app.use('/', require('./routes/photo-routes'));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', authRoutes);
app.use('/', pets);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});


module.exports = app;
