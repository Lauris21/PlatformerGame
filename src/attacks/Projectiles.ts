import { Player } from "../entities/Player";
import PlayScene from "../scenes/Play";
import { getTimestamp } from "../utils.js/functions";
import Projectile from "./Projectile";

class Projectiles extends Phaser.Physics.Arcade.Group {

    timeFromLastShoot : number;

  constructor(scene: PlayScene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: "iceball",
      classType: Projectile,
    });

    this.timeFromLastShoot = null
  };

  fireProjectile(initiator: Player) {
    const projectile = this.getFirstDead(false);

    if (!projectile) {
      return;
    }

    if(this.timeFromLastShoot && this.timeFromLastShoot + projectile.cooldown > getTimestamp()) {
return // no podemos disparar porque no ha pasado el tiempo suficiente
    }

    const center = initiator.getCenter();
    let centerX

    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed);
      projectile.setFlipX(false);
      centerX = center.x + 10
    } else {
      projectile.speed = -Math.abs(projectile.speed);
      projectile.setFlipX(true);
      centerX = center.x - 10
    }

    projectile.fire(centerX, center.y);
    this.timeFromLastShoot = getTimestamp()
  }
}

export default Projectiles;
