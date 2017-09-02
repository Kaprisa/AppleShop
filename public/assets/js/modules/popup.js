function hidePopup(popup){
	popup.classList.add('fade-out');
		setTimeout(function(){
			popup.style.display = 'none'
			popup.classList.remove('fade-out');
		}, 1000);
}

function showPopup(popup, hide = true) { 
	popup.classList.add('fade-in');
	popup.style.display = 'block'
	setTimeout(function(){
		popup.classList.remove('fade-in');
	}, 1000);
	if (hide) {
		popup.querySelector('.btn_hide-popup').on('click', function(){
			hidePopup(popup);
		});
	}
}


function popup(elem, popup) { 
	elem.on('click', function(){
		popup.classList.add('fade-in');
		popup.style.display = 'block'
		setTimeout(function(){
			popup.classList.remove('fade-in');
		}, 1000);		
	});
	popup.querySelector('.btn_hide-popup').on('click', function(){
		hidePopup(popup);
	});
}



export default popup;

export { hidePopup, showPopup };

