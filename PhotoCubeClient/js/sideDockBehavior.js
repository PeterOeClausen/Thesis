$(document).ready(function(){	
	$('#leftDock').resizable({
  		handles: 'e',
  		minWidth: 160,  		
  		stop: function( event, ui ) {
  			//Make browser div smaller or bigger according to #menu div change
  			var oldWidth = ui.originalSize.width;
			var newWidth = ui.size.width;
			var difference = newWidth - oldWidth;
			var browserElem = $('#browser');
			var currentBrowserWidth = browserElem.width();
			var newBrowserWidth = currentBrowserWidth - difference;
			browserElem.width(newBrowserWidth);
			ResizeBrowser();
  		}
	});

	$('#controls').resizable({
  		handles: 'w',
  		minWidth: 250,
  		stop: function( event, ui ) {
  			//Make browser div smaller or bigger according to #controls div change
  			var oldWidth = ui.originalSize.width;
			var newWidth = ui.size.width;
			var difference = newWidth - oldWidth;
			var browserElem = $('#browser');
			var currentBrowserWidth = browserElem.width();
			var newBrowserWidth = currentBrowserWidth - difference;
			console.log( "oldWidth: " + oldWidth + " newWidth " + newWidth + " difference " + difference + " currentBrowserWidth " + currentBrowserWidth + " newBrowserWidth " + newBrowserWidth );
			browserElem.width(newBrowserWidth);
			ResizeBrowser();
  		}
	});

	$('.control').resizable({
		handles: 's'
	});
});