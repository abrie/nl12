import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";
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
	}

	update() {
		// Update game objects here
	}
}

export default PlayScene;
