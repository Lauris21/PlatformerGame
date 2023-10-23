import EffectManager from "../effects/EffectManager";
import { Enemy } from "../entities/Enemy";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  maxDistance: number;
  traveledDistance: number;
  cooldown: number; // marca de tiempo
  damage: number;
  // spriteEffect: SpriteEffect;
  effectManager: EffectManager;

  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 300;
    this.traveledDistance = 0;
    this.cooldown = 500;
    this.damage = 10;

    this.effectManager = new EffectManager(this.scene);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    this.traveledDistance += this.body.deltaAbsX();
    // Desactivamos la bola cuando recorre 300 px
    if (this.traveledDistance >= this.maxDistance) {
      this.body.reset(0, 0);
      this.activateProjectile(false);
      this.traveledDistance = 0;
    }
  }

  fire(x: number, y: number) {
    this.activateProjectile(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
  }

  deliversHit(target: Enemy) {
    this.activateProjectile(false);
    this.traveledDistance = 0;
    this.body.reset(0, 0);
    // new SpriteEffect(this.scene, 0, 0, "hit-effect").playOn(target);
    this.effectManager.playEffectOn("hit-effect", target);
  }

  activateProjectile(isActive: boolean) {
    this.setActive(isActive).setVisible(isActive);
  }
}

export default Projectile;
