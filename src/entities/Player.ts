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
  private width: number;
  private height: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, "player");
    this.width = width;
    this.height = height;
    this.state = PlayerState.IDLE;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setGravityY(300);
    this.setSize(width, height);
  }

  update(inputs: { up: boolean; down: boolean; left: boolean; right: boolean }) {
    const { up, down, left, right } = inputs;

    if (this.body.blocked.down) {
      if (up) {
        this.setVelocityY(-300);
        this.state = PlayerState.JUMPING;
      } else if (left || right) {
        this.setVelocityX(left ? -160 : 160);
        this.state = PlayerState.RUNNING;
      } else {
        this.setVelocityX(0);
        this.state = PlayerState.IDLE;
      }
    } else {
      if (this.body.velocity.y > 0) {
        if (left || right) {
          this.setVelocityX(left ? -160 : 160);
          this.state = PlayerState.GLIDING;
        } else {
          this.setVelocityX(0);
          this.state = PlayerState.FALLING;
        }
      } else if (this.body.velocity.y < 0) {
        this.state = PlayerState.JUMPING;
      }
    }
  }
}

export default Player;
