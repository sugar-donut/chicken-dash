import { Direction } from '../enums/direction';

export class Car extends Phaser.GameObjects.Sprite {
  private direction: Direction = Direction.Down;
  private speed: integer = 1.5;
  private textures = ['bus', 'pickup', 'taxi', 'police', 'sport'];

  constructor(scene, x, y, texture, direction, frame?) {
    super(scene, x, y, texture, frame);
    this.setDirection(direction);
    scene.add.existing(this);
    this.setRandomTexture();
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
    this.setFlipX(this.direction === Direction.Left);
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
    this.setTexture(randomTexture);
  }
}
