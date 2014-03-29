var User = require('./model/user-model');

module.exports = function(app, passport) {

  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(
    { 
      usernameField: 'email', 
      passwordField: 'password'
    }
    ,function(username, password, done) {
      // Get user by email
      User.getByEmail(username, function (err, user) {
        // Validate the response
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password !== password) { return done(null, false); }

        // If everything is ok, return the user
        console.log(user.email);
        console.log(user.firstname);
        console.log(user.lastname);
        return done(null, user);
      });
    }
  )); 
};