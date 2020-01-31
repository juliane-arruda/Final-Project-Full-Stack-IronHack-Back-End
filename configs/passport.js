const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // !!!
const passport = require('passport');
const User = require('../models/user');

const func = (() => console.log("passport"))

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  console.log('ok')
  User.findOne({
    username,
  }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, {
        message: 'Incorrect username.',
      });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, {
        message: 'Incorrect password.',
      });
      return;
    }

    next(null, foundUser);
  });
}));

