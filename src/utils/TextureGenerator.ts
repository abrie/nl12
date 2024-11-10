import Phaser from "phaser";

interface Border {
	color: number;
	thickness: number;
}

class TextureGenerator {
	static generateTexture(
		scene: Phaser.Scene,
		color: number,
		width: number,
		height: number,
		name: string,
		border?: Border,
	) {
		const graphics = scene.add.graphics();
		graphics.fillStyle(color, 1);
		graphics.fillRect(0, 0, width, height);

		if (border) {
			graphics.lineStyle(border.thickness, border.color, 1);
			graphics.strokeRect(0, 0, width, height);
		}

		graphics.generateTexture(name, width, height);
		graphics.destroy();
	}
}

export default TextureGenerator;
