import { $, $$ } from './bling';
import { numValidator } from './inputValidator';
import axios from 'axios';
import autocomplete from './autocomplete';
import { showPopup, hidePopup } from './popup';

function uploadPhoto(photo, cb){
	if (!photo) return cb('');
	const config = {
      headers: { 'content-type': 'multipart/form-data' }
  	};
	 	const formData = new FormData();
	  formData.append("photo", photo);
	  axios.post('/api/fileUpload', formData, config)
	    .then( res =>  {
	    	cb(res.data)
	    }).catch(err => {console.error(err); return;});
}

function loadPhoto(input, img) {
	input.on('change', function(event){
		const file = event.target.files[0];
		const fileReader = new FileReader();
		fileReader.onload = (function(theFile) {
	   	return function(e) {
	      img.setAttribute('src', e.target.result);
	    };
	  })(file);
	  fileReader.readAsDataURL(file);
	});
}

function postData(data) {
 	uploadPhoto($('#photo').files[0], function(photo) {
		if (photo.length) data.photo = photo;
		axios.post($('.editor__form').action, data).then(res => {
			dynamicPopup({action: 'success', msg: 'Данные успешно загружены!'});
		}).catch(err => {
			dynamicPopup({action: 'error', msg: 'Ошибка загрузки данных :('});
			console.error(err)});
	});
}

function dynamicPopup({action = 'success', msg = 'Успех!'}) {
	const popup = document.createElement('div');
	popup.className = `popup dynamic-popup dynamic-popup_${action}`;
	popup.innerHTML  = 
		`<div class="popup__content">
        <p class="dynamic-popup__text">${msg}</p>
	   </div>`;
	$('.editor').appendChild(popup);
	showPopup(popup, false);
	setTimeout(function(){
		hidePopup(popup);
		popup.remove();
	}, 1500);
}


function editor(){

 if ($('.editor')) {

		$$('.js-number').forEach( input => numValidator(input));

		if($('#address')) {
			autocomplete($('#address'), $('#lat'), $('#lng'));
		}

		if($('#photo')){
			loadPhoto($('#photo'), $('.editor__img'));
		}

		if ($('#editor-add-crk')){
			$('#editor-add-crk').on('click', function(){
				$('.editor-table tbody').insertAdjacentHTML('beforeend','<tr class="editor-table__row js-other"><td class="editor-table__col" contenteditable="true"></td><td class="editor-table__col js-number" contenteditable="true"></td></tr>');
			});
		}

		$('.editor__form').on('submit', function(e){
		 	e.preventDefault();

		 	if ($('#product-editor')){
			 	let others = [];
			 	if ($('.js-other')){
			 		$$('.js-other').forEach(item => {
			 			const cols = item.querySelectorAll('td');
			 			const [ name, value ] = [ cols[0].innerHTML, cols[1].innerHTML ];
			 			others.push({
			 				name,
			 				value
			 			});
			 		});
			 	};  //а давай два запроса отправим , хватит время тратить
			 	const data = {
			 		name: $('#name').value,
			 		type: $('#type').value,
			 		model: $('#model').value,
			 		description: $('#description').value,
			 		price: $('#price').value,
			 		count: $('#count').value,
			 		characteristics: {
			 			color: $('#color').innerHTML,//.split(',').map(item => {return item.trim()}),
				 		memory: $('#memory').innerHTML,//.split(',').map(item => {return item.trim()}),
				 		width: $('#width').innerHTML,
				 		height: $('#height').innerHTML,
				 		weight: $('#weight').innerHTML,
				 		others: others
			 		}		
			 	};
			 	postData(data);
			}

			if ($('#store-editor')) {

				const data = {
			 		name: $('#name').value,
			 		phone: $('#phone').value,
			 		description: $('#description').value,
			 		businessHours: [],
			 		location: {
			 			address: $('#address').value,
			 			coordinates: []
			 		}	
			 	};
			 	data.businessHours[0] = {
			 		start: $('#weekdays-start').value,
			 		end: $('#weekdays-end').value
			 	};
			 	data.businessHours[1] = {
			 		start: $('#weekend-start').value,
			 		end: $('#weekend-end').value
			 	};
			 	data.location.coordinates[0] = $('#lng').value;
			 	data.location.coordinates[1] = $('#lat').value;
			 	postData(data);
			}
		});

		if ($('#confirm-delete')) {

			$('#confirm-delete').on('click', function(){
				const popup = $('.confirm-popup');
				showPopup(popup, false);
				popup.querySelector('#cancel').on('click', function(){
					hidePopup(popup);
				})
				popup.querySelector('.confirm-popup__form').on('submit', function(e) {
					e.preventDefault();
					axios.delete(this.action).then( res => {
						const content = popup.querySelector('.popup__content');
						const inner = content.innerHTML;
						content.innerHTML = `<div class="confirm-popup__res">Удаление прошло успешно!</div>`;
						hidePopup(popup)
						content.innerHTML = inner;
					}).catch(err => {
						console.error(err);
					})
				})
			});
		}
	}
}


export default editor();