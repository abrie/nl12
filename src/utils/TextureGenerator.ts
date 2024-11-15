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
		variation?: number,
	) {
		const graphics = scene.add.graphics();
		const numVariations = variation || 1;
		const squareWidth = width / numVariations;
		const squareHeight = height / numVariations;

		for (let i = 0; i < numVariations; i++) {
			for (let j = 0; j < numVariations; j++) {
				const variationColor = Phaser.Display.Color.Interpolate.ColorWithColor(
					Phaser.Display.Color.ValueToColor(color),
					Phaser.Display.Color.ValueToColor(0xffffff),
					numVariations,
					i + j,
				);
				const fillColor = Phaser.Display.Color.GetColor(
					variationColor.r,
					variationColor.g,
					variationColor.b,
				);
				graphics.fillStyle(fillColor, 1);
				graphics.fillRect(
					i * squareWidth,
					j * squareHeight,
					squareWidth,
					squareHeight,
				);
			}
		}

		if (border) {
			graphics.lineStyle(border.thickness, border.color, 1);
			graphics.strokeRect(0, 0, width, height);
		}

		graphics.generateTexture(name, width, height);
		graphics.destroy();
	}
}

export default TextureGenerator;
