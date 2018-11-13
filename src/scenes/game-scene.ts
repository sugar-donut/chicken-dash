import mapJson from '../../assets/map.json';
import { Direction } from '../enums/direction';
import { Car } from '../objects/car';
import { Chicken } from '../objects/chicken';

export class GameScene extends Phaser.Scene {
  private cars: Car[] = [];
  private chickens: Chicken[] = [];
  private carSpawns = [
    {
      direction: Direction.Right,
      x: 0,
      y: 275,
    },
    {
      direction: Direction.Right,
      x: 0,
      y: 305,
    },
    {
      direction: Direction.Left,
      x: 640,
      y: 335,
    },
    {
      direction: Direction.Left,
      x: 640,
      y: 365,
    },
    {
      direction: Direction.Down,
      x: 275,
      y: 0,
    },
    {
      direction: Direction.Down,
      x: 305,
      y: 0,
    },
    {
      direction: Direction.Up,
      x: 335,
      y: 640,
    },
    {
      direction: Direction.Up,
      x: 365,
      y: 640,
    },
  ];

  private chickenSpawns = [
    {
      direction: Direction.Down,
      x: 144,
      y: 112,
    },
    {
      direction: Direction.Up,
      x: 208,
      y: 528,
    },
    {
      direction: Direction.Right,
      x: 112,
      y: 144,
    },
    {
      direction: Direction.Left,
      x: 528,
      y: 208,
    },
    {
      direction: Direction.Right,
      x: 112,
      y: 432,
    },
    {
      direction: Direction.Up,
      x: 496,
      y: 528,
    },
    {
      direction: Direction.Left,
      x: 528,
      y: 496,
    },
    {
      direction: Direction.Down,
      x: 432,
      y: 112,
    },
  ];

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

    // Debug
    this.load.image('spawn', '../../assets/spawn.png');
  }

  public create(): void {
    this.cameras.main.setViewport(0, 0, 640, 640);

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

    const chickenSpawnConfig: TimerEventConfig = {
      callback: this.spawnChicken,
      delay: 1000,
      loop: true,
    };

    this.chickenSpawns.forEach(spawn => {
      const { x, y } = spawn;
      const sprite = this.add.sprite(x, y, 'spawn');
      sprite.setScale(2, 2);
    });

    this.time.addEvent(carSpawnConfig);
    this.time.addEvent(chickenSpawnConfig);
  }

  public update(): void {
    this.cars.forEach(car => car.move());
    this.chickens.forEach(chicken => chicken.move());
  }

  private positionCamera(): void {
    const x = window.innerWidth / 2 - mapJson.width * mapJson.tilewidth;
    const y = window.innerHeight / 2 - mapJson.height * mapJson.tileheight;
    this.cameras.main.setPosition(Math.round(x), Math.round(y));
  }

  private spawnCar = () => {
    const randomSpawnIndex = Math.floor(Math.random() * this.carSpawns.length);
    const spawn = this.carSpawns[randomSpawnIndex];
    const { x, y, direction } = spawn;
    const car = new Car(this, x, y, 'car', direction);
    car.setOrigin(0.5, 0);
    this.cars.push(car);
  };

  private spawnChicken = () => {
    const randomSpawnIndex = Math.floor(
      Math.random() * this.chickenSpawns.length,
    );
    const spawn = this.chickenSpawns[randomSpawnIndex];
    const { x, y, direction } = spawn;
    const chicken = new Chicken(this, x, y, 'chicken', direction);
    chicken.setOrigin(0.5, 0);
    this.chickens.push(chicken);
  };
}
