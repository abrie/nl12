import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";
import { Inputs } from "../utils/InputManager";

enum PlayerState {
	IDLE,
	RUNNING,
	JUMPING,
	FALLING,
	GLIDING,
}

interface State {
	onEnter: (inputs: Inputs) => void;
	onExecute: (inputs: Inputs) => void;
	onExit: (inputs: Inputs) => void;
	onCollision: () => void;
}

class Player extends Phaser.Physics.Arcade.Sprite {
	private currentState: PlayerState;
	private nextState: PlayerState;
	private stateText: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		super(scene, x, y, "player");
		this.currentState = PlayerState.IDLE;
		this.nextState = PlayerState.IDLE;

		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);

		TextureGenerator.generateTexture(scene, 0x0000ff, width, height, "player", {
			color: 0xff0000,
			thickness: 2,
		});
		this.setTexture("player");
		this.setOrigin(0, 0);
		this.body?.setSize(width, height);

		this.stateText = this.scene.add.text(
			this.x,
			this.y - 20,
			this.getStateText(),
			{
				fontSize: "16px",
				color: "#ffffff",
			},
		);
	}

	private stateMachine: { [key in PlayerState]: State } = {
		[PlayerState.IDLE]: {
			onEnter: (inputs: Inputs) => {
				this.body.setVelocityY(0); // Set vertical velocity to zero
			},
			onExecute: (inputs: Inputs) => {
				if (inputs.up && this.isBlockedFromBelow()) {
					this.nextState = PlayerState.JUMPING;
					return;
				}
				if (inputs.left || inputs.right) {
					this.nextState = PlayerState.RUNNING;
					return;
				}
				if (!this.isBlockedFromBelow()) {
					this.nextState = PlayerState.FALLING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
		[PlayerState.RUNNING]: {
			onEnter: (inputs: Inputs) => {
				if (inputs.left && !inputs.right) {
					this.body.setVelocityX(-150);
				} else if (inputs.right && !inputs.left) {
					this.body.setVelocityX(150);
				} else {
					this.body.setVelocityX(0);
				}
			},
			onExecute: (inputs: Inputs) => {
				if (inputs.left && !inputs.right) {
					this.body.setVelocityX(-150);
				} else if (inputs.right && !inputs.left) {
					this.body.setVelocityX(150);
				} else {
					this.body.setVelocityX(0);
				}
				if (!inputs.left && !inputs.right) {
					this.nextState = PlayerState.IDLE;
				}
				if (!this.isBlockedFromBelow()) {
					this.nextState = PlayerState.GLIDING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
		[PlayerState.JUMPING]: {
			onEnter: (inputs: Inputs) => {
				this.body.setVelocityY(-300); // Add vertical impulse
				if (inputs.left && !inputs.right) {
					this.body.setVelocityX(-150);
				} else if (inputs.right && !inputs.left) {
					this.body.setVelocityX(150);
				} else {
					this.body.setVelocityX(0);
				}
			},
			onExecute: (inputs: Inputs) => {
				if (this.body.velocity.y > 0) {
					this.nextState = PlayerState.FALLING;
				}
				if (inputs.left && !inputs.right) {
					this.body.setVelocityX(-150);
				} else if (inputs.right && !inputs.left) {
					this.body.setVelocityX(150);
				} else {
					this.body.setVelocityX(0);
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
		[PlayerState.FALLING]: {
			onEnter: (inputs: Inputs) => {},
			onExecute: (inputs: Inputs) => {
				if (inputs.left || inputs.right) {
					this.nextState = PlayerState.GLIDING;
					return;
				}
				if (this.isBlockedFromBelow()) {
					this.nextState = PlayerState.IDLE;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
		[PlayerState.GLIDING]: {
			onEnter: (inputs: Inputs) => {},
			onExecute: (inputs: Inputs) => {
				if (inputs.left && !inputs.right) {
					this.body.setVelocityX(-100);
				} else if (inputs.right && !inputs.left) {
					this.body.setVelocityX(100);
				} else if (!inputs.left && !inputs.right) {
					this.nextState = PlayerState.FALLING;
				} else if (inputs.left && inputs.right) {
					this.nextState = PlayerState.FALLING;
				}
				if (this.isBlockedFromBelow()) {
					this.nextState = PlayerState.RUNNING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
	};

	handleCollision() {
		this.stateMachine[this.currentState].onCollision();
	}

	public updateState(inputs: Inputs) {
		if (this.nextState !== this.currentState) {
			this.stateMachine[this.currentState].onExit(inputs);
			this.currentState = this.nextState;
			this.stateMachine[this.currentState].onEnter(inputs);
			this.stateText.setText(this.getStateText());
		}
		this.stateMachine[this.currentState].onExecute(inputs);
		this.stateText.setPosition(this.x, this.y - 20);
	}

	private getStateText(): string {
		switch (this.currentState) {
			case PlayerState.IDLE:
				return "IDLE";
			case PlayerState.RUNNING:
				return "RUNNING";
			case PlayerState.JUMPING:
				return "JUMPING";
			case PlayerState.FALLING:
				return "FALLING";
			case PlayerState.GLIDING:
				return "GLIDING";
			default:
				return "";
		}
	}

	private isBlockedFromBelow(): boolean {
		if (this.body) {
			return this.body.blocked.down;
		} else {
			throw new Error("Cannot access this.body because it's null");
		}
	}
}

export default Player;
