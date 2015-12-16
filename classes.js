"use strict";

var base = require('./public/base.js');

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

module.exports = {'PillarAvatar' : PillarAvatar};