const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.getProduct = async (req, res) => {
	const phone = await Product.findById(req.params.id).populate('reviews');
	const recomendations = await Product.getRecomendations(phone);
	res.render('product', {name: 'product', phone, recomendations});
}

exports.deleteProduct = async (req, res) => {
	await Product.remove({_id: req.params.id});
	res.send('Товар успешно удалён');
}

exports.getProductEditor = (req, res) => {
	res.render('admin/editProduct', {name: 'admin'});
}

exports.getUpdateProductEditor = async (req, res) => {
	const product = await Product.findById(req.params.id);
	res.render('admin/editProduct', {name: 'admin', product});
}

exports.addProduct = async (req, res) => {
	const product= await (new Product(req.body).save());
	console.log(product);
	res.send('Success');
}

exports.updateProduct = async (req, res) => {
	const product= await Product.findOneAndUpdate({_id: req.params.id}, req.body, {
		new: true,
		runValidators: true
	}).exec();
	res.send('Success');
}

exports.heartedProducts = async (req, res) => {
	const products = await Product.find({ _id: { $in: req.user.hearts } }).select('_id photo price name');
	res.render('catalog', {name: 'catalog', products, hearted: true});
}

exports.getShoppingCart = async (req, res) => {
	const products = await Product.find({ _id: { $in: req.user.shoppingCart } });
	res.render('order', {name: 'order', products});
}