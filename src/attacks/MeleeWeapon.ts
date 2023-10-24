import EffectManager from "../effects/EffectManager";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";

class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
  damage: number;
  attackSpeed: number;
  weaponAnim: string;
  wielder: Player;
  effectManager: EffectManager;

  constructor(scene: Phaser.Scene, x: number, y: number, weaponName: string) {
    super(scene, x, y, weaponName);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.damage = 15;
    this.attackSpeed = 1000;
    this.weaponAnim = weaponName + "-swing";
    this.wielder = null;

    this.effectManager = new EffectManager(this.scene);

    this.setOrigin(0.5, 1);
    this.setDepth(10); // Profundidad

    this.activateWeapon(false); // La desactivamos

    this.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === this.weaponAnim) {
          this.activateWeapon(false);
          this.body.reset(0, 0);
        }
      },
      this
    );
  }

  preUpdate(time: number, delta: number): void {
    // Actualizamos para saber si lanzamos la animación a un lado u otro
    super.preUpdate(time, delta);

    if (!this.active) {
      return;
    }

    // Hay que saber posición jugador
    if (this.wielder.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      this.setFlipX(false);
      this.body.reset(this.wielder.x + 15, this.wielder.y);
    } else {
      this.setFlipX(true);
      this.body.reset(this.wielder.x - 15, this.wielder.y);
    }
  }

  swing(wielder: Phaser.Physics.Arcade.Sprite) {
    this.wielder = wielder as Player; // Establecemos al constructor
    this.activateWeapon(true);
    this.anims.play(this.weaponAnim, true); // Activamos las animaciones
  }

  deliversHit(target: Enemy) {
    const impactPosition = { x: this.x, y: this.y }; // Definimos donde va a impactar
    this.effectManager.playEffectOn("hit-effect", target, impactPosition);
  }

  activateWeapon(isActive: boolean) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }
}

export default MeleeWeapon;
