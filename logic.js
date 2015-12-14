var players = {};

var connectPlayer = function(socket) {
	players[socket.id] = {'x' : 10, 'y' : 10};
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

logic = {
	"connectPlayer" : connectPlayer,
	"players": players,
	"loop": loop
};

module.exports = logic;
