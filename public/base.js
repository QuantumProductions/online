"use strict";

class Component {
	defaultMaxCharge() {
		return [0];
	}

	resetCharge(index) {
		this.charge[index] = this.maxCharge[index];
	}

	constructor(options) {
		options = options || {};
		if (options['maxCharge']) {
			this.maxCharge = options['maxCharge'];
		} else {
			this.maxCharge = this.defaultMaxCharge();
		}
		this.charge = [];
		for (var i = 0; i < this.maxCharge.length; i++) {
			this.charge.push(0);
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

class MomentumMover extends Component {
	constructor(options) {
		super(options);
		this.mx = 0;
		this.my = 0;
	}

	registrationNames() {
		return ['velocity', 'elasticCollision'];
	}	

	getValue(name, hash) {
		if (name == 'velocity') {
			hash.vx += this.mx;
			hash.vy += this.my;
		}
	}

	processEvent(name, eventer, hash) {
		if (name == 'elasticCollision') {
			this.mx += hash.vx;
			this.my += hash.vy;
		}
	}

	loop() {
		super.loop();
		this.thing.x += this.mx;
		this.thing.y += this.my;
	}


}

class Mover extends Looper {
	loop() {
		var velocity = this.thing.getValue('velocity');
		var speed = 3.0; //this.thing.getValue('speed')['speed'];

		var total = Math.abs(velocity.vx) + Math.abs(velocity.vy);
		if (total <= 0) {
			return;
		}

		var xx = velocity.vx / total * this.thing.speedMod();
		var yy = velocity.vy / total * this.thing.speedMod();
		this.thing.x = this.thing.x + xx * speed;
		this.thing.y = this.thing.y + yy * speed;

		// if (this.thing.x > 100) {
		// 	this.thing.x = 10;
		// } else if (this.thing.x < 1) {
		// 	this.thing.x = 100;
		// }
	}
}

//input components

class Walker extends Component {
	constructor(options) {
		super(options);
		this.vx = 0;
		this.vy = 0;
	}

	registrationNames() {
		return ['input', 'velocity'];
	}

	getValue(name, hash) {
		if (name == 'velocity') {
			hash.vx = this.vx; //times speed
			hash.vy = this.vy;
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
	speedMod() {
		return 1.0;
	}

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
		this.updates = [];
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

	representation() {
		return this.position();	
	}
}

class Avatar extends Thing {
	spawnComponents(options) {
		return [new Mover(), new Walker()];
	}
}

module.exports = {'Component' : Component, 'Thing' : Thing,
'Mover' : Mover, 'Looper' : Looper, 'Walker' : Walker,
'Avatar' : Avatar, 'MomentumMover' : MomentumMover};