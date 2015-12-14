"use strict";

var machine = require('./public/machine.js');

class Player {
	constructor(options) {
		this.x = 10;
		this.y = 10;
	}
}


class ServerGame extends machine.Game {
	constructor(options) {
		super(options);
		this.sockets = options['sockets'];
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
		var player = new Player();
		this.add('players', player);
	}
}

module.exports = {'ServerGame' : ServerGame};