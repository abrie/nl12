import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";

class PlayScene extends Phaser.Scene {
	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		const tilemapManager = new TilemapManager(this);
		tilemapManager.setTile(2, 2, true); // Example usage
		tilemapManager.setTile(3, 3, false); // Exaeple usage
	}

	update() {
		// Update game objects here
	}
}

export default PlayScene;
