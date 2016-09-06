import { FlappyGame } from './game';
import { TitleState } from './title';

class MainGame {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(400, 600, Phaser.AUTO, '', this);
    
    
  }
  preload() {
    this.game.state.add('game', FlappyGame);
    this.game.state.add('title', TitleState);
  }
  create() {
   
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //this.game.scale.forceOrientation(false, true);
    this.game.scale.pageAlignVertically = true;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();
    this.game.state.start('title');
  }
}
var game = new MainGame();