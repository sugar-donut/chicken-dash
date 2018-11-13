import { Direction } from '../enums/direction';

export class Chicken extends Phaser.GameObjects.Sprite {
  private direction: Direction;
  private isPointerDown: boolean = false;
  private speed: integer = 1;

  constructor(scene, x, y, texture, direction, frame?) {
    super(scene, x, y, texture, frame);
    this.setInteractive();
    this.on('pointerdown', this.handlePointerDown);
    this.scene.input.on('pointerup', this.handlePointerUp);
    this.setDirection(direction);
    scene.add.existing(this);
  }

  public setDirection(direction: Direction) {
    const radians = (direction * 90 * Math.PI) / 180;
    this.direction = direction;
    this.setRotation(radians);
  }

  public getDirection(): Direction {
    return this.direction;
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

  private handlePointerDown = (): void => {
    this.isPointerDown = true;
    this.alpha = 0.5;
    this.speed = 3;
  };

  private handlePointerUp = (event): void => {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.alpha = 1;
    }
  };
}
