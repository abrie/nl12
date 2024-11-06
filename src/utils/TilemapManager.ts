import Phaser from "phaser";
import TextureGenerator from "./TextureGenerator";

class TilemapManager {
	private scene: Phaser.Scene;
	private tilemap: Phaser.Tilemaps.Tilemap;
	private emptyTileset: Phaser.Tilemaps.Tileset;
	private filledTileset: Phaser.Tilemaps.Tileset;
	private layer: Phaser.Tilemaps.TilemapLayer;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.createTilemap();
	}

	private createTilemap() {
		TextureGenerator.generateTexture(this.scene, 0xff00ff, 32, 32, "empty");
		TextureGenerator.generateTexture(this.scene, 0x00ff00, 32, 32, "filled");

		this.tilemap = this.scene.make.tilemap({
			width: 10,
			height: 10,
			tileWidth: 32,
			tileHeight: 32,
		});
		this.filledTileset = this.tilemap.addTilesetImage(
			"filled",
			undefined,
			32,
			32,
			0,
			0,
			1,
		);

		this.emptyTileset = this.tilemap.addTilesetImage(
			"empty",
			undefined,
			32,
			32,
			0,
			0,
			2,
		);
		this.layer = this.tilemap.createBlankLayer("layer", [
			this.emptyTileset,
			this.filledTileset,
		]);

		this.setupCollision();
	}

	private setupCollision() {
		this.layer.setCollisionBetween(
			this.filledTileset.firstgid,
			this.filledTileset.firstgid,
		);
	}

	public setTile(x: number, y: number, filled: boolean) {
		const tileIndex = filled
			? this.filledTileset.firstgid
			: this.emptyTileset.firstgid;
		this.tilemap.putTileAt(tileIndex, x, y, true, this.layer);
	}
}

export default TilemapManager;
