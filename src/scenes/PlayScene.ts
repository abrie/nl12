import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";

class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
    // Load assets here
  }

  create() {
    const textureName = "solidColorTexture";
    TextureGenerator.generateTexture(this, 0xff0000, 100, 100, textureName);
    this.add.image(400, 300, textureName);
  }

  update() {
    // Update game objects here
  }
}

export default PlayScene;
