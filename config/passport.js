const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Users = require('../models/users');
const keys = require('./keys');


module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = keys.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('jwt =', jwt_payload);
    Users.getUserById(jwt_payload.data._id, (err, user) => {
      if (err) {
        console.log('passport err =', err);
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  }));
};
