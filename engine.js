"use strict";

var machine = require('./public/machine.js');
var base = require('./public/base.js');

//update representation for just updates?

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
		socket.player.processEvent('input', {}, data);
	}

	setupOutput(options) {
	}

	destroyThings(to_destroy, group_name) {
		if (to_destroy.length > 0) {
			console.log("destroying");
		}
		super.destroyThings(to_destroy, group_name);
		//emit destruction;
	}

	// groupLoop(group_name) { //possibly 
	// 	super.groupLoop(group_name);
	// 	//var updates = super.groupLoop(group_name);
	// 	//async emit update
	// }

	connectPlayer(socket) {
		//sub class
	}

	representationThings() {
		var group_names = this.groupNames();
		var hash = {};
		for (var i = 0; i < group_names.length; i++) {
			var groupRep = [];
			var group = this.things[group_names[i]];
			if (group) {
				for (var ii = 0; ii < group.length; ii++) {
					var thing = group[ii];
					var rep = thing.representation();
					// console.log("repped" + O);
					console.log("rep" + Object.keys(rep));
					groupRep.push(rep);
				}	
			}
			
			hash[group_names[i]] = groupRep;
		}

		return hash;
	}
}

module.exports = {'ServerGame' : ServerGame};