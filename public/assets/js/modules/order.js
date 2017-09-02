import axios from 'axios';
import { hidePopup,showPopup } from './popup';
import { $, $$ } from '../modules/bling';

function order(popup){
	const phone = popup.querySelector('#order-phone').value;
	const id = popup.getAttribute('data-id');
	axios.post('/order', {phone: phone, id: id}).then(res=> {
		popup.querySelector('.popup__content').innerHTML = '<div class="callback-popup__res">Спасибо за заявку!</div>';
		setTimeout(function(){
			hidePopup(popup);
		}, 1500);
	});
}

function buyOneClick(){
	$$('.buy-one-click').on('click', function(e){
		e.preventDefault();
		const parent = this.parentElement;
		const popup = $('.buy-popup');
		const img = parent.querySelector('.card__img').src;
		const name = parent.querySelector('.card__title').innerHTML;
		const price = parent.querySelector('.card__price').innerHTML;
		const id = parent.getAttribute('data-id');
		popup.querySelector('.buy-popup__img').src = img;
		popup.querySelector('.buy-popup__name').innerHTML = name;
		popup.querySelector('.buy-popup__price').innerHTML = price;
		popup.setAttribute('data-id', id);
		showPopup(popup);
		popup.querySelector('#order').on('click', function(){
			order(popup);
		});
	})
}

export default buyOneClick();