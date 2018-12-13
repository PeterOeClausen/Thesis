function changeDimensionClicked(dimensionName){
	console.log("Changing the " + dimensionName + " dimension list");
	//Todo: Make a CSS/JS Modal, or consider it: https://www.w3schools.com/howto/howto_css_modals.asp
	//Todo: Make API call.

	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks the button, open the modal
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
}