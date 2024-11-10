import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";

enum PlayerState {
	IDLE,
	RUNNING,
	JUMPING,
	FALLING,
	GLIDING,
}

class Player extends Phaser.Physics.Arcade.Sprite {
	private currentState: PlayerState;
	private nextState: PlayerState;

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

		this.scene.physics.add.collider(
			this,
			this.scene.physics.world.bounds,
			this.handleCollision,
			undefined,
			this,
		);
	}

	private stateMachine = {
		[PlayerState.IDLE]: {
			onEnter: () => {},
			onExecute: (inputs: { left: boolean; right: boolean }) => {
				if (inputs.left || inputs.right) {
					this.nextState = PlayerState.RUNNING;
				}
			},
			onExit: () => {},
			onCollision: () => {
				this.nextState = PlayerState.IDLE;
			},
		},
		[PlayerState.RUNNING]: {
			onEnter: (inputs: { left: boolean; right: boolean }) => {
				if (inputs.left) {
					this.setVelocityX(-200);
				} else if (inputs.right) {
					this.setVelocityX(200);
				}
			},
			onExecute: () => {},
			onExit: () => {
				this.setVelocityX(0);
			},
			onCollision: () => {
				this.nextState = PlayerState.IDLE;
			},
		},
		[PlayerState.JUMPING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
			onCollision: () => {
				this.nextState = PlayerState.FALLING;
			},
		},
		[PlayerState.FALLING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
			onCollision: () => {
				this.nextState = PlayerState.IDLE;
			},
		},
		[PlayerState.GLIDING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
			onCollision: () => {
				this.nextState = PlayerState.FALLING;
			},
		},
	};

	handleCollision() {
		this.stateMachine[this.currentState].onCollision();
	}

	public updateState(inputs: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	}) {
		if (this.nextState !== this.currentState) {
			this.stateMachine[this.currentState].onExit();
			this.currentState = this.nextState;
			this.stateMachine[this.currentState].onEnter(inputs);
		}
		this.stateMachine[this.currentState].onExecute(inputs);

		// Print the current state of the player over the player sprite using a bright, small, legible font
		const stateText = this.scene.add.text(this.x, this.y - 20, PlayerState[this.currentState], {
			fontSize: '12px',
			color: '#ffffff',
			backgroundColor: '#000000',
		});
		stateText.setOrigin(0.5, 0.5);
	}
}

export default Player;
