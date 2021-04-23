const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
})

//OnSave Encrypt Password
userSchema.pre('save', function(next) {
	const user = this

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err)
		}

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) {
				return next(err)
			}

			user.password = hash
			next()
		})
	})
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return callback(err)
		}

		callback(null, isMatch)
	})
}

const ModelClass = mongoose.model('user', userSchema)

module.exports = ModelClass
