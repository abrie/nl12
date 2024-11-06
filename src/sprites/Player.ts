import Phaser from "phaser";
import TextureGenerator from "../utils/TextureGenerator";

class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		TextureGenerator.generateTexture(scene, 0xff0000, width, height, "player");
		super(scene, x, y, "player");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setGravityY(300);
		this.setCollideWorldBounds(true);
	}

	update() {
		const cursors = this.scene.input.keyboard.createCursorKeys();

		if (cursors.left.isDown) {
			this.setVelocityX(-160);
		} else if (cursors.right.isDown) {
			this.setVelocityX(160);
		} else {
			this.setVelocityX(0);
		}

		if (cursors.up.isDown && this.body.blocked.down) {
			this.setVelocityY(-330);
		}
	}
}

export default Player;
