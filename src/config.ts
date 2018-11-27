import { GameScene } from './scenes/game-scene';

export const config: GameConfig = {
  height: window.innerHeight,
  parent: 'game',
  physics: {
    arcade: {
      debug: false,
    },
    default: 'arcade',
  },
  render: {
    pixelArt: true,
  },
  scene: [GameScene],
  type: Phaser.AUTO,
  width: window.innerWidth,
};
