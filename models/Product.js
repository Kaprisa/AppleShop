const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Имя продукта не должно быть пустым'
	},
	type: {
		type: String,
		trim: true,
		required: 'Вам следует указать тип продукта'
	},
	model: String,
	modelSlug: String,
	description: {
		type: String,
		trim: true
	},
	photo: String,
	price: {
		type: Number,
		trim: true,
		required: 'Цена должна быть указана'
	},
	count: {
		type: Number,
		required: true,
	},
	characteristics: {
		color: String,
		memory: Number,
		height: Number,
		width: Number,
		weight: Number,
		others: [{
			name: String,
			value: String
		}]
	},
	created: {
		type: String,
		default: Date.now()
	}
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

productSchema.index({
	name: 'text',
	type: 'text'
});

productSchema.pre('save', function(next){
	this.modelSlug = this.model.replace(/\s/g, '').toLowerCase();
	next();
});

productSchema.virtual('availability')
	.get(function(){
		return (this.count > 0);
	});

productSchema.virtual('stars') 
	.get(function(){
		const reviews = this.reviews;
		const length = reviews.length;
		if (!length) return 0;
		let sum = 0;
		reviews.forEach( review => {
			sum += review.rating;
		});	
		return Math.ceil( sum / length );
	});

productSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product'
});


productSchema.statics.getRecomendations = function(product){
	return this.find({model: product.model}).limit(3);
}

productSchema.statics.getTypes = function(){
	return this.aggregate(
		{ $group: { _id: '$type' } }
	);
}

productSchema.statics.getModels = function(type){
	return this.aggregate(
		{ $match: { type: type } },
		{ $group: { _id: '$modelSlug', model: { $first: '$model'}, subitems: { $addToSet: '$characteristics.memory'}} }
	);
}

module.exports = mongoose.model('Product', productSchema);