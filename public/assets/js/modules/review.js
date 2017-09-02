import axios from 'axios';
import { hidePopup } from './popup';
import { $ } from './bling';

function review(){
	const popup = $('.review-popup');
	popup.querySelectorAll('.star').on('click', function(){
		let active = popup.querySelector('.star_active');
		if (active) {
			active.classList.remove('star_active');
		}
		this.classList.add('star_active');
	});
	$('#review-form').on('submit', function(e){
		e.preventDefault();
		const id = $('.product').getAttribute('data-id');
		const text = popup.querySelector('.textarea').value;
		const rating = popup.querySelector('.star_active') ? popup.querySelector('.star_active').getAttribute('data-star') : 0;
		axios.post(this.action, {text: text, rating: rating}).then(res=> {
			const content = popup.querySelector('.popup__content');
			const inner = content.innerHTML;
			content.innerHTML = '<div class="callback-popup__res">Спасибо за отзыв!</div>';
			setTimeout(function(){
				hidePopup(popup);
				content.innerHTML = inner;
				review();
			}, 1500);
		});
	});
}

export default review();