const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');
//const Store = mongoose.model('Store');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true)
		} else {
			next({message: 'That file type Isn\'t allowed!'}, false)
		}
	}
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	if (!req.file) {
		next();
		return;
	}
	const extention = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extention}`;
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(259, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	next();
}

exports.fileUpload = (req, res) => {
	res.send(req.body.photo);
}

exports.searchProducts = async (req, res) => {
  const phones = await Product
	  .find({ $text: { $search: req.query.q } }, { score: { $meta: 'textScore' } })
	  .sort({ score: { $meta: 'textScore' } })
  	.limit(5);
  res.json(phones);
};

exports.likeProduct = async (req, res) => {
	const hearts = req.user.hearts ? req.user.hearts.map(obj => obj.toString()) : [];
	const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
	const user = await User
		.findByIdAndUpdate(
			req.user._id,
		 {[operator]: {hearts: req.params.id}},
		 {new: true}
		);
	res.json(user);
}

exports.addToCart = async (req, res) => {
	const products = req.user.shoppingCart ? req.user.shoppingCart.map( obj => obj.toString() ) : [];
	const operator = products.includes(req.params.id) ? '$pull' : '$addToSet';
	const user = await User
		.findByIdAndUpdate(
			req.user._id,
			{ [operator] : { shoppingCart: req.params.id } },
			{new: true}
		);
	const [ newCartData ] = await User.getUserWithShoppingCart(req.user._id).exec();
	const { count, total } = newCartData;
	res.send(`Товаров ${count} ( ${total} руб. )`);
}

exports.removeFromCart = async (req, res) => {
	const user = await User
		.findByIdAndUpdate(
			req.user._id,
			{ $pull: { shoppingCart: req.params.id } },
			{ new: true }
		);
		const { total, count } = await User.getUserWithShoppingCart(req.user._id);
		res.send(`Товаров ${count} ( ${total} руб. )`);
}

