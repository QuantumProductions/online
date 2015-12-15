"use strict";

class PillarAvatar extends engine.Avatar {
	constructor(options) {
		super(options);
		this.x = Math.floor(Math.random() * 100);
		this.y = Math.floor(Math.random() * 100);
	}
}

module.exports = {'PillarAvatar' : PillarAvatar};