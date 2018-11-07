import { Direction } from '../enums/direction';

export class Chicken extends Phaser.GameObjects.Sprite {
  private direction: Direction;
  private isPointerDown: boolean = false;

  constructor(scene, x, y, texture, frame?) {
    super(scene, x, y, texture, frame);
    this.setInteractive();
    this.on('pointerdown', this.handlePointerDown);
    this.scene.input.on('pointerup', this.handlePointerUp);
    scene.add.existing(this);
  }

  public setDirection(direction: Direction) {
    const radians = (direction * Math.PI) / 180;
    this.direction = direction;
    this.setRotation(radians);
  }

  public getDirection(): Direction {
    return this.direction;
  }

  private handlePointerDown = (): void => {
    this.isPointerDown = true;
    this.alpha = 0.5;
  };

  private handlePointerUp = (event): void => {
    if (this.isPointerDown) {
      this.setDirection(Direction.Right);
      this.isPointerDown = false;
      this.alpha = 1;
    }
  };
}
