import mapJson from '../../assets/map.json';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MainMenuScene',
    });
    window.addEventListener('resize', () => {
      this.positionCamera();
    });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', '../../assets/map.json');
    this.load.image('tiles', '../../assets/tiles.png');
    this.load.image('logo', '../../assets/logo.png');
    this.load.image('start', '../../assets/start.png');
  }

  public create(): void {
    this.cameras.main.setViewport(0, 0, 992, 544);

    const map = this.make.tilemap({
      key: 'map',
      tileHeight: mapJson.tileheight,
      tileWidth: mapJson.tilewidth,
    });

    const tileset = map.addTilesetImage('tiles');
    const backgroundLayer = map.createStaticLayer('Background', tileset, 0, 0);
    const objectLayer = map.createStaticLayer('Objects', tileset, 0, 0);
    backgroundLayer.setScale(2, 2);
    objectLayer.setScale(2, 2);

    const logo = this.add.image(500, 100, 'logo');
    logo.setScale(8, 8);

    const startButton = this.add.image(500, 300, 'start');
    startButton.setScale(4, 4);

    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.positionCamera();
  }

  private positionCamera(): void {
    const x = window.innerWidth / 2 - mapJson.width * mapJson.tilewidth;
    const y = window.innerHeight / 2 - mapJson.height * mapJson.tileheight;
    this.cameras.main.setPosition(Math.round(x), Math.round(y));
  }
}
