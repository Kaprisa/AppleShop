function numValidator(input){
	input.on('keydown', function(e){
		if (e.keyCode < 48 || e.keyCode > 57){
			if (e.keyCode != 8) {
				e.preventDefault();
			}	
		}
	})
}

export { numValidator };