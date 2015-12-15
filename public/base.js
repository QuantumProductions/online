"use strict";

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
		// return;
		console.log("looping in mover" + this.thing.x);
		var velocity = this.thing.getValue('velocity');
		console.log("velocity" + velocity.vx + "vy" + velocity.vy);
		//return;
		//velocity.vx = 3;
		if (velocity.vx > 0) {
		//	console.log("vx > 0");
		}
		var speed = 1.0; //this.thing.getValue('speed')['speed'];

		var total = Math.abs(velocity.vx) + Math.abs(velocity.vy);
		// console.log("PREtotal" + total);
		if (total <= 0) {
			return;
		}

		console.log("velocity.vx" + velocity.vx);
		console.log("total" + total);
		console.log("speed mod" + this.thing.speedMod());
		var xx = velocity.vx / total * this.thing.speedMod();
		console.log("xx" + xx);
		//return;
		var yy = velocity.vy / total * this.thing.speedMod();
		
		console.log("yy" + yy);

		this.thing.x = this.thing.x + xx * speed;
		console.log("new thing x " + this.thing.x);
		this.thing.y = this.thing.y + yy * speed;
		// this.thing.x += velocity.vx;
		// this.thing.y += velocity.vy; //announce

		if (this.thing.x > 100) {
			this.thing.x = 10;
		} else if (this.thing.x < 1) {
			this.thing.x = 100;
		}
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
			hash.vy = 0;
			// if (!hash.vy) {
			// 	hash.vy = 0;
			// 	//console.log("EXPECTED 0");
			// }
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
			if (!hash.vx) {
				hash.vx = 0;
			}
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
	}

	loop() {
		console.log("thing loop");
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

class Avatar extends Thing {
	spawnComponents(options) {
		return [new Mover(), new XWalker()];
	}
}

module.exports = {'Component' : Component, 'Thing' : Thing,
'Mover' : Mover, 'Looper' : Looper, 'XWalker' : XWalker, 'YWalker' : YWalker,
'Avatar' : Avatar};