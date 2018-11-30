import mapJson from '../../assets/map.json';
import { Direction } from '../enums/direction';
import { Car } from '../objects/car';
import { Chicken } from '../objects/chicken';

export class GameScene extends Phaser.Scene {
  private isGameOver: boolean = false;
  private isStarted: boolean = false;
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text;
  private gameOverContainer: Phaser.GameObjects.Container;

  private chickenGroup: Phaser.Physics.Arcade.Group;
  private carGroup: Phaser.Physics.Arcade.Group;
  private safeGroup: Phaser.Physics.Arcade.Group;

  private cars: Car[] = [];
  private chickens: Chicken[] = [];
  private carSpawns = [
    {
      direction: Direction.Right,
      x: -16,
      y: 204,
    },
    {
      direction: Direction.Right,
      x: -16,
      y: 236,
    },
    {
      direction: Direction.Left,
      x: 1008,
      y: 332,
    },
    {
      direction: Direction.Left,
      x: 1008,
      y: 300,
    },
  ];

  private chickenSpawns = [
    {
      direction: Direction.Down,
      x: 401,
      y: -16,
    },
    {
      direction: Direction.Down,
      x: 465,
      y: -16,
    },
    {
      direction: Direction.Down,
      x: 529,
      y: -16,
    },
    {
      direction: Direction.Down,
      x: 593,
      y: -16,
    },
    {
      direction: Direction.Up,
      x: 433,
      y: 560,
    },
    {
      direction: Direction.Up,
      x: 497,
      y: 560,
    },
    {
      direction: Direction.Up,
      x: 561,
      y: 560,
    },
  ];

  private chickenSafePoints = [
    {
      x: 401,
      y: 528,
    },
    {
      x: 465,
      y: 528,
    },
    {
      x: 529,
      y: 528,
    },
    {
      x: 593,
      y: 528,
    },
    {
      x: 433,
      y: 16,
    },
    {
      x: 497,
      y: 16,
    },
    {
      x: 561,
      y: 16,
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
    this.load.image('tutorial', '../../assets/tutorial.png');
    this.load.image('start', '../../assets/start.png');
    this.load.image('game-over', '../../assets/game-over.png');
    this.load.image('restart', '../../assets/restart.png');

    // Game
    this.load.tilemapTiledJSON('map', '../../assets/map.json');
    this.load.image('tiles', '../../assets/tiles.png');

    // Cars
    this.load.image('bus-left', '../../assets/cars/bus-left.png');
    this.load.image('pickup-left', '../../assets/cars/pickup-left.png');
    this.load.image('police-left', '../../assets/cars/police-left.png');
    this.load.image('taxi-left', '../../assets/cars/taxi-left.png');
    this.load.image('sport-left', '../../assets/cars/sport-left.png');
    this.load.image('hatchback-left', '../../assets/cars/hatchback-left.png');
    this.load.image('bus-right', '../../assets/cars/bus-right.png');
    this.load.image('pickup-right', '../../assets/cars/pickup-right.png');
    this.load.image('police-right', '../../assets/cars/police-right.png');
    this.load.image('taxi-right', '../../assets/cars/taxi-right.png');
    this.load.image('sport-right', '../../assets/cars/sport-right.png');
    this.load.image('hatchback-right', '../../assets/cars/hatchback-right.png');

    // Chickens
    this.load.spritesheet(
      'chicken-down-moving',
      '../../assets/chicken-down-moving.png',
      {
        frameHeight: 16,
        frameWidth: 16,
      },
    );
    this.load.spritesheet(
      'chicken-down-idle',
      '../../assets/chicken-down-idle.png',
      {
        frameHeight: 16,
        frameWidth: 16,
      },
    );
    this.load.spritesheet(
      'chicken-up-moving',
      '../../assets/chicken-up-moving.png',
      {
        frameHeight: 16,
        frameWidth: 16,
      },
    );
    this.load.spritesheet(
      'chicken-up-idle',
      '../../assets/chicken-up-idle.png',
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
      this.add.sprite(x, y, 'spawn');
    });

    this.carSpawns.forEach(spawn => {
      const { x, y } = spawn;
      this.add.sprite(x, y, 'spawn');
    });

    this.physics.systems.start(Phaser.Physics.Arcade);

    this.chickenGroup = this.physics.add.group();
    this.carGroup = this.physics.add.group();
    this.safeGroup = this.physics.add.group();

    this.chickenSafePoints.forEach(safePoint => {
      const { x, y } = safePoint;
      const sprite = new Phaser.GameObjects.Sprite(this, x, y, 'spawn');
      this.safeGroup.add(sprite);
      sprite.setScale(2, 2);
    });

    this.physics.add.collider(
      this.chickenGroup,
      this.carGroup,
      this.handleChickenCollision,
      null,
      this,
    );

    this.physics.add.collider(
      this.chickenGroup,
      this.safeGroup,
      this.handleChickenSafe,
      null,
      this,
    );

    this.anims.create({
      duration: 2000,
      frames: this.anims.generateFrameNumbers('chicken-down-idle', {}),
      key: 'chicken-down-idle',
      repeat: -1,
    });
    this.anims.create({
      duration: 1400,
      frames: this.anims.generateFrameNumbers('chicken-down-moving', {}),
      key: 'chicken-down-walking',
      repeat: -1,
    });
    this.anims.create({
      duration: 800,
      frames: this.anims.generateFrameNumbers('chicken-down-moving', {}),
      key: 'chicken-down-running',
      repeat: -1,
    });
    this.anims.create({
      duration: 2000,
      frames: this.anims.generateFrameNumbers('chicken-up-idle', {}),
      key: 'chicken-up-idle',
      repeat: -1,
    });
    this.anims.create({
      duration: 1400,
      frames: this.anims.generateFrameNumbers('chicken-up-moving', {}),
      key: 'chicken-up-walking',
      repeat: -1,
    });
    this.anims.create({
      duration: 800,
      frames: this.anims.generateFrameNumbers('chicken-up-moving', {}),
      key: 'chicken-up-running',
      repeat: -1,
    });

    const menuContainer = this.add.container(0, 0);
    const width = this.cameras.main.width;
    const height = this.cameras.main.width;
    const background = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      width,
      height,
      0,
      0.6,
    );
    background.setScale(2);
    background.setDepth(0);
    menuContainer.add(background);

