import Phaser from "phaser";

class TextureManager {
	static readonly Textures = {
		PLAYER: {
			name: "player",
			height: 25,
			width: 25,
			count: 1,
			color: 0x0000ff,
			margin: 0,
			spacing: 0,
		},
		EMPTY_TILE: {
			name: "empty",
			height: 25,
			width: 25,
			count: 1,
			color: 0x000000,
			margin: 0,
			spacing: 0,
		},
		FILLED_TILE: {
			name: "filled",
			height: 25,
			width: 25,
			count: 10,
			color: 0xf0aa00,
			margin: 0,
			spacing: 0,
		},
	};

	static generateTextureIfNotExists(
		scene: Phaser.Scene,
		texture: {
			name: string;
			height: number;
			width: number;
			count: number;
			color: number;
			margin: number;
			spacing: number;
		},
	) {
		if (!scene.textures.exists(texture.name)) {
			this.generateTexture(scene, texture);
		}
	}

	static generateAllTextures(scene: Phaser.Scene) {
		this.generateTextureIfNotExists(scene, this.Textures.PLAYER);
		this.generateTextureIfNotExists(scene, this.Textures.EMPTY_TILE);
		this.generateTextureIfNotExists(scene, this.Textures.FILLED_TILE);
	}

	static generateTexture(
		scene: Phaser.Scene,
		texture: {
			name: string;
			height: number;
			width: number;
			count: number;
			color: number;
			margin: number;
			spacing: number;
		},
	) {
		const graphics = scene.add.graphics();

		for (let i = 0; i < texture.count; i++) {
			const variation = Phaser.Display.Color.IntegerToColor(texture.color).clone();
			variation.darken(i * 5); // Slightly darken each subsequent rectangle
			graphics.fillStyle(variation.color, 1);

			const x = texture.margin + i * (texture.width + texture.spacing);
			graphics.fillRect(x, texture.margin, texture.width, texture.height);
		}

		graphics.generateTexture(
			texture.name,
			texture.width * texture.count +
				texture.spacing * (texture.count - 1) +
				texture.margin * 2,
			texture.height + texture.margin * 2,
		);
		graphics.destroy();
	}
}

export default TextureManager;
