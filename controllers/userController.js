const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.validateRegister = (req, res, next) => {
	req.checkBody('email', 'Указанный E-Mail не валиден').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extention: false,
		gmail_remove_subaddress: false
	});
	req.checkBody('password', 'Пароль не может быть пустым').notEmpty;
	req.checkBody('password', 'Пароль не может быть пустым').notEmpty;
	req.checkBody('confirmPassword', 'Подтвердите пароль').notEmpty;
	req.checkBody('confirmPassword', 'Пароли не совпадают').equals(req.body.password);
	const errors = req.validationErrors();
	if (errors) {
		req.flash('error', errors.map(err => err.msg));
		res.json(req.flash());
		return;
	}
	next();
}

exports.register = async (req, res, next) => {
	const user = new User({ email: req.body.email});
	const register = promisify(User.register, User);
	await register(user, req.body.password);
	next();
}

exports.isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next()
	} else {
		//req.fash('error', 'Вы должны иметь соответствующие права, чтобы продолжить');
		res.redirect('/');
	}
}



