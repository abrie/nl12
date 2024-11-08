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
  private stateTransitionTable: { [key: string]: PlayerState };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    this.state = PlayerState.IDLE;
    this.stateTransitionTable = {
      "IDLE-RUNNING": PlayerState.RUNNING,
      "IDLE-JUMPING": PlayerState.JUMPING,
      "RUNNING-JUMPING": PlayerState.JUMPING,
      "RUNNING-IDLE": PlayerState.IDLE,
      "RUNNING-GLIDING": PlayerState.GLIDING,
      "JUMPING-FALLING": PlayerState.FALLING,
      "FALLING-IDLE": PlayerState.IDLE,
      "FALLING-GLIDING": PlayerState.GLIDING,
      "GLIDING-FALLING": PlayerState.FALLING,
      "GLIDING-RUNNING": PlayerState.RUNNING,
      "GLIDING-IDLE": PlayerState.IDLE,
    };

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    TextureGenerator.generateTexture(scene, 0x0000ff, 50, 50, "player");
    this.setTexture("player");
    this.setCollideWorldBounds(true);
  }

  private getNextState(currentState: PlayerState, conditions: string): PlayerState {
    const key = `${PlayerState[currentState]}-${conditions}`;
    return this.stateTransitionTable[key] || currentState;
  }

  public updateState(conditions: string) {
    this.state = this.getNextState(this.state, conditions);
  }

  public update() {
    if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
      this.updateState("FALLING");
    } else if (this.body.velocity.y > 0 && this.body.velocity.x !== 0) {
      this.updateState("GLIDING");
    } else if (this.body.velocity.y === 0 && this.body.velocity.x !== 0) {
      this.updateState("RUNNING");
    } else {
      this.updateState("IDLE");
    }
  }
}

export default Player;
