import Phaser from "phaser";
import TextureManager from "./TextureManager";

class TilemapManager {
	scene: Phaser.Scene;
	tilemap: Phaser.Tilemaps.Tilemap;
	emptyTileset: Phaser.Tilemaps.Tileset;
	filledTileset: Phaser.Tilemaps.Tileset;
	layer: Phaser.Tilemaps.TilemapLayer;

	constructor() {}

	createTilemap(
		scene: Phaser.Scene,
		width: number,
		height: number,
		tileWidth: number,
		tileHeight: number,
	) {
		TextureManager.generateAllTextures(scene);

		this.tilemap = scene.make.tilemap({
			width,
			height,
			tileWidth,
			tileHeight,
		});
		this.filledTileset = this.tilemap.addTilesetImage(
			TextureManager.Textures.FILLED_TILE.name,
			undefined,
			TextureManager.Textures.FILLED_TILE.width,
			TextureManager.Textures.FILLED_TILE.height,
			TextureManager.Textures.FILLED_TILE.margin,
			TextureManager.Textures.FILLED_TILE.spacing,
			1,
		);
		if (!this.filledTileset) {
			throw new Error("Failed to create 'filled' TilesetImage");
		}

		this.emptyTileset = this.tilemap.addTilesetImage(
			TextureManager.Textures.EMPTY_TILE.name,
			undefined,
			TextureManager.Textures.EMPTY_TILE.width,
			TextureManager.Textures.EMPTY_TILE.height,
			TextureManager.Textures.EMPTY_TILE.margin,
			TextureManager.Textures.EMPTY_TILE.spacing,
			2,
		);
		if (!this.emptyTileset) {
			throw new Error("Failed to create 'empty' TilesetImage");
		}
		this.layer = this.tilemap.createBlankLayer("layer", [
			this.emptyTileset,
			this.filledTileset,
		]);

		if (!this.layer) {
			throw new Error("Failed to create layer");
		}
		this.setupCollision({
			layer: this.layer,
			filledTileset: this.filledTileset,
		});

		this.scene = scene;
	}

	private setupCollision({
		layer,
		filledTileset,
	}: {
		layer: Phaser.Tilemaps.TilemapLayer;
		filledTileset: Phaser.Tilemaps.Tileset;
	}) {
		layer.setCollision(filledTileset.firstgid);
	}

	public setTile(x: number, y: number, filled: boolean) {
		const tileIndex = filled
			? this.filledTileset.firstgid
			: this.emptyTileset.firstgid;
		this.tilemap.putTileAt(tileIndex, x, y, true, this.layer);
	}

	public populateTilemap(map: boolean[][]) {
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				this.setTile(x, y, map[y][x]);
			}
		}
	}

	public findRandomNonFilledTile(): { x: number; y: number } | null {
		const nonFilledTiles: { x: number; y: number }[] = [];

		for (let y = 0; y < this.tilemap.height; y++) {
			for (let x = 0; x < this.tilemap.width; x++) {
				const tile = this.tilemap.getTileAt(x, y);
				if (tile && tile.index === this.emptyTileset.firstgid) {
					nonFilledTiles.push({ x, y });
				}
			}
		}

		if (nonFilledTiles.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * nonFilledTiles.length);
		return nonFilledTiles[randomIndex];
	}

	public getFirstFilledTileAbove(
		worldX: number,
		worldY: number,
	): Phaser.Tilemaps.Tile | null {
		const startTile = this.layer.getTileAtWorldXY(worldX, worldY);
		for (let ty = startTile.y - 1; ty >= 0; ty--) {
			const tile = this.tilemap.getTileAt(startTile.x, ty);
			if (tile && tile.index === this.filledTileset.firstgid) {
				return tile;
			}
		}
		return null;
	}
}

export default TilemapManager;
