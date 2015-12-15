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

	configureSocket(socket) {
		var client = this;
		 socket.on('game.rep.things', function(data) {
		 	// if (data['bullets']) {
		 	// 	var bullets = data['bullets'];
		 	// 	console.log("data.bullets" + bullets[0].x);
		 	// }
		 	client.game.things = data;
	     //client.game.things['players'] = data;
	     // console.log("player positions data" + data);
	     //console.log(window.client.game.things['players']);
    });

		this.socket = socket;
	}

	installLoops() {
		window.requestAnimationFrame(this.loop.bind(this));
	}

	installTime() {
		this.now, this.dt, this.last = Date.now();
		this.dt = 0.00;
		this.rate = 10;
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
		this.socket.emit('input', hash);
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

		if (this.dt > this.rate) {
			this.draw();
			this.dt = this.dt - this.rate;
			this.loopKeyboardInput(this.key_pressed_map);
		}

		window.requestAnimationFrame(this.loop.bind(this));
	}

	draw() {
		this.setBackground();

		var group_names = this.game.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {
			var group = this.game.things[group_names[group_index]];

			for (var i = 0; i < group.length; i++) {
				var thing = group[i];
				debugDraw(thing, this, this.context());
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
