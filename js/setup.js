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
	var canvas = null;
	var context = null;
	var accumulator = 0;
	var MAX = 0;
	var widthOverMax = 0;
	var heightOverMax = 0;
	var pendingActions = [];
	var lastAction = '';
	function createCourt() {
		canvas = document.createElement('canvas');
		canvas.style.width = "500px";
		canvas.style.height = "500px";
		canvas.style.marginLeft = "auto";
		canvas.style.marginRight = "auto";
		canvas.style.display = "block";
		canvas.style.border = "1px solid #ddd";
		document.getElementsByTagName("body")[0].appendChild(canvas);
		context = canvas.getContext("2d");
		context.font = "30px Arial";
		context.fillStyle = "#0000AA";
		
		MAX = Math.max(canvas.width, canvas.height) / pixelsPerSecond * 1000;
		widthOverMax = canvas.width / MAX;
		heightOverMax = canvas.height / MAX;
	};
	
	function drawCourt() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillRect(0, 0, accumulator * widthOverMax, accumulator * heightOverMax);
		if (pendingActions.length > 0) {lastAction = pendingActions.shift();}
		context.fillStyle = "#000000";
		context.fillText("" + lastAction, 10, 50);
		context.fillStyle = "#0000AA";
	};
	
	game.setTickFunction(function(delta) {
		accumulator += delta;
		drawCourt();
		if (accumulator > MAX) {game.stop();}
	});
	
	// Example using single handler:
	game.setKeyDownHandlers(function(keyCode, running) {
		if (running) {pendingActions.push(keyCode);}
	});
	
	createCourt();
	game.run();
}
testRunner(35);

