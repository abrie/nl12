import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";
import MapGenerator from "../utils/MapGenerator";
import TextureGenerator from "../utils/TextureGenerator";

const Config = {
	MapWidth: 800 / 25,
	MapHeight: 600 / 25,
	TileWidth: 25,
	TileHeight: 25,
};

class PlayScene extends Phaser.Scene {
	private player!: Phaser.Physics.Arcade.Sprite;

	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		const map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
		const tilemapManager = new TilemapManager(
			this,
			Config.MapWidth,
			Config.MapHeight,
			Config.TileWidth,
			Config.TileHeight,
		);
		tilemapManager.populateTilemap(map);

		this.createPlayer();
		this.physics.add.collider(this.player, tilemapManager.layer);
	}

	update() {
		// Update game objects here
	}

	private createPlayer() {
		TextureGenerator.generateTexture(this, 0xff0000, Config.TileWidth, Config.TileHeight, "player");

		let x, y;
		do {
			x = Phaser.Math.Between(0, Config.MapWidth - 1);
			y = Phaser.Math.Between(0, Config.MapHeight - 1);
		} while (this.isTileFilled(x, y));

		this.player = this.physics.add.sprite(x * Config.TileWidth, y * Config.TileHeight, "player");
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(300);
	}

	private isTileFilled(x: number, y: number): boolean {
		const tile = this.tilemapManager.layer.getTileAt(x, y);
		return tile && tile.index === this.tilemapManager.filledTileset.firstgid;
	}
}

export default PlayScene;
