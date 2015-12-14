"use strict";

class Avatar extends Thing {
	spawnComponents(options) {
		return [new Mover(), new XWalker(), new YWalker()];
	}
}

