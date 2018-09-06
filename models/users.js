const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.plugin(uniqueValidator);

const Users = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = function(id, callback) {
  Users.findById(id, callback);
};

module.exports.getUserByEmail = (emailAddress, callback) => {
  const query = {email: emailAddress};
  Users.findOne(query, callback);
};

module.exports.addNewUser = function(newUser, callback) {
	bcrypt.getSaltSync(10, (err, salt) => {
		if(err){
			throw err;
		}
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err){
				throw err;
			} else {
				newUser.password = hash;
				newUser.save(callback);
			}
		})
	})
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
}