import '../sass/pages/catalog.sass';
import  dropdown from './components/dropdown';
import popup from './modules/popup';
import { showPopup } from './modules/popup';
import callback from './modules/callback';
import './modules/order';
import { $, $$ } from './modules/bling';
import './modules/auth';
import './modules/addToCard';
import typeAhead from './modules/search';
import { changePage, sort } from './modules/changePage';

changePage('pagination');
changePage('goods-menu');
sort();

popup($('.js-callback-popupShow'), $('.callback-popup'));
callback($('#callback'), $('.callback-popup'));
typeAhead($('.search'));

$$('.js-dropdown').forEach(item => {
	dropdown(item);
});
