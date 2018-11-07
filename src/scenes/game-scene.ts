export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', '../../assets/map.json');
    this.load.image('tiles', '../../assets/tiles.png');
    this.load.image('chicken', '../../assets/chicken.png');
  }

  public create(): void {
    this.add.text(10, 10, 'Game Scene');

    const map = this.make.tilemap({
      key: 'map',
      tileHeight: 16,
      tileWidth: 16,
    });

    const tileset = map.addTilesetImage('tiles');
    const staticLayer = map.createStaticLayer('Background', tileset, 0, 0);
    this.cameras.main.roundPixels = true;
    staticLayer.setScale(2, 2);

    const chicken = this.add.sprite(144, 208, 'chicken');
    chicken.setInteractive();
    chicken.on('pointerover', () => {
      chicken.alpha = 0.5;
    });

    chicken.on('pointerout', () => {
      chicken.alpha = 1;
    });
  }
}
