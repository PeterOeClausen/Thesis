//This file loads the initial data needed when opening the site.
const baseUrl = "https://localhost:44317/api/";

$( document ).ready(function() {
	//Get hierarchies and add them to the dimentsions:
	$.ajax({
		url: baseUrl+"tag", 
		success: function(result){
            console.log(result);
    	},
    	error: function(xhr, status, error){
    		console.log(status + "\n" + error);
    	}
	});

    console.log( "ready!" );
});