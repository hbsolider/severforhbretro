const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const keys = require("./config");
const passportInit = () => {
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
};
const facebookPassport = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.FACEBOOK.clientID,
        clientSecret: keys.FACEBOOK.clientSecret,
        callbackURL: "/api/user/auth/facebook/callback",
        profileFields: ["id", "displayName"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const profi = await User.findAndCreate(profile);
          return cb(null, profi);
        } catch (error) {
          console.log('err',error)
          return cb(null, profile);
        }
      }
    )
  );
};
const googlePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.GOOGLE.clientID,
        clientSecret: keys.GOOGLE.clientSecret,
        callbackURL: "/api/user/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const profi = await User.findAndCreate(profile);
          return cb(null, profi);
        } catch (error) {
          return cb(null, profile);
        }
      }
    )
  );
};
module.exports = {
  config: () => {
    passportInit();
    facebookPassport();
    googlePassport();
  },
};
