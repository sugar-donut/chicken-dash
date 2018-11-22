import mapJson from '../../assets/map.json';
import { Direction } from '../enums/direction';
import { Car } from '../objects/car';
import { Chicken } from '../objects/chicken';

export class GameScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text;

  private chickenGroup: Phaser.Physics.Arcade.Group;
  private carGroup: Phaser.Physics.Arcade.Group;

  private cars: Car[] = [];
  private chickens: Chicken[] = [];
  private carSpawns = [
    {
      direction: Direction.Right,
      x: 16,
      y: 208,
    },
    {
      direction: Direction.Right,
      x: 16,
      y: 240,
    },
    {
      direction: Direction.Left,
      x: 976,
      y: 336,
    },
    {
      direction: Direction.Left,
      x: 976,
      y: 304,
    },
  ];

  private chickenSpawns = [
    {
      direction: Direction.Down,
      x: 401,
      y: 16,
    },
    {
      direction: Direction.Down,
      x: 465,
      y: 16,
    },
    {
      direction: Direction.Down,
      x: 529,
      y: 16,
    },
    {
      direction: Direction.Down,
      x: 593,
      y: 16,
    },
    {
      direction: Direction.Up,
      x: 433,
      y: 528,
    },
    {
      direction: Direction.Up,
      x: 497,
      y: 528,
    },
    {
      direction: Direction.Up,
      x: 561,
      y: 528,
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

    this.positionCamera();

    const carSpawnConfig: TimerEventConfig = {
      callback: this.spawnCar,
      delay: 2000,
      loop: true,
    };

    const chickenSpawnConfig: TimerEventConfig = {
      callback: this.spawnChicken,
      delay: 2000,
      loop: true,
    };

    this.chickenSpawns.forEach(spawn => {
      const { x, y } = spawn;
      const sprite = this.add.sprite(x, y, 'spawn');
      sprite.setScale(2, 2);
    });

    this.carSpawns.forEach(spawn => {
      const { x, y } = spawn;
      const sprite = this.add.sprite(x, y, 'spawn');
      sprite.setScale(2, 2);
    });

    this.physics.systems.start(Phaser.Physics.Arcade);

    this.chickenGroup = this.physics.add.group();
    this.carGroup = this.physics.add.group();
    this.physics.add.group();
    this.physics.add.collider(
      this.chickenGroup,
      this.carGroup,
      this.handleChickenCollision,
      null,
      this,
    );

    this.time.addEvent(carSpawnConfig);
    this.time.addEvent(chickenSpawnConfig);

    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`);
  }

  public update(): void {
    this.cars.forEach(car => car.move());
    this.chickens.forEach(chicken => chicken.move());
  }

  private handleChickenCollision(chicken: Chicken, car: Car): void {
    chicken.hit();
    this.cameras.main.flash(300, 255, 255, 255);
    this.cameras.main.shake(500, 0.03);
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
    this.carGroup.add(car);
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
    this.chickenGroup.add(chicken);
    this.chickens.push(chicken);
  };
}
