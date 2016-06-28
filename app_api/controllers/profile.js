var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

	if (!req.payload._id) {
		res.status(401).json({
			"message" : "UnauthorizedError: private profile"
		});
	} else {
		User
			.findById(req.payload._id)
			.exec(function(err, user) {
				res.status(200).json(user);
			});
	}

};

module.exports.getProfile = function(req, res) {

	User
		.findById(req.params.id)
		.exec(function(err, user) {
			if (user)
				res.status(200).json(user);
			else {
				res.status(400).json({
					"message" : "BadRequestError: User not found"
				});
			}
		});

	// User.find({"_id": req.params.id}, function(err, users) {
	// 	console.log(users);
	// })

};