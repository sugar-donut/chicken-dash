import { GameScene } from './scenes/game-scene';
import { MainMenuScene } from './scenes/main-menu-scene';

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
  scene: [GameScene, MainMenuScene],
  type: Phaser.AUTO,
  width: window.innerWidth,
};
