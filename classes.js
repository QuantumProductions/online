"use strict";

var base = require('./public/base.js');
var script = require("./public/script.js");

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
					this.resetCharge(0); //extract to a do something & reset.. extract reset to standard this.resetCharge()
					var bullet = new PillarBullet({'x' : this.thing.x, 'y' : this.thing.y, 'vx' : 4, 'vy' : 0});
					//console.log("bullet rep" + bullet.representation().x);
					this.thing.updates.push(['bullets', bullet]);
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
		return [new ShipChassis()];
	}

	representation() {
		var rotation  = this.getValue('rotation').rotation;
		return {'x' : this.x, 'y' : this.y, 'r' : rotation};
	}
}

module.exports = {'PillarAvatar' : PillarAvatar, 'OnlineComboPilot' : OnlineComboPilot};