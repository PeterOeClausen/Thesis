//Web API should be running on localhost port 44317
const baseUrl = "https://localhost:44317/api/";

var listOfTagsets;

$.ajax({
    url: baseUrl + "tagset",
    success: function(result){
        listOfTagsets = JSON.parse(result);
        listOfTagsets.forEach(tagset => {
            console.log(tagset)
            $("#tagsetLists").append("<li><button onclick=" +
                buttonHandlers_pickTagset("hello")
                + ">" + tagset.Name + "</button></li>");
        });
    },
    error: function(xhr, status, error){
        console.log("Error: Please check that Web API is running on: " + baseUrl);
    }
});

function buttonHandlers_pickTagset(tagset){
    console.log(tagset);
}
    

//Setting up buttonhandlers:
$( document ).ready(function() {
	//Setting up modal for changing a dimension: http://api.jqueryui.com/dialog/
    $( "#dialog" ).dialog({
        title: "Choose a tagset or a hierarchy to show on the axis",
        width: "450",
        autoOpen: false,
        modal: true
    });
    $( "#opener" ).click(function() {
        $( "#dialog" ).dialog( "open" );
    });
    
});

//Const used to express where method is located:
const buttonHandlers = {
    changeDimensionClicked(dimName) {
        console.log(dimName);
        //var modalContainer = $('#ModalContainer').append("<p>InsideModalContainer</p>");
        
        
        //console.log(modalContainer);
    }
};
