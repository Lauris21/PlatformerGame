import PlayScene from "../scenes/Play";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  maxDistance: number;
  traveledDistance: number;
  cooldown: number // marca de tiempo
  damage : number;

  constructor(scene: PlayScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 300;
    this.traveledDistance = 0;
    this.cooldown = 500;
    this.damage = 10;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    this.traveledDistance += this.body.deltaAbsX();
    // Desactivamos la bola cuando recorre 300 px
    if (this.traveledDistance >= this.maxDistance) {
      this.body.reset(0, 0);
      this.setActive(false).setVisible(false);
      this.traveledDistance = 0;
    }
  }

  fire(x: number, y: number) {
    this.setActive(true).setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
  }
}

export default Projectile;
