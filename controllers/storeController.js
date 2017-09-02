const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.getStoreEditor = (req, res) => {
	res.render('admin/editStore', {name: 'admin'});
}

exports.deleteStore = async (req, res) => {
	await Store.remove({_id: req.params.id});
	res.send('Магазин успешно удалён');
}

exports.getUpdateStoreEditor = async (req, res) => {
	const store = await Store.findById(req.params.id);
	res.render('admin/editStore', {name: 'admin', store});
}

exports.getStore = async (req, res) => {
	const store = await Store.findOne({slug: req.params.slug});
	res.render('store', {name: 'store', store});
}

exports.addStore = async (req, res) => {
	req.body.location.type = 'Point';
	console.log(req.body);
	const store= await (new Store(req.body).save());
	res.send('Success');
}

exports.updateStore = async (req, res) => {
	req.body.location.type = 'Point';
	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body);
	console.log(store);
	res.send('Магазин успешно обновлён!');
}

exports.mapStores = async (req, res) => {
	const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
	const q = {
		location: {
			$near: {
				$geometry: {
					type: 'Point', 
					coordinates
				},
				$maxDistance: 10000
			}
		}
	};
	const stores = await Store.find(q).select('slug description location name photo').limit(10);
	res.send(stores);
}