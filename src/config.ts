import { GameScene } from './scenes/game-scene';
import { MainMenuScene } from './scenes/main-menu-scene';

export const config: GameConfig = {
  height: 640,
  parent: 'game',
  scene: [MainMenuScene, GameScene],
  type: Phaser.AUTO,
  width: 640,
};
