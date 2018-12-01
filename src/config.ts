import { GameScene } from './scenes/game-scene';

export const config: GameConfig = {
  height: 544,
  parent: 'game',
  physics: {
    arcade: {
      debug: true,
    },
    default: 'arcade',
  },
  render: {
    pixelArt: true,
  },
  scene: [GameScene],
  type: Phaser.AUTO,
  width: 992,
};
