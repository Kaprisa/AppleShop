import '../sass/pages/product.sass';
import counter from './components/counter';
import tabs from './components/tabs';
import showPopup from './modules/popup';
import callback from './modules/callback';
import { $, $$ } from './modules/bling';
import './modules/auth';
import './modules/addToCard';
import './modules/review';
import './modules/heart';
import { numValidator } from './modules/inputValidator';
import typeAhead from './modules/search';
import './modules/auth';

counter($('.counter'));
tabs();

showPopup($('.js-callback-popupShow'), $('.callback-popup'));
callback($('#callback'), $('.callback-popup'));
showPopup($('.js-img-showPopup'), $('.js-img-popup'));
showPopup($('.rating__reviews'), $('.review-popup'));
$$('.js-number').forEach( input => numValidator(input));
typeAhead($('.search'));
