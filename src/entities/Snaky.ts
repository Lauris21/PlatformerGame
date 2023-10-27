import PlayScene from "../scenes/Play";
import { Enemy } from "./Enemy";
import initAnims from "../anims/snakyAnims";
import Projectiles from "../attacks/Projectiles";
import MeleeWeapon from "../attacks/MeleeWeapon";

export class Snaky extends Enemy {
  projectiles: Projectiles;
  timeFromLastAttack: number;
  attackDelay: number;
  lastDirection: number;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "snaky");
    initAnims(this.scene.anims);
  }

  init() {
    super.init();

    this.projectiles = new Projectiles(this.scene, "fireball-1");

    this.timeFromLastAttack = 0;
    this.attackDelay = this.getAttackDelay();

    this.setSize(12, 45).setOffset(10, 15);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    // Asignamos la dirección
    if (this.body.velocity.x > 0) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    } else {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    }

    if (this.timeFromLastAttack + this.attackDelay <= time) {
      this.projectiles.fireProjectile(this, "fireball"); // Lanzamos el proyectil pasado el delay
      this.timeFromLastAttack = time;
      this.attackDelay = this.getAttackDelay();
    }

    if (!this.active) {
      return; // comprobamos que el super no este destruido
    }

    if (this.isPlayingAnims("snaky-hurt")) {
      return; // Lanzamos animación de herido
    }

    this.play("snaky-walk", true);
  }

  getAttackDelay() {
    return Phaser.Math.Between(1000, 4000);
  }

  takesHit(source: Projectiles | MeleeWeapon) {
    super.takesHit(source);
    this.play("snaky-hurt", true);
  }
}
