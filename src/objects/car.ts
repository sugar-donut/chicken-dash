import { Direction } from '../enums/direction';

export class Car extends Phaser.Physics.Arcade.Sprite {
  private direction: Direction = Direction.Down;
  private speed: integer = 1.5;
  private textures = ['bus', 'pickup', 'police', 'taxi', 'sport', 'hatchback'];

  constructor(scene, x, y, texture, direction, frame?) {
    super(scene, x, y, texture, frame);
    this.setDirection(direction);
    this.setRandomTexture();

    scene.physics.world.enableBody(this, 0);
    this.setSize(16, 10);
    this.setScale(2, 2);
    this.setDepth(1);
    const offsetX = direction === Direction.Left ? -1 : 1;
    this.body.setOffset(offsetX, 5);

    scene.add.existing(this);
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public move() {
    switch (this.direction) {
      case Direction.Up:
        this.setPosition(this.x, this.y - this.speed);
        break;
      case Direction.Right:
        this.setPosition(this.x + this.speed, this.y);
        break;
      case Direction.Down:
        this.setPosition(this.x, this.y + this.speed);
        break;
      case Direction.Left:
        this.setPosition(this.x - this.speed, this.y);
        break;
    }
  }

  private setRandomTexture(): void {
    const randomTexture = this.textures[
      Math.floor(Math.random() * this.textures.length)
    ];
    const direction = this.direction === Direction.Left ? 'left' : 'right';
    this.setTexture(`${randomTexture}-${direction}`);
  }
}
