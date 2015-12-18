"use strict";

var engine = require('./engine.js');
var base = require('./public/base.js');
var classes = require('./classes.js');
var script = require("./public/script.js");

class PillarGame extends engine.ServerGame {
	resetGame() {
		super.resetGame();
		this.things = {};
		this.things['players'] = [];
	}

	connectPlayer(socket) {
		var player = new classes.OnlineComboPilot();
		socket.player = player;
		
		this.add('players', player);
		//announce
	}	

	installGroupLoops() {
		super.installGroupLoops();

		this.loopForGroup['bullets'] = function(thing, game) {
			for (var i = 0; i < game.things['players'].length; i++) {
				var pilot = game.things['players'][i];
				thing = game.evaluateRocketCollision(thing, pilot);
			}
			
			return thing;
		}
	}

	evaluateRocketCollision(thing, pilot) {
		var vertexes = pilot.getValue('vertexes').hitboxVertexes;
		var hit = script.polygonContainsPoint(thing.position(), vertexes);
		// console.log('vertexes' + vertexes);
		// console.log("position" + thing.position() + " hit" + hit);
		if (hit) {
			console.log("hit");
			// var rocketSpeed = thing.getValue('speed').speed;
			// var rocketVel = $V([thing.tx * rocketSpeed, thing.ty * rocketSpeed]); //extract this?

			// var pilotSpeed = pilot.getValue('speed').speed;
			// var shipVel = $V([pilot.tx * pilotSpeed, pilot.ty * pilotSpeed]);
			
			// var rocketMass = 1;
			// var shipMass = 200;

			// var v = $V([0, 0]).add(shipVel.multiply(shipMass)).add(rocketVel.multiply(rocketMass)).multiply(1);
			// var elasticCollision = 
			// {'vx' : v.elements[0] / (shipMass + rocketMass),
			// 'vy' : v.elements[1] / (shipMass + rocketMass)};
			// pilot.processEvent('elasticCollision', rocket, elasticCollision)         //this function should be collision-component

			thing.gone = true;
		}
		return thing;
	}


}

module.exports = {'HostedGame' : PillarGame};