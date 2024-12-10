import Phaser from "phaser";

class TextureManager {
	static readonly Textures = {
		PLAYER: {
			name: "player",
			height: 12,
			width: 12,
			count: 1,
			color: 0x0000ff,
			margin: 0,
			spacing: 0,
			noise: false,
		},
		EMPTY_TILE: {
			name: "empty",
			height: 12,
			width: 12,
			count: 1,
			color: 0x000000,
			margin: 0,
			spacing: 0,
			noise: false,
		},
		FILLED_TILE: {
			name: "filled",
			height: 12,
			width: 12,
			count: 10,
			color: 0xf0aa00,
			margin: 0,
			spacing: 0,
			noise: true,
		},
		LOOT: {
			name: "loot",
			height: 12,
			width: 12,
			count: 1,
			color: 0x00ff00,
			margin: 0,
			spacing: 0,
			noise: false,
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
			noise: boolean;
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
		this.generateTextureIfNotExists(scene, this.Textures.LOOT);
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
			noise: boolean;
		},
	) {
		const graphics = scene.add.graphics();

		for (let i = 0; i < texture.count; i++) {
			const variation = i === 0 ? 0 : Phaser.Math.Between(-10, 10);
			const color = Phaser.Display.Color.IntegerToColor(texture.color).brighten(variation).color;
			graphics.fillStyle(color, 1);

			const x = texture.margin + i * (texture.width + texture.spacing);
			graphics.fillRect(x, texture.margin, texture.width, texture.height);

			if (texture.noise) {
				this.applyValueNoise(graphics, x, texture.margin, texture.width, texture.height);
			}
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

	static applyValueNoise(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number) {
		const noiseScale = 0.1;
		const noise = new Array(width * height).fill(0).map((_, i) => {
			const nx = (i % width) * noiseScale;
			const ny = Math.floor(i / width) * noiseScale;
			return this.customValueNoise(nx, ny);
		});

		for (let i = 0; i < noise.length; i++) {
			const nx = i % width;
			const ny = Math.floor(i / width);
			const brightness = Phaser.Math.Clamp(noise[i] * 255, 0, 255);
			const color = Phaser.Display.Color.GetColor(brightness, brightness, brightness);
			graphics.fillStyle(color, 0.1);
			graphics.fillRect(x + nx, y + ny, 1, 1);
		}
	}

	static customValueNoise(x: number, y: number): number {
		const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
		return n - Math.floor(n);
	}
}

export default TextureManager;
