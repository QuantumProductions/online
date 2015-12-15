"use strict";

var engine = require('./engine.js');
var base = require('./base.js');

var player = new base.Avatar();
console.log(player.x);

class PillarGame extends engine.ServerGame {
	resetGame() {
		super.resetGame();
		this.things['players'] = [];
	}

	connectPlayer(socket) {
		var player = new base.Avatar();
		if (this.things['players']) {
			console.log("ADDING player" + this.things['players'].length);	
		}
		
		this.add('players', player);
		console.log("added player" + this.things['players'].length);
		//announce
	}	

}

module.exports = {'HostedGame' : PillarGame};