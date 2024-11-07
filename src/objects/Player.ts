import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";

enum PlayerState {
  IDLE,
  RUNNING,
  FALLING,
  JUMPING,
}

class Player extends Phaser.Physics.Arcade.Sprite {
  private state: PlayerState;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    TextureGenerator.generateTexture(scene, 0x0000ff, 32, 32, "player");
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.state = PlayerState.IDLE;
    this.setCollideWorldBounds(true);
    this.setGravityY(300);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    switch (this.state) {
      case PlayerState.IDLE:
        if (cursors.left.isDown || cursors.right.isDown) {
          this.state = PlayerState.RUNNING;
        } else if (cursors.up.isDown) {
          this.state = PlayerState.JUMPING;
        }
        break;
      case PlayerState.RUNNING:
        if (cursors.left.isDown) {
          this.setVelocityX(-160);
        } else if (cursors.right.isDown) {
          this.setVelocityX(160);
        } else {
          this.setVelocityX(0);
          this.state = PlayerState.IDLE;
        }
        if (cursors.up.isDown) {
          this.state = PlayerState.JUMPING;
        }
        break;
      case PlayerState.JUMPING:
        this.setVelocityY(-330);
        this.state = PlayerState.FALLING;
        break;
      case PlayerState.FALLING:
        if (this.body.touching.down) {
          this.state = PlayerState.IDLE;
        }
        break;
    }
  }

  handleCollision(tile: Phaser.Tilemaps.Tile) {
    if (tile.index !== -1) {
      this.setVelocity(0);
    }
  }
}

export default Player;
