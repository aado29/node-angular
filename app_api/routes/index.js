var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
});

var passport = require('passport');

var userController = require('../controllers/users');
var authController = require('../controllers/authentication');

// Users

router.get('/users', auth, userController.getUsers);
// return a Json with all data about users

router.get('/user/current', auth, userController.getUser);
// return a Json with the current user data if then is logged in

router.get('/user/:id', userController.getUserById);
// return a Json with the user id req

router.put('/user/:id', auth, userController.updateUser);
// return 'true' if the user is updated, else 'false' if has an error

router.delete('/user/:id', auth, userController.removeUser);
// return 'true' if the user is removed, else 'false' if has an error

router.put('/user/password_recovery/:id/:salt', auth, userController.recoveryPassUser);
// return a json form users model if the password was changed

// authentication

router.post('/auth/register', authController.register);

router.post('/auth/local', authController.login);

// facebook authentication

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', authController.facebook);

module.exports = router;
