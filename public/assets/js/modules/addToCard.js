import axios from 'axios';
import { $$, $ } from '../modules/bling';

function addToCard(){
	$$('.add-to-card').on('click', function(){
		const id = this.parentElement.getAttribute('data-id');		
		axios.post(`/api/product/${id}/addToCart`).then(res => {
			$('.user-goods__text').innerHTML = res.data;
			/*const textPrice = this.parentElement.querySelector('.card__price').innerHTML;
			const price = parseInt(textPrice.slice(0 , textPrice.indexOf(' ')));
			const countHolder = $('#goods-count');
			const totalHolder = $('#goods-total');
			const count = parseInt(countHolder.innerHTML);
			const total = parseInt(totalHolder.innerHTML);
			countHolder.innerHTML = count + 1;
			totalHolder.innerHTML = total + price;*/
		});
	});
}

export default addToCard();