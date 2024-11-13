import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";
import { Inputs } from "../utils/InputManager";
import TilemapManager from "../utils/TilemapManager";

enum PlayerState {
	IDLE,
	RUNNING,
	JUMPING,
	FALLING,
	GLIDING,
	GRAPPLING,
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
	private currentMap: TilemapManager;
	private grapplingLine: Phaser.GameObjects.Line;
	private anchorTile: { x: number; y: number } | null;

	static readonly RUNNING_VELOCITY = 150;
	static readonly GLIDING_VELOCITY = 100;
	static readonly JUMPING_VELOCITY = 300;

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

	private getBody(): Phaser.Physics.Arcade.Body {
		if (this.body instanceof Phaser.Physics.Arcade.Body) {
			return this.body;
		} else {
			throw new Error(
				"Type guard: body is not an instance of Phaser.Physics.Arcade.Body",
			);
		}
	}

	private stateMachine: { [key in PlayerState]: State } = {
		[PlayerState.IDLE]: {
			onEnter: (inputs: Inputs) => {
				this.getBody().setVelocityY(0); // Set vertical velocity to zero
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
					this.getBody().setVelocityX(-Player.RUNNING_VELOCITY);
				} else if (inputs.right && !inputs.left) {
					this.getBody().setVelocityX(Player.RUNNING_VELOCITY);
				} else {
					this.getBody().setVelocityX(0);
				}
			},
			onExecute: (inputs: Inputs) => {
				if (inputs.left && !inputs.right) {
					this.getBody().setVelocityX(-Player.RUNNING_VELOCITY);
				} else if (inputs.right && !inputs.left) {
					this.getBody().setVelocityX(Player.RUNNING_VELOCITY);
				} else {
					this.getBody().setVelocityX(0);
				}
				if (!inputs.left && !inputs.right) {
					this.nextState = PlayerState.IDLE;
				}
				if (!this.isBlockedFromBelow()) {
					this.nextState = PlayerState.GLIDING;
				}
				if (inputs.up && this.isBlockedFromBelow()) {
					this.nextState = PlayerState.JUMPING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
		[PlayerState.JUMPING]: {
			onEnter: (inputs: Inputs) => {
				this.getBody().setVelocityY(-Player.JUMPING_VELOCITY); // Add vertical impulse
				if (inputs.left && !inputs.right) {
					this.getBody().setVelocityX(-Player.RUNNING_VELOCITY);
				} else if (inputs.right && !inputs.left) {
					this.getBody().setVelocityX(Player.RUNNING_VELOCITY);
				} else {
					this.getBody().setVelocityX(0);
				}
			},
			onExecute: (inputs: Inputs) => {
				if (this.getBody().velocity.y > 0) {
					this.nextState = PlayerState.FALLING;
				}
				if (inputs.left && !inputs.right) {
					this.getBody().setVelocityX(-Player.RUNNING_VELOCITY);
				} else if (inputs.right && !inputs.left) {
					this.getBody().setVelocityX(Player.RUNNING_VELOCITY);
				} else {
					this.getBody().setVelocityX(0);
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {},
		},
		[PlayerState.FALLING]: {
			onEnter: (inputs: Inputs) => {
				this.getBody().setVelocityX(0);
			},
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
					this.getBody().setVelocityX(-Player.GLIDING_VELOCITY);
				} else if (inputs.right && !inputs.left) {
					this.getBody().setVelocityX(Player.GLIDING_VELOCITY);
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
		[PlayerState.GRAPPLING]: {
			onEnter: (inputs: Inputs) => {
				this.getBody().setVelocityX(0);
				this.anchorTile = this.computeGrapplingHookAnchorTile();
				if (this.anchorTile) {
					this.grapplingLine = this.scene.add.line(
						0,
						0,
						this.x + this.width / 2,
						this.y + this.height / 2,
						this.anchorTile.x * this.currentMap.tilemap.tileWidth + this.currentMap.tilemap.tileWidth / 2,
						this.anchorTile.y * this.currentMap.tilemap.tileHeight + this.currentMap.tilemap.tileHeight,
						0xffffff,
					).setOrigin(0, 0);
				}
			},
			onExecute: (inputs: Inputs) => {
				if (inputs.up && !inputs.down) {
					this.y -= 2;
				} else if (inputs.down && !inputs.up) {
					this.y += 2;
				}
				if (!inputs.up && !inputs.down) {
					this.nextState = PlayerState.FALLING;
				}
			},
			onExit: (inputs: Inputs) => {
				if (this.grapplingLine) {
					this.grapplingLine.destroy();
				}
			},
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
			case PlayerState.GRAPPLING:
				return "GRAPPLING";
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

	public setCurrentMap(map: TilemapManager) {
		this.currentMap = map;
	}

	private computeGrapplingHookAnchorTile(): { x: number; y: number } | null {
		if (!this.currentMap) {
			return null;
		}
		const playerTileX = Math.floor(this.x / this.currentMap.tilemap.tileWidth);
		const playerTileY = Math.floor(this.y / this.currentMap.tilemap.tileHeight);
		return this.currentMap.findFirstFilledTileAbove(playerTileX, playerTileY);
	}
}

export default Player;
