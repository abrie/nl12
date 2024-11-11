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
	}

	private stateMachine = {
		[PlayerState.IDLE]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
			onCollision: () => {
				this.nextState = PlayerState.IDLE;
			},
		},
		[PlayerState.RUNNING]: {
			onEnter: () => {},
			onExecute: () => {},
			onExit: () => {},
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
			this.stateMachine[this.currentState].onEnter();
		}
		this.stateMachine[this.currentState].onExecute();
	}
}

export default Player;
