import '../sass/pages/index.sass';
import slider from './modules/slider';
import { $, $$ } from './modules/bling';
import callback from './modules/callback';
import showPopup from './modules/popup';
import typeAhead from './modules/search';
import './modules/order';
import './modules/auth';
import './modules/addToCard';

showPopup($('.js-callback-popupShow'), $('.callback-popup'));
callback($('#callback'), $('.callback-popup'));
typeAhead($('.search'));

slider($('.slider'));
