import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHtml(results) {
	console.log(results)
	if (!results || !results.length) return;
	return results.map( res => {
		return `<a href="/product/${res._id}" class="search__link">${res.name}</a>`;
	}).join('');
}

function typeAhead(search){
	if (!search) return;
	const searchInput = search.querySelector('.search__input');
	const searchResults = search.querySelector('.search__results');
	searchInput.on('input', function(){
		if (!this.value){
			searchResults.style.display = 'none';
			return;
		}
		searchResults.style.display = 'block';
		axios.get(`/api/search?q=${this.value}`).then( res => {
			if (res.data.length && Array.isArray(res.data)) {
				searchResults.innerHTML = dompurify.sanitize(searchResultsHtml(res.data))
			} else {
				searchResults.innerHTML = dompurify.sanitize('<span class="search__link">Ничего не найдено:(</a>')
			}
		}).catch( err => {console.error(err)});
	});
	searchInput.on('keyup', function(e){
		if (![38,40,13].includes(e.keyCode)) return;
		const activeClass = 'search__link_active';
		const current = search.querySelector('.search__link_active');
		const items = search.querySelectorAll('.search__link');
		let next;
		if ( e.keyCode === 38 && current ) {
			next = current.previousElementSibling || items[ items.length - 1 ];
		} else if ( e.keyCode === 38 ) {
			next = items[ items.length - 1 ]
		} else if ( e.keyCode === 40 && current ) {
			next = current.nextElementSibling || items[0];
		} else if ( e.keyCode === 40 ) {
			next = items[0]
		} else if ( e.keyCode === 13 && current ) {
			window.location.href = current.href;
			return;
		}
		if (current) {
			current.classList.remove('search__link_active');
		}
		next.classList.add('search__link_active');
	});
}


export default typeAhead;