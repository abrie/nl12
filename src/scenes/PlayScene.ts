import Phaser from "phaser";
import TilemapManager from "../utils/TilemapManager";
import MapGenerator from "../utils/MapGenerator";
import InputManager from "../utils/InputManager";
import Player from "../objects/Player";

const Config = {
	MapWidth: 800 / 12,
	MapHeight: 600 / 12,
	TileWidth: 12,
	TileHeight: 12,
};

class PlayScene extends Phaser.Scene {
	private inputManager?: InputManager;
	private player?: Player;
	private lootGroup?: Phaser.Physics.Arcade.Group;
	private tilemapManager?: TilemapManager;

	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		// Load assets here
	}

	create() {
		let map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
		map = MapGenerator.addBorder(map);
		this.tilemapManager = new TilemapManager();
		this.tilemapManager.createTilemap(
			this,
			Config.MapWidth,
			Config.MapHeight,
			Config.TileWidth,
			Config.TileHeight,
		);
		this.tilemapManager.populateTilemap(map);
		this.physics.world.setBounds(
			0,
			0,
			Config.MapWidth * Config.TileWidth,
			Config.MapHeight * Config.TileHeight,
		);

		this.inputManager = new InputManager(this);

		const playerStart = this.tilemapManager.findRandomNonFilledTile();
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
			this.tilemapManager.layer,
			this.handlePlayerCollision,
			undefined,
			this,
		);
		this.player.setCurrentMap(this.tilemapManager);

		this.lootGroup = this.physics.add.group({
			allowGravity: false,
		});

		for (let i = 0; i < 10; i++) {
			const lootPosition = this.tilemapManager.findRandomNonFilledTile();
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
		if (inputs.regenerate) {
			this.regenerateMap();
		}
	}

	private handlePlayerCollision(player: any, tile: any) {
		(player as Player).handleCollision();
	}

	private handlePlayerLootOverlap(player: any, loot: any) {
		loot.destroy();
	}

	private regenerateMap() {
		let map = MapGenerator.generateMap(Config.MapWidth, Config.MapHeight, 3);
		map = MapGenerator.addBorder(map);
		this.tilemapManager.populateTilemap(map);

		this.lootGroup.clear(true, true);

		for (let i = 0; i < 10; i++) {
			const lootPosition = this.tilemapManager.findRandomNonFilledTile();
			if (lootPosition) {
				const loot = this.physics.add.sprite(
					lootPosition.x * Config.TileWidth + Config.TileWidth / 2,
					lootPosition.y * Config.TileHeight + Config.TileHeight / 2,
					"loot",
				);
				this.lootGroup.add(loot);
			}
		}
	}
}

export default PlayScene;
