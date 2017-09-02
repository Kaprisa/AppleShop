const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Пожалуйста, введите название магазина'
	},
	slug: String,
	photo: String,
	phone: String,
	businessHours: [{
		start: String,
		end: String
	}],
	description: {
		type: String,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now()
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [{
			type: Number,
			required: 'Вам следует указать координаты!'
		}],
		address: {
			type: String,
			required: 'Вам следует указать адрес!'
		}
	}

});

storeSchema.index({location: '2dsphere'});

storeSchema.pre('save', async function(next) {
	if (!this.isModified('name')){
		next();
		return;
	}
	this.slug = slug(this.name);
	const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const storesWithSlug = await this.constructor.find({slug: slugRegExp});
	if(storesWithSlug.length){
		this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
	}
	next();
});

module.exports = mongoose.model('Store', storeSchema)