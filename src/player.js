class Player {
  constructor(scene) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(100, 450, 'dude');
    this.sprite.setBounce(0.2);
    this.sprite.setCollideWorldBounds(true);

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-160);
      this.sprite.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(160);
      this.sprite.anims.play('right', true);
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(-330);
    }
  }
}

export default Player;
