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
	private jumpKey!: Phaser.Input.Keyboard.Key;
	private inputState: { left: boolean; right: boolean; jump: boolean } = {
		left: false,
		right: false,
		jump: false,
	};

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
			this.player = new Player(this, playerStart.x * Config.TileWidth, playerStart.y * Config.TileHeight);
			this.physics.add.collider(this.player, tilemapData.layer);
			this.cursors = this.input.keyboard.createCursorKeys();
			this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		}
	}

	update() {
		if (this.player) {
			this.inputState.left = this.cursors.left.isDown;
			this.inputState.right = this.cursors.right.isDown;
			this.inputState.jump = this.jumpKey.isDown;

			this.player.update(this.inputState);

			if (this.inputState.left) {
				this.player.setVelocityX(-160);
			} else if (this.inputState.right) {
				this.player.setVelocityX(160);
			} else {
				this.player.setVelocityX(0);
			}

			if (this.inputState.jump && this.player.body.blocked.down) {
				this.player.setVelocityY(-330);
			}
		}
	}
}

export default PlayScene;
