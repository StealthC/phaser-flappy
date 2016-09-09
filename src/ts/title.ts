export class TitleState extends Phaser.State {
  ground: Phaser.TileSprite;
  pad1: Phaser.SinglePad;

  preload() {
    this.game.load.image('background', 'assets/background.png');
    this.game.load.spritesheet('bird', 'assets/bird.png', 92, 64);
    this.game.load.image('ground', 'assets/ground.png');
  }

  create() {
    let back = this.game.add.sprite(0, 0, 'background');
    back.width = 400;
    back.height = 600 - 64;


    let bird = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bird');
    bird.animations.add('fly', [0, 1, 2, 1], 10, true);
    bird.anchor.set(0.5, 0.5);
    bird.animations.play('fly');

    let style = { font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    let text = this.game.add.text(10, 10, 'Flappy Bird', style);
    text.setTextBounds(0, 0, 400, 400);
    this.game.input.onTap.add(() => {
      this.game.state.start('game');
    });


    this.ground = this.game.add.tileSprite(0, this.game.world.height - 64, 400, 64, 'ground');
    this.ground.tileScale.set(0.5, 0.5);

    this.game.input.gamepad.start();
    this.pad1 = this.game.input.gamepad.pad1;

  }
  update() {
    this.ground.tilePosition.x -= 4;
    if (this.pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
      this.game.state.start('game');
    }
  }
}