"use strict";

class OnlineClient {
	constructor(options) {
		this.configureSocket(options['socket']);
		this.installRendering();
		this.installInput();
		this.installGame()
		this.installTime();
		this.installLoops();
	}

	updateFromSocketData(data) {
	 	// if (data['bullets']) {
	 	// 	var bullets = data['bullets'];
	 	// 	console.log("data.bullets" + bullets[0].x);
	 	// }
	 	var playerCount = 0;
	 	if (client.game.things['players']) {
	 		playerCount = client.game.things['players'].length;
	 	}
	 	var i = 0;
	 	for (i = 0; i < playerCount; i++) {
	 		var serverPlayer = data['players'][i];
	 		var localPlayer = client.game.things['players'][i];
	 		if (getDistance(serverPlayer, localPlayer) > 20) {
	 			localPlayer.x = serverPlayer.x;
	 			localPlayer.y = serverPlayer.y;	
	 		}
	 		
	 		localPlayer.targetX = serverPlayer.x;
	 		localPlayer.targetY = serverPlayer.y;
	 		localPlayer.r = serverPlayer.r;
	 	}
	 	for (i = i; i < data['players'].length; i++) {
	 		client.game.add('players', data['players'][i]);
	 	}
	 	//client.game.things['players'] = data['players'];

	 	if (data['updates'].length > 0) {
	 		for (var i = 0; i < data['updates'].length; i++) {
	 			var update = data['updates'][i];
	 			client.game.add(update[0], update[1]);
	 		}
	 	}
     //client.game.things['players'] = data;
     // console.log("player positions data" + data);
     //console.log(window.client.game.things['players']);
	}

	configureSocket(socket) {
		var client = this;

		socket.on('time', function(data) {
			client.localTime = data['time'];
		});

		 socket.on('game.rep.things', function(data) {
			client.updateFromSocketData(data);
    });

		this.socket = socket;
	}

	installLoops() {
		window.requestAnimationFrame(this.loop.bind(this));
	}

	installTime() {
		this.now, this.dt, this.last = Date.now();
		this.dt = 0.00;
		this.rate = 5;
	}

	styleCanvas(canvas) {
		var context = canvas.getContext('2d');
		context.textAlign = 'center';
		context.font = '30pt Courier New';
	}

	scale() {
		return 1.0;
	}

	generateCanvas() {
		var canvas = document.createElement("canvas");
		canvas.width = 600 * this.scale(); //download this from server
		canvas.height = 600 * this.scale();
		this.styleCanvas(canvas);	
		return canvas;
	}

	installRendering() {
		this.installCanvas();
	}

	installCanvas() {
		this.canvas = this.generateCanvas();
		document.getElementById("game_container").appendChild(this.canvas); 
	}

	installInput() {
		this.installMouseInput();
		this.installKeyboardInput();
	}

	installMouseInput() {
		this.canvas.addEventListener("click", this.onMouseDown.bind(this), false);
	}

	installKeyboardInput() {
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);

		this.key_pressed_map = {'L1' : false, 'R1' : false, 'U1' : false, 'D1' : false, 'A1' : false};

		this.key_map = {
			37: 'L1',
			38: 'U1',
			39: 'R1',
			40: 'D1',
			16: 'A1',
		}
	}

	parsePlayerInput(left, up, right, down, firing) {		
		var hash = {'left' : left, 'right' : right, 'down' : down, 'up' : up, 'firing' : firing};
		// if (left) {
		// 	this.game.things.players[0].r-= 2;
		// } else if (right) {
		// 	this.game.things.players[0].r+= 2;
		// }
		if (left || up || right || down || firing) {
			this.socket.emit('input', hash);	
			this.zeroInput = false;
		} else {
			if (this.zeroInput) {

			} else {
				this.socket.emit('input', hash);	
				this.zeroInput = true;
			}
		}
		
	}

	parsePlayer1Input(key_pressed_map) {
		var left = key_pressed_map['L1'] == true;
		var up = key_pressed_map['U1'] == true;
		var right = key_pressed_map['R1'] == true;
		var down = key_pressed_map['D1'] == true;
		var firing = key_pressed_map['A1'] == true;
		this.parsePlayerInput(left, up, right, down, firing);
	}

	loopKeyboardInput(key_pressed_map) {
		this.parsePlayer1Input(key_pressed_map);
	}

	loop() {
		this.now = Date.now();
		var delta  = this.now - this.last;
		this.last = this.now;
		this.dt = this.dt + delta;
		this.localTime += delta;

		// if (this.game.things && this.game.things['players']) {
		// 		for (var i = 0; i < this.game.things['players'].length; i++) {
		// 			var player = this.game.things['players'][i];
		// 			if (player.targetX && player.targetY) {
		// 				var xDist = player.targetX - player.x;
	 // 					var yDist = player.targetY - player.y;
	 // 					player.x += xDist / 5;
	 // 					player.y += yDist / 5;
		// 			}
		// 		}
		// 	}

		while (this.dt > this.rate) {
			this.dt = this.dt - this.rate;
			if (this.game.things && this.game.things['players']) {
				for (var i = 0; i < this.game.things['players'].length; i++) {
					var player = this.game.things['players'][i];
					applyThrust(player);
				}
			}

			if (this.game.things && this.game.things['bullets']) {
				for (var i = 0; i < this.game.things['bullets'].length; i++) {
					var bullet = this.game.things['bullets'][i];
					applyThrust(bullet);
					//bullet.x += 4;
				}
			}
		}
		this.loopKeyboardInput(this.key_pressed_map);
		this.draw();

		this.socket.emit('updates', {});

		window.requestAnimationFrame(this.loop.bind(this));
	}

	draw() {
		this.setBackground();

		var group_names = this.game.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {
			var groupName = group_names[group_index];
			var group = this.game.things[groupName];

			if (!group) {
				continue;
			}

			for (var i = 0; i < group.length; i++) {
				var thing = group[i];
				//debugDraw(thing, this, this.context());
				//if (groupName == 'players') {
					draws[groupName](thing, this, this.context());
				//}
			}


		}
	}

	context() {
		return this.canvas.getContext('2d');
	}

	setBackground() {
		this.context().clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context().fillStyle = "black";
		this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
	}


	installGame() {

	}

	onKeyUp(event) {
		this.key_pressed_map[this.key_map[event.keyCode]] = false;
	}

	onKeyDown(event) {
		event.preventDefault();
		//console.log("keydown" + event.keyCode);
		this.key_pressed_map[this.key_map[event.keyCode]] = true;
		//console.log(this.key_pressed_map);
	}

	onMouseUp(event) {
		var x = event.layerX;
		var y = event.layerY;
		//this.game.onMouseUp(x, y);
	}

	onMouseDown(event) {
		var x = event.layerX;
		var y = event.layerY;
		//this.game.onMouseDown(x, y);
	}
}
