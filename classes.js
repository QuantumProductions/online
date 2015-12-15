"use strict";

var base = require('./public/base.js');

class PillarAvatar extends base.Avatar {
	constructor(options) {
		super(options);
		this.x = Math.floor(Math.random() * 100);
		this.y = Math.floor(Math.random() * 100);
	}

	loop() {
		super.loop();
	}
}

module.exports = {'PillarAvatar' : PillarAvatar};