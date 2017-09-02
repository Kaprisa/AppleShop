import '../sass/pages/order.sass';
import { $$, $ } from './modules/bling';
import counter from './components/counter';
import { numValidator } from './modules/inputValidator';
import axios from 'axios';
import callback from './modules/callback';
import typeAhead from './modules/search';


$$('.cart-product').forEach( item => {
	counter( item.querySelector('.counter'),Number(item.querySelector('.js-cart-product-price').innerHTML), item.querySelector('.js-cart-product-total'));
	item.querySelector('#count').addEventListener('change', function(){
		let sum = 0;
		$$('.js-cart-product-total').forEach( el => {
			sum += Number(el.innerHTML);
		});
		$('.js-shopping-cart-total').innerHTML = sum;
	});
});

$$('.js-number').forEach( input => numValidator(input));
if ($('.js-deleteFromBasket')) {
$$('.js-deleteFromBasket').on('click', function(){
	const product = this.parentNode.parentNode;
	const price = product.querySelector('.js-cart-product-total').innerHTML;
	const id = product.getAttribute('data-id');
	axios.delete(`/api/product/${id}/delete`).then( res => {
		product.classList.add('slide_up');
		setTimeout(() => {
			product.remove();
			if ($('.js-shopping-cart-total')){
				const total = $('.js-shopping-cart-total').innerHTML;
				$('.js-shopping-cart-total').innerHTML = total - price;
			}
			if (!$('.shopping-cart__item')) {
				$('.shopping-cart').innerHTML = 
					`<div class="grid-row grid-row_center">
						<p class="title">Ваша корзина пуста :(</p>
					</div>`;
			}
		}, 2000)
		$('.user-goods__text').innerHTML = res.data;
	}).catch( err => { console.error(err) } );
});
}