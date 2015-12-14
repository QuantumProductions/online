var debugDraw = function(thing, client, context) {
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(thing.x, thing.y, 10, 0, 2 * Math.PI, false, 0);
	context.fill();
	context.closePath();
}