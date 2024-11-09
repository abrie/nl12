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
			gravity: { y: 300 },
		},
	},
};

new Phaser.Game(config);
