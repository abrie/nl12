import Phaser from "phaser";

class TextureGenerator {
	static generateTexture(
		scene: Phaser.Scene,
		color: number,
		width: number,
		height: number,
		name: string,
	) {
		const graphics = scene.add.graphics();
		graphics.fillStyle(color, 1);
		graphics.fillRect(0, 0, width, height);

		graphics.generateTexture(name, width, height);
		graphics.destroy();
	}
}

export default TextureGenerator;
export { TextureGenerator };
