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
		let mapType = "cellular"; // Change this to "filledBoxes", "voronoi", or "perlinNoise" to use different map generation types
		let map;

		switch (mapType) {
			case "filledBoxes":
				map = MapGenerator.generateFilledBoxesMap(Config.MapWidth, Config.MapHeight, 10);
				break;
			case "voronoi":
				map = MapGenerator.generateVoronoiMap(Config.MapWidth, Config.MapHeight, 10);
				break;
			case "perlinNoise":
				map = MapGenerator.generatePerlinNoiseMap(Config.MapWidth, Config.MapHeight, 0.5);
				break;
			case "cellular":
			default:
				map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
				break;
		}

		map = MapGenerator.addBorder(map);
		const tilemapManager = new TilemapManager();
		tilemapManager.createTilemap(
			this,
			Config.MapWidth,
			Config.MapHeight,
			Config.TileWidth,
			Config.TileHeight,
		);
		tilemapManager.populateTilemap(map);
		this.physics.world.setBounds(
			0,
			0,
			Config.MapWidth * Config.TileWidth,
			Config.MapHeight * Config.TileHeight,
		);

		this.inputManager = new InputManager(this);

		const playerStart = tilemapManager.findRandomNonFilledTile();
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
				tilemapManager.layer,
				this.handlePlayerCollision,
				undefined,
				this,
			);
			this.player.setCurrentMap(tilemapManager);
		}
	}

	update() {
		this.inputManager.update();
		const inputs = this.inputManager.getInputs();
		if (this.player) {
			this.player.updateState(inputs);
		}
	}

	private handlePlayerCollision(player: any, tile: any) {
		(player as Player).handleCollision();
	}
}

export default PlayScene;
