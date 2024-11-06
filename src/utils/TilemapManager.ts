import Phaser from "phaser";
import TextureGenerator from "./TextureGenerator";

class TilemapManager {
	private tilemapData: {
		scene: Phaser.Scene;
		tilemap: Phaser.Tilemaps.Tilemap;
		emptyTileset: Phaser.Tilemaps.Tileset;
		filledTileset: Phaser.Tilemaps.Tileset;
		layer: Phaser.Tilemaps.TilemapLayer;
	};

	constructor(
		scene: Phaser.Scene,
		width: number,
		height: number,
		tileWidth: number,
		tileHeight: number,
	) {
		this.tilemapData = this.createTilemap(
			scene,
			width,
			height,
			tileWidth,
			tileHeight,
		);
	}

	private createTilemap(
		scene: Phaser.Scene,
		width: number,
		height: number,
		tileWidth: number,
		tileHeight: number,
	) {
		TextureGenerator.generateTexture(
			scene,
			0xff00ff,
			tileWidth,
			tileHeight,
			"empty",
		);
		TextureGenerator.generateTexture(
			scene,
			0x00ff00,
			tileWidth,
			tileHeight,
			"filled",
		);

		const tilemap = scene.make.tilemap({
			width,
			height,
			tileWidth,
			tileHeight,
		});
		const filledTileset = tilemap.addTilesetImage(
			"filled",
			undefined,
			tileWidth,
			tileHeight,
			0,
			0,
			1,
		);
		if (!filledTileset) {
			throw new Error("Failed to create 'filled' TilesetImage");
		}

		const emptyTileset = tilemap.addTilesetImage(
			"empty",
			undefined,
			tileWidth,
			tileHeight,
			0,
			0,
			2,
		);
		if (!emptyTileset) {
			throw new Error("Failed to create 'empty' TilesetImage");
		}
		const layer = tilemap.createBlankLayer("layer", [
			emptyTileset,
			filledTileset,
		]);

		if (!layer) {
			throw new Error("Failed to create layer");
		}
		this.setupCollision({ layer, filledTileset });

		return { scene, tilemap, emptyTileset, filledTileset, layer };
	}

	private setupCollision({
		layer,
		filledTileset,
	}: {
		layer: Phaser.Tilemaps.TilemapLayer;
		filledTileset: Phaser.Tilemaps.Tileset;
	}) {
		layer.setCollisionBetween(filledTileset.firstgid, filledTileset.firstgid);
	}

	public setTile(x: number, y: number, filled: boolean) {
		const { tilemap, filledTileset, emptyTileset, layer } = this.tilemapData;
		const tileIndex = filled ? filledTileset.firstgid : emptyTileset.firstgid;
		tilemap.putTileAt(tileIndex, x, y, true, layer);
	}

	public populateTilemap(map: boolean[][]) {
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				this.setTile(x, y, map[y][x]);
			}
		}
	}
}

export default TilemapManager;
