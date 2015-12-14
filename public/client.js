"use strict";

class GameClient extends OnlineClient {
	installGame() {
		console.log("installing game");
		this.game = new OnlinePillarGame({canvas: this.canvas});
		console.log("this.game.things", this.game.things);
		Thing.prototype.scale = this.scale();
	}
}