const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.getContacts = (req, res) => {
	res.render('contacts', {name: 'contacts'});
}

exports.getStoreContacts = async (req, res) => {
	const store = await Store.findOne({slug: req.params.slug});
	res.render('contacts', {name: 'contacts', store});
}