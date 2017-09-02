import { $$, $ } from './bling';
import axios from 'axios';

function changePageReq(navParentClass, page, sort = 'created', hst = true) {
	axios.get(`${page}?axs=1&sort=${sort}`).then(res => {
		if (!res.data) return;
		$('#catalog-holder').innerHTML = res.data;
		const state = { page: page, sort: sort };
		if (hst){
			history.pushState(state, 'Айфонсервис', state.page);
		}
		changePage(navParentClass);
	})
}

function changePage(navParentClass){
	if (!$(`.${navParentClass}`)) return;
		$$(`.${navParentClass}__link`).on('click', function(e){
			e.preventDefault();
			const sort = $('.sort__current').getAttribute('data-sort');
			const href = this.getAttribute('href');
			changePageReq(navParentClass, href, sort);
		});
	window.onpopstate = function(e) {
  	if (!e.state) return;
  	changePageReq(navParentClass, e.state.page, e.state.sort, false);
	};
}

function sort(){
	const items = $$('.js-sort-item');
	items.on('click', function(){
		changePageReq('pagination', $('.pagination__link_active').innerHTML, this.getAttribute('data-sort'));
	});	
}

/*function changePageReq(navParentClass, page, hst = true) {
	axios.get(`${page}?axs=1`).then(res => {
		if (!res.data) return;
		$('#catalog-holder').innerHTML = res.data;
		const state = { page: page };
		if (hst){
			history.pushState(state, 'Айфонсервис', state.page);
		}
		changePage(navParentClass);
	})
}

function changePage(navParentClass){
	if (!$(`.${navParentClass}`)) return;
		$$(`.${navParentClass}__link`).on('click', function(e){
			e.preventDefault();
			const href = this.getAttribute('href');
			changePageReq(navParentClass, href);
		});
	window.onpopstate = function(e) {
  	if (!e.state) return;
  	changePageReq(navParentClass, e.state.page, false);
	};
}*/

/*function sort(){
	const location = window.location.pathname;
	const items = $$('.js-sort-item');
	items.on('click', function(){
		changePage()
		axios.get(`${location}?axs=1&sort=${this.getAttribute('data-sort')}`).then( res => {
			if (!res.data) return;
			$('#catalog-holder').innerHTML = res.data;
			changePage('pagination');
		}).catch( err =>  {console.error(err)});
	});
}*/

export { changePage, sort };