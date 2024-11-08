import Phaser from "phaser";
import { stateMachine, PlayerState } from "../utils/StateMachine";
import TextureGenerator from "../utils/TextureGenerator";

class Player extends Phaser.Physics.Arcade.Sprite {
  private currentState: PlayerState;
  private stateText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    this.currentState = PlayerState.IDLE;
    this.stateText = scene.add.text(10, 10, this.currentState, { fontSize: '16px', fill: '#fff' });
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setGravityY(300);
  }

  private transitionToState(newState: PlayerState) {
    if (stateMachine[this.currentState].includes(newState)) {
      this.currentState = newState;
      this.printCurrentState();
    }
  }

  private printCurrentState() {
    this.stateText.setText(this.currentState);
  }

  private handleState() {
    switch (this.currentState) {
      case PlayerState.IDLE:
        if (this.body.velocity.y > 0) {
          this.transitionToState(PlayerState.FALLING);
        } else if (this.body.velocity.x !== 0) {
          this.transitionToState(PlayerState.RUNNING);
        }
        break;
      case PlayerState.RUNNING:
        if (this.body.velocity.y > 0) {
          this.transitionToState(PlayerState.GLIDING);
        } else if (this.body.velocity.x === 0) {
          this.transitionToState(PlayerState.IDLE);
        }
        break;
      case PlayerState.JUMPING:
        if (this.body.velocity.y > 0) {
          this.transitionToState(PlayerState.FALLING);
        }
        break;
      case PlayerState.FALLING:
        if (this.body.velocity.y === 0) {
          if (this.body.velocity.x === 0) {
            this.transitionToState(PlayerState.IDLE);
          } else {
            this.transitionToState(PlayerState.RUNNING);
          }
        } else if (this.body.velocity.x !== 0) {
          this.transitionToState(PlayerState.GLIDING);
        }
        break;
      case PlayerState.GLIDING:
        if (this.body.velocity.y === 0) {
          if (this.body.velocity.x === 0) {
            this.transitionToState(PlayerState.IDLE);
          } else {
            this.transitionToState(PlayerState.RUNNING);
          }
        } else if (this.body.velocity.x === 0) {
          this.transitionToState(PlayerState.FALLING);
        }
        break;
    }
  }

  public update() {
    this.handleState();
  }
}

export default Player;
