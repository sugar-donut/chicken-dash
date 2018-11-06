export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MainMenuScene',
    });
  }

  public create(): void {
    this.add.text(10, 10, 'Chicken Dash');
  }
}
