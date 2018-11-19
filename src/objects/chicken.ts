import { Direction } from '../enums/direction';

export class Chicken extends Phaser.GameObjects.Sprite {
  private direction: Direction;
  private isPointerDown: boolean = false;
  private speed: integer = 1;
  private runOffset: integer = 60;
  private isDead = false;

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

  public hit(): void {
    this.isDead = true;
    this.body = null;
  }

  public move() {
    if (this.isDead) {
      return;
    }

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
  };

  private handlePointerUp = (event): void => {
    const { downY, upY } = event;

    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.alpha = 1;

      if (this.direction === Direction.Up && downY - this.runOffset > upY) {
        this.speed = 2;
        return;
      } else if (
        this.direction === Direction.Down &&
        downY + this.runOffset < upY
      ) {
        this.speed = 2;
        return;
      } else {
        if (this.speed === 0) {
          this.speed = 1;
        } else {
          this.speed = 0;
        }
      }
    }
  };
}
