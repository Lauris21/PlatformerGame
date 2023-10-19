import { Player } from "../entities/Player";
import PlayScene from "../scenes/Play";
import Projectile from "./Projectile";

class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene: PlayScene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: "iceball",
      classType: Projectile,
    });
  }

  fireProjectile(initiator: Player) {
    const projectile = this.getFirstDead(false);

    if (!projectile) {
      return;
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
  }
}

export default Projectiles;
