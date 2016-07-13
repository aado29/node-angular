var mongoose = require( 'mongoose' );

var userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	principal_food: String,
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: true
	},
	date_joined: {
		type: Date,
		default: Date.now()
	},
	hash: String,
	salt: String
});

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

mongoose.model('Restaurants', userSchema);
