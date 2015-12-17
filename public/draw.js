var debugDraw = function(thing, client, context) {
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(thing.x, thing.y, 10, 0, 2 * Math.PI, false, 0);
	context.fill();
	context.closePath();
}

var noseSpan = function() {
	return 56;
}

var wingSpan = function() {
	return 18;
}

var engineSpan = function() {
	return 12;
}

var shipVertexes = function(thing, p0, p1, p2, p3) {
	var points = [[thing.x, thing.y + p0], [thing.x - p1, thing.y],
	       [thing.x, thing.y - p2], [thing.x + p3, thing.y]];
	return pointArrayRotated(points, thing.r, {'x' : thing.x, 'y' : thing.y});
}

var vertexes = function() {
	return shipVertexes(noseSpan(), wingSpan(), engineSpan(), wingSpan());
}

var draws = {'players' : function(thing, client, context) {
	context.lineWidth = 1;
	context.fillStyle = 'white';
	context.strokeStyle = 'white';
	context.beginPath();
	var vertexes = shipVertexes(thing, noseSpan(), wingSpan(), engineSpan(), wingSpan());
	var start = vertexes[0];
	context.moveTo(start[0], start[1]);
	context.lineTo(start[0], start[1]);
	for (var i = 0; i < vertexes.length; i++) {
		var vertex = vertexes[i];
		context.lineTo(vertex[0], vertex[1]);
	}

	context.lineTo(start[0], start[1]);
	context.stroke();
	context.fill();
	context.closePath();
},
'bullets' : function(thing, client, context) {
	debugDraw(thing, client, context);
}
};