//This file loads the initial data needed when opening the site.

$( document ).ready(function() {
	//Get hierarchies and add them to the dimensions:
	//UpdateDimensions();
});

function UpdateDimensions(){
	$.ajax({
		url: baseUrl + "tagset",
		success: function(result){
			console.log(result);
			var modalContainer = $('#ModalContainer');
			modalContainer.innerHTML = "<p>InsideModalContainer</p>";
			var listOfTagsets = JSON.parse(result);
			listOfTagsets.forEach(tagset => {
				console.log(tagset.Name);
			});
    	},
    	error: function(xhr, status, error){
    		console.log("Error: Please check that Web API is running on: " + baseUrl);
		}
	});
}