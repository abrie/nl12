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
	private inputManager?: InputManager;
	private player?: Player;
	private lootGroup?: Phaser.Physics.Arcade.Group;

	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		let map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
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
		if (!playerStart) {
			throw new Error("Unable to find a starting tile for the player.");
		}
		this.player = new Player(
			this,
			playerStart.x * Config.TileWidth + Config.TileWidth / 2,
			playerStart.y * Config.TileHeight + Config.TileHeight / 2,
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

		this.lootGroup = this.physics.add.group({
			allowGravity: false,
		});

		for (let i = 0; i < 10; i++) {
			const lootPosition = tilemapManager.findRandomNonFilledTile();
			if (lootPosition) {
				const loot = this.physics.add.sprite(
					lootPosition.x * Config.TileWidth + Config.TileWidth / 2,
					lootPosition.y * Config.TileHeight + Config.TileHeight / 2,
					"loot",
				);
				this.lootGroup.add(loot);
			}
		}

		this.physics.add.overlap(
			this.player,
			this.lootGroup,
			this.handlePlayerLootOverlap,
			undefined,
			this,
		);
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

	private handlePlayerLootOverlap(player: any, loot: any) {
		loot.destroy();
	}
}

export default PlayScene;
