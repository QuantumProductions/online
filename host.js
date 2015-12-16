"use strict";

var engine = require('./engine.js');
var base = require('./public/base.js');
var classes = require('./classes.js');

class PillarGame extends engine.ServerGame {
	resetGame() {
		super.resetGame();
		this.things['players'] = [];
	}

	connectPlayer(socket) {
		var player = new classes.OnlineComboPilot();
		socket.player = player;
		
		this.add('players', player);
		//announce
	}	

}

module.exports = {'HostedGame' : PillarGame};