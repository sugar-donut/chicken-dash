import mapJson from '../../assets/map.json';
import { Direction } from '../enums/direction';
import { Car } from '../objects/car';
import { Chicken } from '../objects/chicken';

export class GameScene extends Phaser.Scene {
  private cars: Car[] = [];
  private chickens: Chicken[] = [];

  constructor() {
    super({
      key: 'GameScene',
    });
    window.addEventListener('resize', () => {
      this.positionCamera();
    });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', '../../assets/map.json');
    this.load.image('tiles', '../../assets/tiles.png');
    this.load.image('chicken', '../../assets/chicken.png');
    this.load.image('car', '../../assets/car.png');
  }

  public create(): void {
    this.add.text(10, 10, 'Game Scene');

    const map = this.make.tilemap({
      key: 'map',
      tileHeight: mapJson.tileheight,
      tileWidth: mapJson.tilewidth,
    });

    const tileset = map.addTilesetImage('tiles');
    const staticLayer = map.createStaticLayer('Background', tileset, 0, 0);
    const coopLayer = map.createStaticLayer('Coops', tileset, 0, 0);
    staticLayer.setScale(2, 2);
    coopLayer.setScale(2, 2);

    this.positionCamera();

    const carSpawnConfig: TimerEventConfig = {
      callback: this.spawnCar,
      delay: 1000,
      loop: true,
    };

    this.time.addEvent(carSpawnConfig);
  }

  public update(): void {
    this.cars.forEach(car => car.move());
  }

  private positionCamera(): void {
    const x = window.innerWidth / 2 - mapJson.width * mapJson.tilewidth;
    const y = window.innerHeight / 2 - mapJson.height * mapJson.tileheight;
    this.cameras.main.setPosition(Math.round(x), Math.round(y));
  }

  private spawnCar = () => {
    const car = new Car(this, 0, 275, 'car', Direction.Right);
    car.setOrigin(0.5, 0);
    this.cars.push(car);
  };
}
