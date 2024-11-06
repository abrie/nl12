import Phaser from 'phaser';

export class TextureFactory {
  static GenerateSolidColor(name: string, width: number, height: number, color: string): void {
    const game = Phaser.Game.instance;
    if (!game) {
      throw new Error('Phaser game instance not found.');
    }

    const graphics = game.add.graphics(0, 0);
    graphics.beginFill(Phaser.Color.hexToRGB(color));
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();

    game.cache.addBitmapData(name, graphics.generateTexture());
  }
}
