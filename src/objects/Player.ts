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
	}

	private stateMachine = {
		[PlayerState.IDLE]: {
			onEnter: () => {},
			onExecute: (inputs: Inputs) => {},
			onExit: () => {},
		},
		[PlayerState.RUNNING]: {
			onEnter: () => {},
			onExecute: (inputs: Inputs) => {},
			onExit: () => {},
		},
		[PlayerState.JUMPING]: {
			onEnter: () => {},
			onExecute: (inputs: Inputs) => {},
			onExit: () => {},
		},
		[PlayerState.FALLING]: {
			onEnter: () => {},
			onExecute: (inputs: Inputs) => {},
			onExit: () => {},
		},
		[PlayerState.GLIDING]: {
			onEnter: () => {},
			onExecute: (inputs: Inputs) => {},
			onExit: () => {},
		},
	};

	public updateState(inputs: Inputs) {
		if (this.nextState !== this.currentState) {
			this.stateMachine[this.currentState].onExit();
			this.currentState = this.nextState;
			this.stateMachine[this.currentState].onEnter();
		}
		this.stateMachine[this.currentState].onExecute(inputs);
	}
}

export default Player;
