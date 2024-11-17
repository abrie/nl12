import Phaser from "phaser";

type Inputs = {
	up: boolean;
	down: boolean;
	left: boolean;
	right: boolean;
	grappling: boolean;
	regenerate: boolean;
};

class InputManager {
	private inputs: Inputs;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private grapplingKey: Phaser.Input.Keyboard.Key;
	private regenerateKey: Phaser.Input.Keyboard.Key;

	constructor(scene: Phaser.Scene) {
		this.inputs = { up: false, down: false, left: false, right: false, grappling: false, regenerate: false };
		this.cursors = scene.input.keyboard.createCursorKeys();
		this.grapplingKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.regenerateKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
	}

	public update() {
		this.inputs.up = this.cursors.up.isDown;
		this.inputs.down = this.cursors.down.isDown;
		this.inputs.left = this.cursors.left.isDown;
		this.inputs.right = this.cursors.right.isDown;
		this.inputs.grappling = this.grapplingKey.isDown;
		this.inputs.regenerate = this.regenerateKey.isDown;
	}

	public getInputs(): Inputs {
		return this.inputs;
	}

	public isJumping() {
		return this.inputs.up;
	}
}

export default InputManager;
