import Phaser from "phaser";

type Inputs = {
	up: boolean;
	down: boolean;
	left: boolean;
	right: boolean;
};

class InputManager {
	private inputs: Inputs;
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

	public getInputs(): Inputs {
		return this.inputs;
	}

	public isJumping() {
		return this.inputs.up;
	}
}

export default InputManager;
