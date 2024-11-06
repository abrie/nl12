import Phaser from "phaser";
import TextureGenerator from "./TextureGenerator";

class TilemapManager {
  private scene: Phaser.Scene;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createTilemap();
  }

  private createTilemap() {
    const emptyTexture = TextureGenerator.generateTexture(this.scene, 0xffffff, 32, 32, "empty");
    const filledTexture = TextureGenerator.generateTexture(this.scene, 0x000000, 32, 32, "filled");

    this.tilemap = this.scene.make.tilemap({ width: 10, height: 10, tileWidth: 32, tileHeight: 32 });
    this.tileset = this.tilemap.addTilesetImage("tiles", null, 32, 32, 0, 0, [emptyTexture, filledTexture]);
    this.layer = this.tilemap.createBlankLayer("layer", this.tileset);

    this.setupCollision();
  }

  private setupCollision() {
    this.layer.setCollisionBetween(1, 1);
  }

  public setTile(x: number, y: number, filled: boolean) {
    const tileIndex = filled ? 1 : 0;
    this.tilemap.putTileAt(tileIndex, x, y, true, this.layer);
  }
}

export default TilemapManager;
