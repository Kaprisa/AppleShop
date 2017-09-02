const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.getHome = async (req, res) => {
	const phones = await Product.find().limit(6);
	res.render('index', {name: 'index', phones});
}