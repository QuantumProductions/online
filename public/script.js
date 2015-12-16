getDistance = function(a, b) {
  var x = ((a.x - b.x) * (a.x - b.x));
	var y = ((a.y - b.y) * (a.y - b.y));
	if (x + y == 0){
        return 0;
	}
	return Math.sqrt((x+y));
}

rotate = function(point, theta) {
    var sinT = Math.sin(theta); 
    var cosT = Math.cos(theta); 
    return {'x' : point.x*cosT - point.y*sinT, 'y': point.x*sinT + point.y*cosT};        
}

getAngleAsXY = function(a, b) {
    var veldistance = getDistance(a, b);
    
    if (veldistance == 0) {
        return {'x' : 0, 'y' : 0};
    }
    
    var distvar = Math.abs(a.x-b.x);
    var distvar2 = Math.abs(a.y-b.y);
    
    var total = distvar + distvar2;
    
    distvar = distvar / total;
    distvar2 = distvar2 / total;
    
    if (b.x < a.x){
        distvar = -distvar;
    }
    if (b.y < a.y){
        distvar2 = -distvar2;
    }
    
    return {'x' : distvar, 'y' : distvar2};
}

rotate_point = function(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}


lowerTillZero = function(obj, key) {
    if (obj[key] > 0) {
        obj[key]--;
    }
}

polygonContainsPoint = function(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point['x'];
    var y = point['y'];

    if (x > vs[0][0] + 100 || x < vs[0][0] - 100 || y > vs[0][1] + 100 || y < vs[0][1] - 100) {
			return false;
		}
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
        	inside = !inside;
        }
    }
    
    return inside;
};

var wrapText = function (context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
};

var pointArrayRotated = function(points, angle, origin) {
        for (var i = 0; i < points.length; i++){
            var p = points[i];
            var rotated = rotate_point(p[0], p[1], origin.x, origin.y, angle);
            points[i] = [rotated.x, rotated.y];
        }

        return points;
    }

var thrustFace = function(thing) {
    var origin = {'x' : thing.x, 'y': thing.y};
    var tp = [thing.x, thing.y + 1];
    return rotate_point(tp[0], tp[1], origin.x, origin.y, thing.r);
}

var applyThrust = function(thing) {
    var origin = {'x' : thing.x, 'y': thing.y};
    var tp = [thing.x, thing.y + 1];
    var np = rotate_point(tp[0], tp[1], origin.x, origin.y, thing.getValue('rotation').rotation );
    thing.tx = np.x - thing.x;
    thing.ty = np.y - thing.y;
    thing.x = thing.x + thing.tx; //* 3; // * speed //thing.thrustX();
    thing.y = thing.y + thing.ty; // * 3; // thing.thrustY();
}

module.exports = {'pointArrayRotated' : pointArrayRotated, 'applyThrust' : applyThrust};