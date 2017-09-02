const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const homeController = require('../controllers/homeController');
const catalogController = require('../controllers/catalogController');
const productController = require('../controllers/productController');
const storeController = require('../controllers/storeController');
const contactsController = require('../controllers/contactsController');
const apiController = require('../controllers/apiController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router.get('/', catchErrors(homeController.getHome));
router.get('/catalog', catchErrors(catalogController.getCatalog));
router.get('/catalog/:type/page/:page', catchErrors(catalogController.getCatalogPages));
//router.get('/catalog/:type', catchErrors(catalogController.getCatalogByType));
router.get('/catalog/:type/:modelSlug/page/:page', catchErrors(catalogController.getCatalogPages));
//router.get('/catalog/:modelSlug', catchErrors(catalogController.getProductsByModel)); // переделаем на type model
//router.get('/catalog/:modelSlug/:memory', catchErrors(catalogController.getProductsByModelAndMemory)); //Это будет query

router.get('/product/:id', catchErrors(productController.getProduct));
router.delete('/product/:id', catchErrors(productController.deleteProduct));
router.get('/products/hearted', catchErrors(productController.heartedProducts));
router.get('/store/:slug', catchErrors(storeController.getStore));
router.delete('/store/:id', catchErrors(storeController.deleteStore));
router.get('/contacts', contactsController.getContacts);
router.get('/contacts/:slug', catchErrors(contactsController.getStoreContacts));

router.get('/admin/product/edit', userController.isAdmin, productController.getProductEditor);
router.get('/admin/product/edit/:id', userController.isAdmin, catchErrors(productController.getUpdateProductEditor));
router.get('/admin/store/edit', userController.isAdmin, storeController.getStoreEditor);
router.get('/admin/store/edit/:id', userController.isAdmin, catchErrors(storeController.getUpdateStoreEditor));
router.post('/product/add', catchErrors(productController.addProduct));
router.post('/store/add', catchErrors(storeController.addStore));
router.post('/product/add/:id', catchErrors(productController.updateProduct));
router.post('/store/add/:id', catchErrors(storeController.updateStore));

router.post('/api/product/:id/addToCart', catchErrors(apiController.addToCart));
router.delete('/api/product/:id/delete', catchErrors(apiController.removeFromCart));

router.post('/api/fileUpload', apiController.upload, catchErrors(apiController.resize), apiController.fileUpload);
router.get('/api/search', catchErrors(apiController.searchProducts));
router.post('/api/products/:id/like', authController.isLoggedIn, catchErrors(apiController.likeProduct));
router.get('/api/stores/near', catchErrors(storeController.mapStores));

router.get('/order/steps/1', authController.isLoggedIn, catchErrors(productController.getShoppingCart));

router.post('/register', userController.validateRegister, userController.register, authController.login, authController.afterLogin);
router.post('/login', authController.login, authController.afterLogin);
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmedPassword, catchErrors(authController.update));
router.get('/logout', authController.isLoggedIn, authController.logout);
//router.post('/login/:social', authController.loginWithSocial);

router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));
 
module.exports = router;
