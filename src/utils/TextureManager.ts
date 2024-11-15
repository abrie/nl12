import Phaser from "phaser";

class TextureManager {
  static readonly Textures = {
    PLAYER: "player",
    EMPTY_TILE: "empty",
    FILLED_TILE: "filled",
  };

  static generateTextureIfNotExists(
    scene: Phaser.Scene,
    color: number,
    width: number,
    height: number,
    name: string,
    border?: { color: number; thickness: number }
  ) {
    if (!scene.textures.exists(name)) {
      this.generateTexture(scene, color, width, height, name, border);
    }
  }

  static generateAllTextures(scene: Phaser.Scene, width: number, height: number) {
    this.generateTextureIfNotExists(scene, 0x0000ff, width, height, this.Textures.PLAYER, {
      color: 0xff0000,
      thickness: 5,
    });
    this.generateTextureIfNotExists(scene, 0x000000, width, height, this.Textures.EMPTY_TILE, {
      color: 0x000000,
      thickness: 1,
    });
    this.generateTextureIfNotExists(scene, 0xf0aa00, width, height, this.Textures.FILLED_TILE, {
      color: 0xf0ee00,
      thickness: 1,
    });
  }

  static generateTexture(
    scene: Phaser.Scene,
    color: number,
    width: number,
    height: number,
    name: string,
    border?: { color: number; thickness: number }
  ) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);

    if (border) {
      graphics.lineStyle(border.thickness, border.color, 1);
      graphics.strokeRect(0, 0, width, height);
    }

    graphics.generateTexture(name, width, height);
    graphics.destroy();
  }
}

export default TextureManager;
