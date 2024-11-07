import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";
import MapGenerator from "../utils/MapGenerator";
import Player from "../objects/Player";

const Config = {
	MapWidth: 800 / 25,
	MapHeight: 600 / 25,
	TileWidth: 25,
	TileHeight: 25,
};

class PlayScene extends Phaser.Scene {
	private player!: Player;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

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

		this.player = new Player(this, 100, 100);
		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player, tilemapData.layer, (player, tile) => {
			this.player.handleCollision(tile as Phaser.Tilemaps.Tile);
		});
	}

	update() {
		this.player.update(this.cursors);
	}
}

export default PlayScene;
