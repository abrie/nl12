import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";

enum PlayerState {
  IDLE,
  RUNNING,
  FALLING,
  JUMPING,
  GLIDING,
}

class Player extends Phaser.Physics.Arcade.Sprite {
  private state: PlayerState;
  private inputs: { up: boolean; left: boolean; right: boolean };

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, "player");
    this.state = PlayerState.IDLE;
    this.inputs = { up: false, left: false, right: false };

    this.setSize(width, height);
    this.setCollideWorldBounds(true);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    TextureGenerator.generateTexture(scene, 0x0000ff, width, height, "player");
    this.setTexture("player");
  }

  updateStateAndVelocity(inputs: { up: boolean; left: boolean; right: boolean }) {
    this.inputs = inputs;

    if (this.inputs.left) {
      this.setVelocityX(-160);
    } else if (this.inputs.right) {
      this.setVelocityX(160);
    } else {
      this.setVelocityX(0);
    }

    if (this.inputs.up && this.body.touching.down) {
      this.setVelocityY(-330);
    }

    if (this.body.velocity.y > 0) {
      if (this.body.velocity.x !== 0) {
        this.state = PlayerState.GLIDING;
      } else {
        this.state = PlayerState.FALLING;
      }
    } else if (this.body.velocity.y < 0) {
      this.state = PlayerState.JUMPING;
    } else if (this.body.velocity.x !== 0) {
      this.state = PlayerState.RUNNING;
    } else {
      this.state = PlayerState.IDLE;
    }
  }
}

export default Player;
