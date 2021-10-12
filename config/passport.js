const passport = require("passport");
const LocalStrategy = require("passport-local");

const connection = require("./database");
const validatePassword = require("../lib/passwordUtils").validatePassword;
const User = connection.models.User;

const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

const verifyCallback = (username, password, done) => {
  User.findOne({ username })
    .then((user) => {
      if (!user) return done(null, false);

      const isValid = validatePassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
