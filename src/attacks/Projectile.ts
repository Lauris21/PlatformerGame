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

    this.body.setSize(this.width - 13, this.height - 20);

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

  fire(x: number, y: number, anim: string) {
    this.activateProjectile(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);

    anim && this.play(anim, true);
  }

  deliversHit(target: Enemy) {
    this.activateProjectile(false);
    this.traveledDistance = 0;
    const impactPosition = { x: this.x, y: this.y }; // Definimos donde va a impactar
    this.body.reset(0, 0);
    this.effectManager.playEffectOn("hit-effect", target, impactPosition);
  }

  activateProjectile(isActive: boolean) {
    this.setActive(isActive).setVisible(isActive);
  }
}

export default Projectile;
