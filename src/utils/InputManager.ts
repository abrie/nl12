import Phaser from "phaser";

class InputManager {
  private inputs: { up: boolean; down: boolean; left: boolean; right: boolean };
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene) {
    this.inputs = { up: false, down: false, left: false, right: false };
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  public update() {
    this.inputs.up = this.cursors.up.isDown;
    this.inputs.down = this.cursors.down.isDown;
    this.inputs.left = this.cursors.left.isDown;
    this.inputs.right = this.cursors.right.isDown;
  }

  public getInputs() {
    return this.inputs;
  }

  public isJumping() {
    return this.inputs.up;
  }
}

export default InputManager;
