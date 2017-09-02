const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const modgodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, 'Невалидный E-Mail'],
		required: 'Необходимо указать E-Mail'
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'author', 'editor', 'moderator'],
		default: 'user'
	},
	profile: {
		name: String,
		phone: String
	},
	resetPasswordToken: String,
	resetPasswordExpires: String,
	hearts: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Product'
	}],
	shoppingCart: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Product'
	}]
},
{
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

userSchema.virtual('gravatar')
	.get(function(){
		const hash = md5(this.email);
		return `https://s.gravatar.com/avatar/${hash}?s=40`;
	});

userSchema.statics.getUserWithShoppingCart = function(id){
	return this.aggregate(
		{ $match: { _id: id} },
		{ $unwind: '$shoppingCart'},
		{ $lookup: { from: 'products', localField: 'shoppingCart', foreignField: '_id', as: 'products' }},
		{ $project: {
			total: { $sum: '$products.price'}
		}},
		{ $group: { 
			_id: '$_id', 
			count: { $sum: 1 }, 
			total: { $sum: '$total'}
		}}
		)
	}

userSchema.plugin(passportLocalMongoose, { usernameField: 'email'});
userSchema.plugin(modgodbErrorHandler);

module.exports = mongoose.model('User', userSchema)