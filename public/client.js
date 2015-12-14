"use strict";

class GameClient extends OnlineClient {
	installGame() {
		this.game = new OnlineGame({canvas: this.canvas});
		Thing.prototype.scale = this.scale();
	}
}