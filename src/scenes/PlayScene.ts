import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";
import MapGenerator from "../utils/MapGenerator";

class PlayScene extends Phaser.Scene {
	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		const map = MapGenerator.generateMap(10, 10, 5);
		const tilemapManager = new TilemapManager(this);
		tilemapManager.populateTilemap(map);
	}

	update() {
		// Update game objects here
	}
}

export default PlayScene;
