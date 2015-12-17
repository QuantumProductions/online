"use strict";

var base = require('./public/base.js');
var script = require("./public/script.js");

class PillarRocket extends base.Thing {
	spawnComponents(options) {
		console.log("pillar rocket options" + options.r);
		return super.spawnComponents(options).concat([new Rotator(options)]);
	}

	constructor(options) {
		super(options);
		this.x = options['x'];
		this.y = options['y'];
	}

	representation() {
		return {'x' : this.x, 'y' :this.y, 'r' : this.getValue('rotation').rotation};
	}

	loop() {
		super.loop();
		script.applyThrust(this);
	}
}

class PillarBullet extends base.Thing {
	constructor(options) {
		super(options);
		this.x = options['x'];
		this.y = options['y'];
		this.vx = options['vx'];
		this.vy = options['vy'];
	}

	loop() {
		super.loop();
		this.x += this.vx;
	}

	//extract update representation?

	representation() {
		return {'x' : this.x, 'y' : this.y, 'vx' : this.vx, 'vy' : this.vy};
	}
}

class PillarShooter extends base.Component {
	defaultMaxCharge() {
		return [3];
	}

	registrationNames() {
		return ['input'];
	}

	loop() {
		if (this.charge[0] > 0) {
			this.charge[0]--;
		}
	}

	processEvent(name, eventer, hash) {
		if (name == 'input') {
			if (hash.firing) {
				if (this.charge[0] <= 0) {
					// 
				}
			}
		}
	}
}

class PillarAvatar extends base.Avatar {
	spawnComponents(options) {
		return super.spawnComponents(options).concat([new PillarShooter()]);
	}

	constructor(options) {
		super(options);
		this.x = Math.floor(Math.random() * 100);
		this.y = Math.floor(Math.random() * 100);
	}
}

class ShipChassis extends base.Component {
	constructor(options) {
		super(options);
		this.shipScale = 1;
		this.r = 0;
	}

	registrationNames() {
		return ['vertexes', 'rotation', 'input'];
	}

	noseSpan() {
		return 56 * this.shipScale;
	}

	wingSpan() {
		return 18 * this.shipScale;
	}

	engineSpan() {
		return 12 * this.shipScale;
	}

	shipVertexes(p0, p1, p2, p3) {
		var points = [[this.thing.x, this.y + p0 * this.scale], [this.x - p1 * this.scale, this.thing.y],
		       [this.thing.x, this.thing.y - p2 * this.scale], [this.x + p3 * this.scale, this.thing.y]];
			
		return script.pointArrayRotated(points, this.r, this.position());
	}

	loop() {
		super.loop();
		script.applyThrust(this.thing);
	}

	vertexes() {
		return this.shipVertexes(this.noseSpan(), this.wingSpan(), this.engineSpan(), this.wingSpan());
	}

	getValue(name, hash) {
		if (name == 'vertexes') {
			hash.hitboxVertexes = this.vertexes();	
		} else if (name == 'rotation') {
			hash.rotation = this.r;
		} //redundant code... key value lookup?

		return hash;
	}

	processEvent(name, eventer, hash) {
		if (name == 'input') {
			if (hash.left) {
				this.r--;
				if (this.r < 0) {
					this.r = 359;
				}
			} else if (hash.right) {
				this.r++;
				if (this.r > 360) {
					this.r = 1;
				}
			}

			// if (hash.up) {
			// 	this.
			// }
		}
	}
}

class Rotator extends base.Component {
	constructor(options) {
		super(options);
		this.r = options['r'];
		console.log("ROTATOR" + this.r);
	}

	// registrationNames() {
	// 	return [];
	// }
	registrationNames() {
		return ['rotation'];
	}

	getValue(name, hash) {
		hash.rotation = this.r;
		return hash;
	}
}

class Rocket extends base.Thing { //should thrust rotator be its own component?
	spawnComponents(options) {
	//	return [];
		return [new Rotator(options)];
	}

	constructor(options) {
		super(options);
		this.x = options['x'];
		this.y = options['y'];
//		this.r = options['r'];
	}

	loop() {
		super.loop();
		script.applyThrust(this);
	}

	// getValue(name) {
	// 	if (name == 'rotation') {
	// 		return {'rotation' : this.r};
	// 	}
		
	// 	return super.getValue(name);
	// }

	representation() {
		return {'x' : this.x, 'y' : this.y, 'r' : this.getValue('rotation').rotation};
	}
}

class RocketLauncher extends base.Component {
	defaultMaxCharge() {
		return [70];
	}

	registrationNames() {
		return ['input'];
	}

	loop() {
		this.charge[0]--;
		if (this.charge[0] <= 0) {
			this.charge[0] = 0;
		}
	}

	processEvent(name, eventer, hash) {
		if (name == 'input') {
			if (hash.firing) {
				if (this.charge[0] <= 0) {
					this.resetCharge(0); //extract to a do something & reset.. extract reset to standard this.resetCharge()
					var rotating =this.thing.getValue('rotation').rotation;
					console.log("rotating" + rotating);
					var rocket = new Rocket({'x' : this.thing.x, 'y' : this.thing.y, 'r' : rotating});
					//var rocket = new PillarRocket({'x' : this.thing.x, 'y' : this.thing.y, 'r' : 0});
					// var rocket = new base.Thing();
					// rocket.x = 25;
					// rocket.y = 25;
					this.thing.updates.push(['bullets', rocket]);
				}
			}
		}
	}

}

class OnlineComboPilot extends base.Thing {
	constructor(options) {
		super(options);
		this.x = Math.floor(Math.random() * 100);
		this.y = Math.floor(Math.random() * 100);
	}

	spawnComponents(options) {
		return [new ShipChassis(), new RocketLauncher()];
	}

	representation() {
		var rotation  = this.getValue('rotation').rotation;
		return {'x' : this.x, 'y' : this.y, 'r' : rotation};
	}
}

module.exports = {'PillarAvatar' : PillarAvatar, 'OnlineComboPilot' : OnlineComboPilot};