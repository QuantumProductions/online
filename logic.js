"use strict";

var players = {};

class Player {
	constructor(options) {
		this.x = 10;
		this.y = 10;
	}
}

var connectPlayer = function(socket) {
	players[socket.id] = new Player();
	return players[socket.id];
}

var input = function(socket, data) {
	players[socket.id].input = data['input'];
}

var loop = function() {
	var playerKeys = Object.keys(players);
	for (var i = 0; i < playerKeys.length; i++) {
		var player = players[playerKeys[i]];
		player.x++;
		if (player.x > 100) {
			player.x = 0;
		}
	}
}

var logic = {
	"connectPlayer" : connectPlayer,
	"players": players,
	"loop": loop
};

module.exports = logic;
