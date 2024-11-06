class Collision {
  constructor(scene, platforms) {
    this.scene = scene;
    this.platforms = platforms;
    this.obstacles = scene.physics.add.group();

    this.createObstacles();
  }

  createObstacles() {
    this.obstacles.create(400, 300, 'bomb');
    this.obstacles.create(600, 200, 'bomb');
    this.obstacles.create(50, 150, 'bomb');
  }
}

export default Collision;
