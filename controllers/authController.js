const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local');

exports.afterLogin = (req, res) =>  {
  res.render('components/user', {user: req.user}, function(err, html){
    res.send(html);
  });
}

exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Вы успешно вышли,возвращайтесь, мы вас ждём!');
	res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.fash('error', 'Вы должны быть авторизованы, чтобы продолжить');
		res.redirect('/');
	}
}

exports.forgot = async (req, res) => {
	const user = await User.findOne({email: req.body.email});
	if (!user) {
		//req.flash('error', 'Не существует аккаунта с таким E-Mail')
		res.send('Не существует аккаунта с таким E-Mail');
		return;
	}
	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPasswordExpires = Date.now() + 3600000;
	await user.save();
	const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
	await mail.send({
		user,
		subject: 'Восстановление пароля',
		resetURL,
		filename: 'reset-password'
	});
		//req.flash('success', 'Вам отправлена инструкция восстановления аккаунта')
		res.send('Вам отправлена инструкция восстановления аккаунта');
}

exports.reset = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() }
	});
	if (!user) {
		//req.flash('error', 'Сброс пароля не валиден или истёк');
		res.send('Сброс пароля не валиден или истёк');
		return;
	}
	res.render('reset/reset');
}

exports.confirmedPassword = (req, res, next) => {
	if (req.body.password === req.body['confirm-password']) {
		next();
		return;
	} 
	//req.flash('error', 'Пароли не совпадают!');
	res.send('Пароли не совпадают!');
	res.redirect('back');
}

exports.update = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() }
	});
	if (!user) {
		req.flash('error', 'Сброс пароля не валиден или истёк');
		return;
	}
	const setPassword = promisify(user.setPassword, user);
	await setPassword;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	const updatedUser = await user.save();
	await req.login(updatedUser);
	req.flash('success', 'Ваш пароль успешно обновлён! Вы успешно вошли!');
	res.redirect('/');
}