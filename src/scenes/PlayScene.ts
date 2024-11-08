import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";
import MapGenerator from "../utils/MapGenerator";
import Player from "../entities/Player";

const Config = {
	MapWidth: 800 / 25,
	MapHeight: 600 / 25,
	TileWidth: 25,
	TileHeight: 25,
};

class PlayScene extends Phaser.Scene {
	private player!: Player;

	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		const map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
		const tilemapManager = new TilemapManager();
		const tilemapData = tilemapManager.createTilemap(
			this,
			Config.MapWidth,
			Config.MapHeight,
			Config.TileWidth,
			Config.TileHeight,
		);
		tilemapManager.populateTilemap(map, tilemapData);
		this.physics.world.setBounds(0, 0, Config.MapWidth * Config.TileWidth, Config.MapHeight * Config.TileHeight);

		const playerStart = tilemapManager.findRandomNonFilledTile(tilemapData);
		if (playerStart) {
			this.player = new Player(this, playerStart.x * Config.TileWidth, playerStart.y * Config.TileHeight, Config.TileWidth, Config.TileHeight);
		}
	}

	update() {
		const inputs = {
			up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown,
			down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown,
			left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown,
			right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown,
		};

		if (this.player) {
			this.player.update(inputs);
		}
	}
}

export default PlayScene;
