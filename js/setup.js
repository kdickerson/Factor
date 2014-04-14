// General setup and convenience functions

var running = false;
function run(tickFunction) {
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
}

function stop() {running = false;}




function testRunner(pixelsPerSecond) {
	var testDiv = document.getElementById('testDiv');
	var w = testDiv.style.width = 0;
	
	run(function(delta) {
		var widthDelta = (delta / 1000) * pixelsPerSecond;
		w += widthDelta;
		testDiv.style.width = w + 'px';
		if (w > 500) {stop();}
	});
}
testRunner(15);

