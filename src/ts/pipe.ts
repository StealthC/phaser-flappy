export class Pipe extends Phaser.Group {
  constructor(game, x = 0, y?, opening = 150) {
    super(game);

    if (y === undefined) {
      y = Math.floor(Math.random() * (350 - 0)) + 0;
    }

    let pipe = new Phaser.Sprite(game, 0, 50, 'pipe');
    pipe.scale.set(0.5, -0.5);
    this.game.physics.enable(pipe, Phaser.Physics.ARCADE);
    (<Phaser.Physics.Arcade.Body>pipe.body).allowGravity = false;
    (<Phaser.Physics.Arcade.Body>pipe.body).immovable = true;

    let pipe2 = new Phaser.Sprite(game, 0, 50 + opening, 'pipe');
    pipe2.scale.set(0.5, 0.5);
    this.game.physics.enable(pipe2, Phaser.Physics.ARCADE);
    (<Phaser.Physics.Arcade.Body>pipe2.body).allowGravity = false;
    (<Phaser.Physics.Arcade.Body>pipe2.body).immovable = true;

    this.add(pipe);
    this.add(pipe2);
    this.x = x;
    this.y = y;
  }
}