import axios from 'axios';
import { $ } from './bling';

function like(){
	$('#like').on('click', function(){
		const id = $('.product').getAttribute('data-id');
		axios.post(`/api/products/${id}/like`).then(res=> {
			this.classList.toggle('btn-like_hearted');
		}).catch(console.error);
	})
}

export default like();