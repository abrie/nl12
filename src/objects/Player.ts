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

		TextureGenerator.generateTexture(scene, 0x0000ff, width, height, "player");
		this.setTexture("player");

		this.setGravityY(300); // Set gravity for the player
	}

	private stateMachine = {
		[PlayerState.IDLE]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
		},
		[PlayerState.RUNNING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
		},
		[PlayerState.JUMPING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
		},
		[PlayerState.FALLING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
		},
		[PlayerState.GLIDING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
		},
	};

	public updateState(inputs: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	}) {
		if (this.nextState !== this.currentState) {
			this.stateMachine[this.currentState].onExit();
			this.currentState = this.nextState;
			this.stateMachine[this.currentState].onEnter();
		}
		this.stateMachine[this.currentState].onExecute();
	}
}

export default Player;
