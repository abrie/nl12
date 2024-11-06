import Phaser from 'phaser';
import Player from './player';
import Collision from './collision';
import Score from './score';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
  this.add.image(400, 300, 'sky');

  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  const player = new Player(this);
  const collision = new Collision(this, platforms);
  const score = new Score(this);

  this.physics.add.collider(player.sprite, platforms);
  this.physics.add.collider(player.sprite, collision.obstacles);
  this.physics.add.overlap(player.sprite, score.stars, score.collectStar, null, this);
}

function update() {
  player.update();
}

export default game;
