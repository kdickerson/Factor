// General setup and convenience functions

if (!window.console) {console = {log: function() {}};} // Create a dummy logger if necessary to prevent errors

var KEYS = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

var game = (function() {
	"use strict";
	var running = false;
	var tickFunction = null;
	var keyDownHandlers = null;
	
	var keyDown = function(event) {
		if (typeof keyDownHandlers === "function") {keyDownHandlers(event.keyCode, running);}
		else if (keyDownHandlers[event.keyCode]) {keyDownHandlers[event.keyCode](running);}
	};
	document.getElementsByTagName('body')[0].onkeydown = keyDown;
	
	return {
		setTickFunction: function(tickFxn) {tickFunction = tickFxn;},
		
		// keyHandlers can be a function, which will be passed the event keyCode and "running"
		//   or it can be an object with keyCodes as keys.  The value of the keys should be functions that will be passed "running"
		setKeyDownHandlers: function(handlers) {keyDownHandlers = handlers;},
		
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
	
	// Example using single handler:
	/*game.setKeyDownHandlers(function(keyCode, running) {
		testDiv.innerHTML = "" + keyCode + ' - ' + running;
	});*/
	
	// Example using separate handlers:
	var handlers = {};
	handlers[KEYS.DOWN] = function(running) {testDiv.innerHTML = "Down - " + running};
	handlers[KEYS.UP] = function(running) {testDiv.innerHTML = "Up - " + running};
	handlers[KEYS.LEFT] = function(running) {testDiv.innerHTML = "Left - " + running};
	handlers[KEYS.RIGHT] = function(running) {testDiv.innerHTML = "Right - " + running};
	handlers[KEYS.SPACE] = function(running) {testDiv.innerHTML = "Space - " + running};
	handlers[KEYS.ESC] = function(running) {testDiv.innerHTML = "Esc - " + running};
	game.setKeyDownHandlers(handlers);
	
	game.run();
}
testRunner(35);

