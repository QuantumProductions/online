"use strict";

var machine = require('./public/machine.js');
var base = require('./public/base.js');

base.Thing.prototype.representation = function() {
	return {'x' : this.x, 'y' : this.y}; //player id
}

class ServerGame extends machine.Game {
	constructor(options) {
		super(options);
		this.sockets = options['sockets'];
		this.canvas = {'width' : 600, 'height' : 600};
	}

	input(socket, data) {
		if (data['right'] == true) {
			//console.log("right is true");
			socket.player.x++;
		} else if (data['left'] == true) {
			//console.log("left is true");
			socket.player.x--;
		}
		socket.player.processEvent('input', {}, data);
	}

	setupOutput(options) {
	}

	destroyThings(to_destroy, group_name) {
		super.destroyThings(to_destroy, group_name);
		//emit destruction;
	}

	groupLoop(group_name) { //possibly 
		//var updates = super.groupLoop(group_name);
		//async emit update
	}

	connectPlayer(socket) {
		//sub class
	}

	representationThings() {
		var group_names = this.groupNames();
		var hash = {};
		for (var i = 0; i < group_names.length; i++) {
			var groupRep = [];
			var group = this.things[group_names[i]];
			for (var ii = 0; ii < group.length; ii++) {
				var thing = group[ii];
				var rep = thing.representation();
				groupRep.push(rep);
			}
			hash[group_names[i]] = groupRep;
		}

		return hash;
	}
}

module.exports = {'ServerGame' : ServerGame};