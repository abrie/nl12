import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [PlayScene],
	physics: {
		default: "arcade",

		arcade: {
			gravity: { x: 0, y: 300 },
			debug: true,
		},
	},
};

new Phaser.Game(config);
