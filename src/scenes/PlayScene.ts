import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";
import MapGenerator from "../utils/MapGenerator";
import InputManager from "../utils/InputManager";
import Player from "../objects/Player";

const Config = {
	MapWidth: 800 / 25,
	MapHeight: 600 / 25,
	TileWidth: 25,
	TileHeight: 25,
};

class PlayScene extends Phaser.Scene {
	private inputManager: InputManager;
	private player: Player;

	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		const map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
		const tilemapManager = TilemapManager.getInstance();
		const tilemapData = tilemapManager.createTilemap(
			this,
			Config.MapWidth,
			Config.MapHeight,
			Config.TileWidth,
			Config.TileHeight,
		);
		tilemapManager.populateTilemap(map, tilemapData);
		this.physics.world.setBounds(
			0,
			0,
			Config.MapWidth * Config.TileWidth,
			Config.MapHeight * Config.TileHeight,
		);

		this.inputManager = new InputManager(this);

		const playerStart = tilemapManager.findRandomNonFilledTile(tilemapData);
		if (playerStart) {
			this.player = new Player(
				this,
				playerStart.x * Config.TileWidth,
				playerStart.y * Config.TileHeight,
				Config.TileWidth,
				Config.TileHeight,
			);
			this.physics.add.existing(this.player);
			this.physics.add.collider(
				this.player,
				tilemapData.layer,
				this.handlePlayerCollision,
				undefined,
				this,
			);
			this.player.setTilemapData(tilemapData);
		}
	}

	update() {
		this.inputManager.update();
		const inputs = this.inputManager.getInputs();
		if (this.player) {
			this.player.updateState(inputs);
			this.player.setTilemapData(tilemapData);
		}
	}

	private handlePlayerCollision(player: any, tile: any) {
		(player as Player).handleCollision();
	}
}

export default PlayScene;