    const logo = new Phaser.GameObjects.Sprite(this, 500, 200, 'logo');
    const startButton = new Phaser.GameObjects.Sprite(this, 500, 380, 'start');
    logo.setScale(10, 10);
    startButton.setScale(4, 4);
    startButton.setInteractive();
    startButton.input.cursor = 'pointer';

    const tutorialButton = new Phaser.GameObjects.Sprite(
      this,
      500,
      450,
      'tutorial',
    );
    tutorialButton.setScale(4, 4);
    tutorialButton.setInteractive();
    tutorialButton.input.cursor = 'pointer';

    menuContainer.add(logo);
    menuContainer.add(startButton);
    menuContainer.add(tutorialButton);
    menuContainer.setDepth(3);

    startButton.on('pointerdown', () => {
      this.isStarted = true;
      this.time.addEvent(chickenSpawnConfig);
      startButton.setInteractive(false);
      this.tweens.add({
        alpha: 0,
        duration: 1000,
        targets: menuContainer,
      });

      const scoreContainer = this.add.container(0, 0);
      this.scoreText = new Phaser.GameObjects.Text(
        this,
        10,
        10,
        `${this.score}`,
        null,
      );
      this.scoreText.style.setFontSize(48);
      scoreContainer.add(this.scoreText);
      this.scoreText.setAlpha(0);
      this.tweens.add({
        alpha: 1,
        duration: 1000,
        targets: this.scoreText,
      });
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

    // Game over
    if (!this.isGameOver) {
      this.showGameOver();
    }
  }

  private handleChickenSafe(chicken: Chicken): void {
    if (!this.isGameOver) {
      this.score += 1;
      this.scoreText.setText(`${this.score}`);
    }
    chicken.body = null;
    chicken.destroy();
  }

  private handleRestartButtonClick = (): void => {
    this.resetGame();
    this.tweens.add({
      alpha: 0,
      duration: 1000,
      targets: this.gameOverContainer,
    });
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
    this.time.addEvent(chickenSpawnConfig);
    this.time.addEvent(carSpawnConfig);
  };

  private resetGame() {
    this.isGameOver = false;
    this.score = 0;
    this.scoreText.setText(`${this.score}`);
    this.scoreText.setVisible(true);
  }

  private showGameOver(): void {
    this.isGameOver = true;
    this.isStarted = false;
    this.scoreText.setVisible(false);
    const width = this.cameras.main.width;
    const height = this.cameras.main.width;
    const background = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      width,
      height,
      0,
      0.6,
    );
    background.setScale(2);
    this.gameOverContainer = this.add.container(0, 0);
    this.gameOverContainer.setDepth(4);
    this.gameOverContainer.add(background);

    const score = new Phaser.GameObjects.Text(
      this,
      width / 2,
      350,
      `Score: ${this.score}`,
      null,
    );
    score.setFontSize(48);
    score.setColor('#ffffff');
    score.setOrigin(0.5, 1);

    const gameOver = new Phaser.GameObjects.Sprite(this, 500, 200, 'game-over');
    gameOver.setScale(10, 10);
    const restartButton = new Phaser.GameObjects.Sprite(
      this,
      width / 2,
      400,
      'restart',
    );
    restartButton.setScale(4, 4);
    restartButton.setInteractive();
    restartButton.addListener('pointerdown', this.handleRestartButtonClick);
    restartButton.input.cursor = 'pointer';

    this.gameOverContainer.add(score);
    this.gameOverContainer.add(gameOver);
    this.gameOverContainer.add(restartButton);
    this.time.removeAllEvents();
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
    this.chickenGroup.add(chicken);
    this.chickens.push(chicken);
  };
}
