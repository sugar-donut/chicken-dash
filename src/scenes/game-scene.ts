export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', '../../assets/map.json');
    this.load.image('tiles', '../../assets/tiles.png');
  }

  public create(): void {
    this.add.text(10, 10, 'Game Scene');

    const map = this.make.tilemap({ key: 'map', tileWidth: 16 });
    const tileset = map.addTilesetImage('tiles');
    const staticLayer = map.createStaticLayer('Background', tileset, 0, 0);
  }
}
