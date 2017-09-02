const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.getCatalog = async (req, res) => {
	res.redirect('/catalog/Mac/page/1');
}

exports.getCatalogPages = async (req, res) => {
	const sort = (req.query.sort ? req.query.sort : 'created');
	let sample = {};
	const type = req.params.type;
	const modelSlug = req.params.modelSlug || null;
	sample.type = type;
	if (modelSlug) {
		sample.modelSlug = modelSlug;
	}
	const page = req.params.page || 1;
	const limit = 6;
	const skip = ( page * limit ) - limit;
	const productsPromise = Product.find(sample)
		.skip(skip)
		.limit(limit)
		.select('name photo price _id')
		.sort({[sort]: 'desc'});
	const modelsPromise = await Product.getModels(type);
	const productsCountPromise = Product.count(sample);
	const [ count, products, models ] = await Promise.all( [ productsCountPromise, productsPromise, modelsPromise ]);
	const pages = Math.ceil( count / limit );
	if (req.query.axs) {
		if (!products.length && skip) return;
		res.render('partials/productsList', {name: 'catalog', products, page, pages, count, type, models, modelSlug, sort}, function(err, html){
			res.send(html);
		});
	} else{
		if (!products.length && skip) {
			res.redirect(`/catalog/${type}/page/${pages}`);
			return;
		}
		res.render('catalog', {name: 'catalog', products, page, pages, count, type, models, modelSlug, sort});
	}	
}
