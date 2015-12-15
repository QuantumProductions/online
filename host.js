"use strict";

var engine = require('./engine.js');
var base = require('./base.js');

var player = new base.Avatar();
console.log(player.x);

class PillarGame extends engine.ServerGame {
	connectPlayer(socket) {
		var player = new base.Avatar();
		this.add('players', player);
		console.log("added player");
		//announce
	}	
}

module.exports = {'HostedGame' : PillarGame};