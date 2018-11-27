import mapJson from '../../assets/map.json';
import { Direction } from '../enums/direction';
import { Car } from '../objects/car';
import { Chicken } from '../objects/chicken';

export class GameScene extends Phaser.Scene {
  private isStarted: boolean = false;
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
    // Menu
    this.load.image('logo', '../../assets/logo.png');
    this.load.image('start', '../../assets/start.png');

    // Game
    this.load.tilemapTiledJSON('map', '../../assets/map.json');
    this.load.image('tiles', '../../assets/tiles.png');
    this.load.image('car', '../../assets/car.png');
    this.load.spritesheet(
      'chicken-down-walking',
      '../../assets/chicken-down-walking.png',
      {
        frameHeight: 16,
        frameWidth: 16,
      },
    );
    this.load.spritesheet(
      'chicken-up-walking',
      '../../assets/chicken-up-walking.png',
      {
        frameHeight: 16,
        frameWidth: 16,
      },
    );

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
      delay: 3000,
      loop: true,
    };

    const chickenSpawnConfig: TimerEventConfig = {
      callback: this.spawnChicken,
      delay: 5000,
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

    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`);

    this.anims.create({
      duration: 1400,
      frames: this.anims.generateFrameNumbers('chicken-down-walking', {}),
      key: 'chicken-down-walking',
      repeat: -1,
    });
    this.anims.create({
      duration: 1400,
      frames: this.anims.generateFrameNumbers('chicken-up-walking', {}),
      key: 'chicken-up-walking',
      repeat: -1,
    });

    const logo = this.add.image(500, 100, 'logo');
    logo.setScale(8, 8);

    const startButton = this.add.image(500, 300, 'start');
    startButton.setScale(4, 4);

    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.isStarted = true;
      this.time.addEvent(chickenSpawnConfig);
      logo.setVisible(false);
      startButton.setInteractive(false);
      startButton.setVisible(false);
    });

    this.time.addEvent(carSpawnConfig);
  }

  public update(): void {
    this.cars.forEach(car => car.move());
    this.chickens.forEach(chicken => chicken.move());
  }

  private handleChickenCollision(chicken: Chicken, car: Car): void {
    chicken.hit();
    chicken.body = null;
    chicken.destroy();
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
    car.setSize(32, 32);
    car.setDisplaySize(32, 32);
    this.carGroup.add(car);
    this.cars.push(car);
  };

  private spawnChicken = () => {
    const randomSpawnIndex = Math.floor(
      Math.random() * this.chickenSpawns.length,
    );
    const spawn = this.chickenSpawns[randomSpawnIndex];
    const { x, y, direction } = spawn;
    const chicken = new Chicken(this, x, y, '', direction);
    chicken.setSize(32, 32);
    chicken.setDisplaySize(32, 32);
    this.chickenGroup.add(chicken);
    this.chickens.push(chicken);
  };
}
