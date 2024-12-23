import Phaser from "phaser";
import TextureManager from "../utils/TextureManager";
import { Inputs } from "../utils/InputManager";
import TilemapManager from "../utils/TilemapManager";

enum PlayerState {
	IDLE,
	RUNNING,
	JUMPING,
	FALLING,
	GLIDING,
	GRAPPLING,
	DEAD,
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
	private anchorTile: Phaser.Tilemaps.Tile | null = null;
	static readonly RUNNING_VELOCITY = 250;
	static readonly GLIDING_VELOCITY = 250;
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

		TextureManager.generateTextureIfNotExists(
			scene,
			TextureManager.Textures.PLAYER,
		);
		this.setTexture(TextureManager.Textures.PLAYER.name);
		this.body?.setSize(width, height);

		this.stateText = this.scene.add.text(
			this.x,
			this.y - 20,
			this.getStateText(this.currentState),
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
				if (inputs.grappling) {
					this.nextState = PlayerState.GRAPPLING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {
				if (this.isPlayerInFilledTile()) {
					this.nextState = PlayerState.DEAD;
				}
			},
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
				if (inputs.grappling) {
					this.nextState = PlayerState.GRAPPLING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {
				if (this.isPlayerInFilledTile()) {
					this.nextState = PlayerState.DEAD;
				}
			},
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
					return;
				}
				if (this.getBody().velocity.y === 0 && this.isBlockedFromBelow()) {
					this.nextState = PlayerState.IDLE;
					return;
				}
				if (inputs.grappling) {
					this.nextState = PlayerState.GRAPPLING;
					return;
				}
				if (inputs.left && !inputs.right) {
					this.getBody().setVelocityX(-Player.RUNNING_VELOCITY);
					return;
				} else if (inputs.right && !inputs.left) {
					this.getBody().setVelocityX(Player.RUNNING_VELOCITY);
					return;
				} else {
					this.getBody().setVelocityX(0);
					return;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {
				if (this.isPlayerInFilledTile()) {
					this.nextState = PlayerState.DEAD;
				}
			},
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
				if (inputs.grappling) {
					this.nextState = PlayerState.GRAPPLING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {
				if (this.isPlayerInFilledTile()) {
					this.nextState = PlayerState.DEAD;
				}
			},
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
				if (inputs.grappling) {
					this.nextState = PlayerState.GRAPPLING;
				}
			},
			onExit: (inputs: Inputs) => {},
			onCollision: () => {
				if (this.isPlayerInFilledTile()) {
					this.nextState = PlayerState.DEAD;
				}
			},
		},
		[PlayerState.GRAPPLING]: {
			onEnter: (inputs: Inputs) => {
				this.getBody().setVelocityX(0);
				this.anchorTile = this.getGrapplingHookAnchorTile();
				if (this.anchorTile) {
					// Tint the anchor tile
					this.currentMap.layer.setTint(
						0xff00ff,
						this.anchorTile.x,
						this.anchorTile.y,
						1,
						1,
					);
					// Initialize and draw the vertical line
					this.grapplingLine = this.scene.add.line(
						this.x,
						this.y,
						0,
						0,
						0,
						this.anchorTile.pixelY - this.y + this.height,
						0xffffff,
					);
					this.grapplingLine.setScale(1, 0);
					this.grapplingLine.setLineWidth(5);
					this.grapplingLine.setOrigin(0.5, 0);
					// Add a tween to scale the grappling line from 0.5% to 100%
					this.scene.tweens.add({
						targets: this.grapplingLine,
						scaleY: { from: 0.0, to: 1 },
						duration: 25,
					});
				}
			},
			onExecute: (inputs: Inputs) => {
				if (inputs.up && !inputs.down) {
					this.getBody().setVelocityY(-Player.RUNNING_VELOCITY);
				} else if (inputs.down && !inputs.up) {
					this.getBody().setVelocityY(Player.RUNNING_VELOCITY);
				} else {
					this.getBody().setVelocityY(0);
				}
				if (!inputs.grappling) {
					this.nextState = PlayerState.FALLING;
				}
				// Update the position of the vertical line
				if (this.grapplingLine && this.anchorTile) {
					this.grapplingLine.setPosition(this.x, this.y);
					this.grapplingLine.setTo(
						0,
						0,
						0,
						this.anchorTile.pixelY - this.y + this.height,
					);
				}
			},
			onExit: (inputs: Inputs) => {
				// Clear existing tint
				this.currentMap.layer.setTint(0xffffff, 0, 0);
				// Add a tween to scale the grappling line from 100% to 0.5% before destroying it
				if (this.grapplingLine) {
					this.scene.tweens.add({
						targets: this.grapplingLine,
						scaleY: { from: 1, to: 0 },
						duration: 25,
						onComplete: () => {
							this.grapplingLine.destroy();
							this.grapplingLine = null;
						},
					});
				}
			},
			onCollision: () => {
				if (this.isPlayerInFilledTile()) {
					this.nextState = PlayerState.DEAD;
				}
			},
		},
		[PlayerState.DEAD]: {
			onEnter: (inputs: Inputs) => {
				this.getBody().setVelocity(0, 0);
			},
			onExecute: (inputs: Inputs) => {},
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
			this.stateText.setText(this.getStateText(this.currentState));
		}
		this.stateMachine[this.currentState].onExecute(inputs);
		this.stateText.setPosition(this.x, this.y);
	}

	private getStateText(state: PlayerState): string {
		switch (state) {
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
			case PlayerState.DEAD:
				return "DEAD";
			default:
				return "";
		}
	}

	private isBlockedFromBelow(): boolean {
		return this.body?.blocked.down ? true : false;
	}

	public setCurrentMap(map: TilemapManager) {
		this.currentMap = map;
	}

	private getGrapplingHookAnchorTile(): Phaser.Tilemaps.Tile | null {
		if (!this.currentMap) {
			throw new Error("Current map is not set");
		}
		return this.currentMap.getFirstFilledTileAbove(this.x, this.y);
	}

	private isPlayerInFilledTile(): boolean {
		const playerCenterX = this.x;
		const playerCenterY = this.y;
		const tile = this.currentMap.tilemap.getTileAtWorldXY(
			playerCenterX,
			playerCenterY,
		);
		return (
			tile &&
			tile.index >= this.currentMap.filledTileset.firstgid &&
			tile.index <
				this.currentMap.filledTileset.firstgid +
					this.currentMap.filledTileset.total
		);
	}
}

export default Player;
