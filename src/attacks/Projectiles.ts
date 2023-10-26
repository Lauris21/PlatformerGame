import { Player } from "../entities/Player";
import { Snaky } from "../entities/Snaky";
import PlayScene from "../scenes/Play";
import { getTimestamp } from "../utils.js/functions";
import Projectile from "./Projectile";

class Projectiles extends Phaser.Physics.Arcade.Group {
  timeFromLastShoot: number;
  damage: number;
  projectile: Projectile;

  constructor(scene: PlayScene, key: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key,
      classType: Projectile,
    });

    this.damage = 10;
    this.timeFromLastShoot = null;
  }

  fireProjectile(initiator: Player | Snaky) {
    this.projectile = this.getFirstDead(false);

    if (!this.projectile) {
      return;
    }

    if (
      this.timeFromLastShoot &&
      this.timeFromLastShoot + this.projectile.cooldown > getTimestamp()
    ) {
      return; // no podemos disparar porque no ha pasado el tiempo suficiente
    }

    const center = initiator.getCenter();
    let centerX;

    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      this.projectile.speed = Math.abs(this.projectile.speed);
      this.projectile.setFlipX(false);
      centerX = center.x + 10;
    } else {
      this.projectile.speed = -Math.abs(this.projectile.speed);
      this.projectile.setFlipX(true);
      centerX = center.x - 10;
    }

    this.projectile.fire(centerX, center.y);
    this.timeFromLastShoot = getTimestamp();
  }
}

export default Projectiles;
