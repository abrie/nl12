import Phaser from "phaser";
import TextureGenerator from "./TextureGenerator";
import MapGenerator from "./MapGenerator";

class TilemapManager {
	private tilemapData: {
		scene: Phaser.Scene;
		tilemap: Phaser.Tilemaps.Tilemap;
		emptyTileset: Phaser.Tilemaps.Tileset;
		filledTileset: Phaser.Tilemaps.Tileset;
		layer: Phaser.Tilemaps.TilemapLayer;
	};

	constructor(scene: Phaser.Scene) {
		this.tilemapData = this.createTilemap(scene);
		const map = MapGenerator.generateMap(10, 10, 5);
		this.populateTilemap(map);
	}

	private createTilemap(scene: Phaser.Scene) {
		TextureGenerator.generateTexture(scene, 0xff00ff, 32, 32, "empty");
		TextureGenerator.generateTexture(scene, 0x00ff00, 32, 32, "filled");

		const tilemap = scene.make.tilemap({
			width: 10,
			height: 10,
			tileWidth: 32,
			tileHeight: 32,
		});
		const filledTileset = tilemap.addTilesetImage(
			"filled",
			undefined,
			32,
			32,
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
			32,
			32,
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

		if (!tilemap || !emptyTileset || !filledTileset || !layer) {
			throw new Error("Tilemap data properties cannot be null");
		}

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
