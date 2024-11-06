import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [PlayScene]
};

const game = new Phaser.Game(config);
