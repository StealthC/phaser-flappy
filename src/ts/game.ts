import {Pipe} from './pipe';

export class FlappyGame extends Phaser.State {

  game: Phaser.Game;
  ground: Phaser.TileSprite;
  bird: Phaser.Sprite;
  speed: number = 2;
  clicked: boolean;
  pipeGroup: Phaser.Group;
  isGameOver: boolean = false;

  preload() {
    this.game.load.image('logo', 'assets/phaser2.png');
    this.game.load.image('background', 'assets/background.png');
    this.game.load.image('ground', 'assets/ground.png');
    this.game.load.image('pipe', 'assets/pipe.png');
    this.game.load.spritesheet('bird', 'assets/bird.png', 92, 64);
  }
  
  create() {
    this.game.physics.arcade.gravity.y = 800;

    let back = this.game.add.sprite(0, 0, 'background');
    back.width = 400;
    back.height = 600 - 64;

    this.pipeGroup = this.game.add.group();

    let pipe = new Pipe(this.game, 400);
    this.pipeGroup.add(pipe);

    this.bird = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bird');
    this.bird.animations.add('fly', [0,1,2,1], 10, true);
    this.bird.scale.set(0.5, 0.5);
    this.bird.animations.play('fly');
    this.bird.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);

    this.ground = this.game.add.tileSprite(0, this.game.world.height - 64, 400, 64, 'ground');
    this.ground.tileScale.set(0.5, 0.5);
    this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
    (<Phaser.Physics.Arcade.Body>this.ground.body).allowGravity = false;
    (<Phaser.Physics.Arcade.Body>this.ground.body).immovable = true;

    this.game.input.onDown.add(
      () => {
        if (this.isGameOver) {
          this.reset();
        } else {
          this.clicked = true;
        }
      }
    );

  }
  gameOver() {
    this.bird.animations.stop();
    this.isGameOver = true;
  }

  reset() {
    this.isGameOver = false;
    this.bird.reset(this.game.world.centerX, this.game.world.centerY);
    this.pipeGroup.removeAll();
    let nPipe = new Pipe(this.game, 400);
    this.pipeGroup.add(nPipe);
    this.bird.animations.play('fly');
  }
  update() {
    this.game.physics.arcade.collide(this.bird, this.ground, () => {
      if (!this.isGameOver) {
        this.gameOver();
      }
    });

    this.bird.rotation = Phaser.Math.angleBetween(0, 0, this.speed, this.bird.body.velocity.y / 500);;
    
    if (!this.isGameOver) {
      this.ground.tilePosition.x -= this.speed * 2;
      if (this.clicked) {
        (<Phaser.Physics.Arcade.Body>this.bird.body).velocity.y = -300;
        this.clicked = false;
      }
      this.pipeGroup.children.forEach((pipe: Pipe) => {
        if (pipe.x < -90) {
          pipe.destroy();
        }
      });
      this.pipeGroup.children.forEach((pipe: Pipe) => {
        pipe.x -= this.speed;
        this.game.physics.arcade.collide(this.bird, pipe, () => {
          this.gameOver();
        });
        
        if (pipe.x < 180 && this.pipeGroup.length === 1) {
          let nPipe = new Pipe(this.game, 400);
          this.pipeGroup.add(nPipe);
        }
      });
    } else {
      //Game Over
    }
  }
}