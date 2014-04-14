// General setup and convenience functions

if (!window.console) {console = {log: function() {}};} // Create a dummy logger if necessary to prevent errors

var game = (function() {
	"use strict";
	var running = false;
	var tickFunction = null;
	
	return {
		setTickFunction: function(tickFxn) {tickFunction = tickFxn;},
		
		run: function() {
			if (typeof tickFunction !== "function") {console.log("No tickFunction set.  Use 'setTickFunction' before calling 'run'."); return false;}
			var last = performance.now();
			function step(timestamp) {
				if (running) {
					tickFunction(timestamp - last);
					last = timestamp;
					requestAnimationFrame(step);
				}
			}
			running = true;
			requestAnimationFrame(step); // start the first frame
			return true;
		},
		
		stop: function() {running = false;}
	};
})();


function testRunner(pixelsPerSecond) {
	"use strict";
	var testDiv = document.createElement('div');
	testDiv.style.backgroundColor = "#00a";
	testDiv.style.height = "100px";
	var w = testDiv.style.width = 0;
	document.getElementsByTagName('body')[0].appendChild(testDiv);
	
	game.setTickFunction(function(delta) {
		var widthDelta = (delta / 1000) * pixelsPerSecond;
		w += widthDelta;
		testDiv.style.width = w + 'px';
		if (w > 500) {game.stop();}
	});
	
	game.run();
}
testRunner(35);

