"use strict";

var machine = require('./public/machine.js');

class OnlineGame extends machine.Game {
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
}

module.exports = {'OnlineGame' : OnlineGame};