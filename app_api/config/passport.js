var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')
var configAuth = require('./config.auth')

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (username, password, done) {
  User.findOne({ email: username }, function (err, user) {
    if (err) {
      return done(err)
    }
    // Return if user not found in database
    if (!user) {
      return done(null, false, {
        message: 'User not found'
      })
    }
    // Return if password is wrong
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Password is wrong'
      })
    }
    // If credentials are correct, return the user object
    return done(null, user)
  })
}
))

passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  User.findOne({ 'facebook.id': profile.id }, function (err, user) {
    if (err) {
      return done(err)
    }
    // Return if user not found in database
    if (!user) {
      return done(null, false, {
        message: 'User not found'
      })
    }
    // If credentials are correct, return the user object
    return done(null, user)
  })
}
))
