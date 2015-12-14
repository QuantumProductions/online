"use strict";

class Game {
	constructor(options) {
		this.resetGame();
		this.installGroupLoops();
		this.setupOutput(options);
	}

	setupOutput(options) {
		this.canvas = options['canvas'];
		this.resetBoard();
		this.installSounds();
	}

	installSounds() {
		
	}

	installGroupLoops() {
		this.loopForGroup = {};
	}

	setupPlayers() {
		this.players = {};
	}

	resetBoard() {
		this.board = [];
		this.things = {};
	}

	resetGame() {
		this.resetBoard();
		this.setupPlayers();
	}

	add(group_name, thing) {
		if (!this.things[group_name]) {
			this.things[group_name] = [];
		}

		var group = this.things[group_name];
	
		group.push(thing);
	}


	destroyThings(to_destroy, group_name) {
		var group = this.things[group_name];
		if (!group) {
			return [];
		}
		for (var i = 0; i < to_destroy.length; i++) {
			var index = group.indexOf(to_destroy[i]);
			
			if (index >= 0) {
				group.splice(index, 1);
			}
		}
		
		return group;
	}

	outOfBounds(group_name, thing) {
 		return thing.x < -10 || thing.y < -10 || thing.x > this.canvas.width || thing.y > this.canvas.height;
	}

	groupNames() {
		return Object.keys(this.things);		
	}

	handleOutOfBounds(group_name, thing) {
		thing.gone = true;
	}

	shouldDestroyThing(group_name, thing) {
		return false;
	}

	checkBounds(group_name, thing) {
		if (this.outOfBounds(group_name, thing)) {
			this.handleOutOfBounds(group_name, thing);
		}
	}

	groupLoop(group_name) {
		var to_destroy = [];

		var group = this.things[group_name];
		if (group == undefined) {
			return;
		}

		for (var i = 0; i < group.length; i++) {
			var thing = group[i];
			if (thing.active === true) {
				thing.loop();
				if (this.loopForGroup[group_name]) {
					thing = this.loopForGroup[group_name](thing, this);
				}
				thing.afterLoop();	
			}

			this.checkBounds(group_name, thing);

			if (this.shouldDestroyThing(group_name, thing)) {
				thing.gone = true;
			}

			if (thing.gone) {
				to_destroy.push(thing);
			}

			if (thing.endedRound) {
				return;
			}
		}

		group = this.destroyThings(to_destroy, group_name);			
		this.things[group_name] = group;
	}

	loop() {
		var group_names = this.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {

			this.groupLoop(group_names[group_index]);
		}
	}

	destroyThingsInRadius(group_name, point, radius) {
		var things = this.things[group_name];
		if (!things) {
			return;
		}
		for (var i = 0; i < things.length; i++) {
			var thing = things[i];
			if (getDistance(thing.position(), point) <= radius) {
				thing.gone = true;
			}
		}
	}
}

class Component {
	defaultMaxCharge() {
		return [0];
	}

	constructor(options) {
		options = options || {};
		this.charge = [0];
		if (options['maxCharge']) {
			this.maxCharge = options['maxCharge'];
		} else {
			this.maxCharge = this.defaultMaxCharge();
		}
		
	}

	loop() {

	}

	getValue(name, hash) {
		return hash;
	}	
}

class Looper extends Component {
	registrationNames() {
		return ['loop'];
	}
}

class Mover extends Looper {
	loop() {
		var velocity = this.thing.getValue('velocity');
		var speed = this.thing.getValue('speed')['speed'];

		var total = Math.abs(velocity.vx) + Math.abs(velocity.vy);
		if (total <= 0) {
			return;
		}

		var xx = velocity.mx / total * this.speedMod();
		var yy = velocity.my / total * this.speedMod();

		this.thing.x = this.thing.x + xx * speed;
		this.thing.y = this.thing.y + yy * speed;
		this.thing.x += velocity.vx;
		this.thing.y += velocity.vy; //announce
	}
}

//input components

class XWalker extends Component {
	constructor(options) {
		super(options);
		this.vx = 0;
	}

	registrationNames() {
		return ['input', 'velocity'];
	}

	getValue(name, hash) {
		if (name == 'velocity') {
			hash.vx = this.vx; //times speed
		}

		return hash;
	}

	processEvent(name, eventer, hash) {
		if (name == 'input') {
			if (hash.left) {
				this.vx = -1;
			} else if (hash.right) {
				this.vx = 1;
			} else {
				this.vx = 0;
			}
		}
	}
}

class YWalker extends Component {
	constructor(options) {
		super(options);
		this.vx = 0;
	}

	registrationNames() {
		return ['input', 'velocity'];
	}

	getValue(name, hash) {
		if (name == 'velocity') {
			hash.vy = this.vy; //times speed
		}

		return hash;
	}

	processEvent(name, eventer, hash) {
		if (name == 'input') {
			if (hash.up) {
				this.vy = -1;
			} else if (hash.down) {
				this.vy = 1;
			} else {
				this.vy = 0;
			}
		}
	}
}

class Thing {
	spawnComponents(options) {
		return [];
	}

	installComponents(options) {
		this.componentRegistrations = {};
		this.components = [];

		var comps = this.spawnComponents(options);
		for (var i = 0; i < comps.length; i++) {
			var component = comps[i];
			component.thing = this;
			this.registerComponent(component);

			this.components.push(component);
		}
	}

	registerComponent(component) {
		for (var i = 0; i < component.registrationNames().length; i++) {
			var eventName = component.registrationNames()[i];
			if (!this.componentRegistrations[eventName]) {
				this.componentRegistrations[eventName] = [];
			}

			this.componentRegistrations[eventName].push(component);
		}
	}

	getValue(name) {
		var registered = this.componentRegistrations[name];
		if (registered) {
			var valueHash = {};
			for (var i = 0; i < registered.length; i++) {
				var component = registered[i];
				valueHash = component.getValue(name, valueHash);
				if (valueHash.stop) {
					return valueHash;
				}
			}

			return valueHash;
		}
	}

	processEvent(name, eventer, hash) {
		var registered = this.componentRegistrations[name];
		if (registered) {
			for (var i = 0; i < registered.length; i++) {
				var component = registered[i];
				component.processEvent(name, eventer, hash);
			}
		}
	}

	constructor(options) {
		if (options && options['position']) {
			this.x = options['position'].x * this.canvas.width;
			this.y = options['position'].y * this.canvas.height;
		} else {
			this.x = 2.0;
			this.y = 2.0;	
		}
		
		this.installComponents(options);
		this.active = true;
	}

	loop() {
		for (var i = 0; i < this.components.length; i++) {
			var component = this.components[i];
			component.loop();
		}
	}	

	afterLoop() {

	}

	position() {
		return {'x' : this.x, 'y' : this.y};
	}
}

module.exports = {'Game' : Game};