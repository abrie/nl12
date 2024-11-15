import Phaser from "phaser";

class TextureManager {
  static readonly Textures = {
    PLAYER: {
      name: "player",
      count: 1,
      width: 32,
      height: 32,
      spacing: 0,
      margin: 0,
    },
    EMPTY_TILE: {
      name: "empty",
      count: 1,
      width: 32,
      height: 32,
      spacing: 0,
      margin: 0,
    },
    FILLED_TILE: {
      name: "filled",
      count: 4,
      width: 32,
      height: 32,
      spacing: 2,
      margin: 2,
    },
  };

  static generateTextureIfNotExists(
    scene: Phaser.Scene,
    texture: { name: string; count: number; width: number; height: number; spacing: number; margin: number },
    color: number,
    border?: { color: number; thickness: number }
  ) {
    if (!scene.textures.exists(texture.name)) {
      this.generateTexture(scene, texture, color, border);
    }
  }

  static generateAllTextures(scene: Phaser.Scene) {
    this.generateTextureIfNotExists(scene, this.Textures.PLAYER, 0x0000ff, {
      color: 0xff0000,
      thickness: 5,
    });
    this.generateTextureIfNotExists(scene, this.Textures.EMPTY_TILE, 0x000000, {
      color: 0x000000,
      thickness: 1,
    });
    this.generateTextureIfNotExists(scene, this.Textures.FILLED_TILE, 0xf0aa00, {
      color: 0xf0ee00,
      thickness: 1,
    });
  }

  static generateTexture(
    scene: Phaser.Scene,
    texture: { name: string; count: number; width: number; height: number; spacing: number; margin: number },
    color: number,
    border?: { color: number; thickness: number }
  ) {
    const graphics = scene.add.graphics();
    const totalWidth = texture.count * (texture.width + texture.spacing) - texture.spacing + 2 * texture.margin;
    const totalHeight = texture.height + 2 * texture.margin;

    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, totalWidth, totalHeight);

    for (let i = 0; i < texture.count; i++) {
      const x = texture.margin + i * (texture.width + texture.spacing);
      const y = texture.margin;
      graphics.fillStyle(0x000000, 1);
      graphics.fillRect(x, y, texture.width, texture.height);
    }

    if (border) {
      graphics.lineStyle(border.thickness, border.color, 1);
      graphics.strokeRect(0, 0, totalWidth, totalHeight);
    }

    graphics.generateTexture(texture.name, totalWidth, totalHeight);
    graphics.destroy();
  }
}

export default TextureManager;
