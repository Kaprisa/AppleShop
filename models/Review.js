const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now()
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'Автор должен быть указан'
	},
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: 'Вам следует указать продукт'
	},
	text: {
		type: String,
		required: 'Ваш отзыв должен иметь текст'
	},
	rating: {
		type: Number,
		min: 1,
		max: 5
	}
});

function autopopulate(next) {
	this.populate('author');
	next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review', reviewSchema);