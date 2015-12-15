"use strict";

var machine = require('./public/machine.js');

class ServerGame extends machine.Game {
	constructor(options) {
		super(options);
		this.sockets = options['sockets'];
		this.canvas = {'width' : 600, 'height' : 600};
	}

	setupOutput(options) {
	}

	destroyThings(to_destroy, group_name) {
		super.destroyThings(to_destroy, group_name);
		//emit destruction;
	}

	groupLoop(group_name) { //possibly 
		var updates = super.groupLoop(group_name);
		//async emit update
	}

	connectPlayer(socket) {
		//sub class
	}
}

module.exports = {'ServerGame' : ServerGame};