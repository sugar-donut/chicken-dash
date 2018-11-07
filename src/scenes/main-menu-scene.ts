export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MainMenuScene',
    });
  }

  public create(): void {
    this.add.text(10, 10, 'Chicken Dash');
    const startButton = this.add.text(10, 100, 'Start');
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
