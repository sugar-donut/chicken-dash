import 'phaser';

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);

    window.addEventListener('resize', () => {
      this.resize(window.innerWidth, window.innerHeight);
    });
  }
}
