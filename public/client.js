"use strict";

class GameClient extends OnlineClient {
	installGame() {
		this.game = new OnlinePillarGame({canvas: this.canvas});
		Thing.prototype.scale = this.scale();
	}
}