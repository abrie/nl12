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
  private currentState: PlayerState;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, "player");
    this.scene = scene;
    this.currentState = PlayerState.IDLE;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    TextureGenerator.generateTexture(this.scene, 0x0000ff, width, height, "player");
    this.setTexture("player");
    this.setSize(width, height);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.body.setGravityY(300);
    this.body.setCollideWorldBounds(true);
  }

  update() {
    this.handleInput();
    this.handleStateTransitions();
  }

  private handleInput() {
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(160);
    } else {
      this.body.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.body.setVelocityY(-330);
    }
  }

  private handleStateTransitions() {
    if (this.body.velocity.y > 0) {
      if (this.body.velocity.x !== 0) {
        this.currentState = PlayerState.GLIDING;
      } else {
        this.currentState = PlayerState.FALLING;
      }
    } else if (this.body.velocity.y < 0) {
      this.currentState = PlayerState.JUMPING;
    } else if (this.body.velocity.x !== 0) {
      this.currentState = PlayerState.RUNNING;
    } else {
      this.currentState = PlayerState.IDLE;
    }
  }
}

export default Player;
