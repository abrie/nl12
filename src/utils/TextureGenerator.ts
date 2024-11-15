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
		numSquares: number = 1,
	) {
		const graphics = scene.add.graphics();
		const squareWidth = width / numSquares;
		const squareHeight = height / numSquares;

		for (let i = 0; i < numSquares; i++) {
			for (let j = 0; j < numSquares; j++) {
				const shade = Phaser.Display.Color.Interpolate.ColorWithColor(
					Phaser.Display.Color.ValueToColor(color),
					Phaser.Display.Color.ValueToColor(0xffffff),
					numSquares,
					i + j,
				);
				const fillColor = Phaser.Display.Color.GetColor(shade.r, shade.g, shade.b);
				graphics.fillStyle(fillColor, 1);
				graphics.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
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
