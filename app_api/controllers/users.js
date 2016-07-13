var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var _ = require('lodash');
var services = {};

services.getUsers = function(req, res) {
	User
		.find()
		.exec(function(err, users) {
			if (err) {
				res.status(400).json(err);
				return;
			} else {
				if (users) {
					res.status(200);
					res.json(_.omit(users, 'hash'));
				} else {
					res.status(400);
					res.json({
						"message" : "BadRequestError: Users not found"
					});
				}
			}
		});
}

services.getUser = function(req, res) {
	User
		.findById(req.payload._id)
		.exec(function(err, user) {
			if (err) {
				res.status(400).json(err);
				return;
			} else {
				if (user) {
					res.status(200);
					res.json(user);
				} else {
					res.status(400);
					res.json({
						"message" : "BadRequestError: User not found"
					});
				}
			}
		});
}

services.getUserById = function(req, res) {
	var id = req.params.id;
	
	User
		.findById(id)
		.exec(function(err, user) {
			if (err) {
				res.status(400).json(err);
				return;
			} else {
				if (user) {
					res.status(200);
					res.json(user);
				} else {
					res.status(400);
					res.json({
						"message" : "BadRequestError: User not found"
					});
				}
			}
		});
}

services.updateUser = function(req, res) {
	var id = req.params.id,
		set = {
			name: req.body.name,
			email: req.body.email,
		};

	if (!req.body.name || !req.body.email) {
		res.status(400);
		res.json({ 
			"message": "All fields required" 
		});
		return;
	} else {
		if (req.payload._id == id) {
			User
				.update( { _id: id }, { $set: set } )
				.exec( function (err, data) {
					if (err) {
						res.status(400).json(err);
						return;
					} else {
						if (data) {
							res.status(200);
							res.json(data);
						} else {
							res.status(400);
							res.json({ 
								"message" : "BadRequestError: User not found" 
							});
						}
					}
				} );
		} else {
			res.status(401);
			res.json({
				"message": "UnauthorizedError: No authorization token"
			});
		}
	}
}

services.removeUser = function(req, res) {
	var id = req.params.id;

	if (req.payload._id !== id) {
		User
			.remove( { _id: id } )
			.exec( function (err, data) {
				if (err) {
					res.status(400).json(err);
				} else {
					if (data) {
						res.status(200);
						res.json(data);
					} else {
						res.status(400);
						res.json({ 
							"message" : "BadRequestError: User not found" 
						});
					}
				}
			});
	} else {
		res.status(401);
		res.json({
			"message": "UnauthorizedError: Private data"
		});
	}
}

services.recoveryPassUser = function(req, res) {
	var id = req.params.id,
		salt = req.params.salt;

	if (id === req.payload._id && salt === req.payload.salt) {
		if (!req.body.password) {
			res.status(400);
			res.json({
				"message": "All fields required"
			});
			return;
		} else {
			var password = req.body.password,
				set = {
					hash: crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex')
				};

			User
				.update( { _id: id }, { $set: set } )
				.exec( function (err, data) {
					if (err) {
						res.status(400).json(err);
						return;
					} else {
						if (data) {
							res.status(200);
							res.json(data);
						} else {
							res.status(400);
							res.json({
								"message" : "BadRequestError: User not found"
							});
						}
					}
				} );
		}
	} else {
		res.status(401).json({
			"message" : "UnauthorizedError: Private profile"
		});
	}
}

module.exports = services;