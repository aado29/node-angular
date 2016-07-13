var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var services = {};

services.register = function(req, res) {
	if(!req.body.name || !req.body.email || !req.body.password) {
		res.status(400).json({
			"message": "BadRequestError: All fields required"
		});
		return false;
	}
	var user = new User();

	user.name = req.body.name;
	user.email = req.body.email;

	user.setPassword(req.body.password);

	user.save(function(err) {
		if (err) {
			res.status(400).json(err);
			return false;
		} else {
			var token = user.generateJwt();
			res.status(200).json({
				"token" : token
			});
		}	
	});
}

services.login = function(req, res) {
	if(!req.body.email || !req.body.password) {
		res.status(400).json({
			"message": "BadRequestError: All fields required"
		});
		return false;
	}

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			res.status(400).json(err);
			return false;
		}
		if(user){
			var token = user.generateJwt();
			res.status(200).json({
				"token" : token
			});
		} else {
			res.status(401).json(info);
			return false;
		}
	})(req, res);
}

services.facebook = function(req, res) {
	passport.authenticate('facebook', function(err, user, info) {
		if (err) {
			res.status(400).json(err);
			return false;
		}
		if(user){
			var token = user.generateJwt();
			res.status(200).json({
				"token" : token
			});
		} else {
			res.status(401).json(info);
			return false;
		}
	})(req, res);
}

module.exports = services;