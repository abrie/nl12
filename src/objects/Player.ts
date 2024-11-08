import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";

enum PlayerState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  FALLING = "FALLING",
  JUMPING = "JUMPING",
  GLIDING = "GLIDING",
}

class Player extends Phaser.Physics.Arcade.Sprite {
  private currentState: PlayerState;
  private stateMachine: { [key in PlayerState]: PlayerState[] };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    TextureGenerator.generateTexture(scene, 0x0000ff, 25, 25, "player");
    super(scene, x, y, "player");
    this.currentState = PlayerState.IDLE;
    this.stateMachine = {
      [PlayerState.IDLE]: [PlayerState.RUNNING, PlayerState.JUMPING],
      [PlayerState.RUNNING]: [PlayerState.JUMPING, PlayerState.IDLE, PlayerState.GLIDING],
      [PlayerState.JUMPING]: [PlayerState.FALLING],
      [PlayerState.FALLING]: [PlayerState.IDLE, PlayerState.GLIDING],
      [PlayerState.GLIDING]: [PlayerState.FALLING, PlayerState.RUNNING, PlayerState.IDLE],
    };
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setGravityY(300);
  }

  update() {
    switch (this.currentState) {
      case PlayerState.IDLE:
        this.handleIdleState();
        break;
      case PlayerState.RUNNING:
        this.handleRunningState();
        break;
      case PlayerState.FALLING:
        this.handleFallingState();
        break;
      case PlayerState.JUMPING:
        this.handleJumpingState();
        break;
      case PlayerState.GLIDING:
        this.handleGlidingState();
        break;
    }
  }

  private handleIdleState() {
    if (this.body.velocity.x !== 0) {
      this.transitionToState(PlayerState.RUNNING);
    } else if (this.body.velocity.y < 0) {
      this.transitionToState(PlayerState.JUMPING);
    }
  }

  private handleRunningState() {
    if (this.body.velocity.x === 0) {
      this.transitionToState(PlayerState.IDLE);
    } else if (this.body.velocity.y > 0) {
      this.transitionToState(PlayerState.GLIDING);
    }
  }

  private handleFallingState() {
    if (this.body.velocity.y === 0) {
      this.transitionToState(PlayerState.IDLE);
    } else if (this.body.velocity.x !== 0) {
      this.transitionToState(PlayerState.GLIDING);
    }
  }

  private handleJumpingState() {
    if (this.body.velocity.y > 0) {
      this.transitionToState(PlayerState.FALLING);
    }
  }

  private handleGlidingState() {
    if (this.body.velocity.y === 0) {
      this.transitionToState(PlayerState.IDLE);
    } else if (this.body.velocity.x === 0) {
      this.transitionToState(PlayerState.FALLING);
    }
  }

  private transitionToState(newState: PlayerState) {
    if (this.stateMachine[this.currentState].includes(newState)) {
      this.currentState = newState;
    }
  }
}

export default Player;
