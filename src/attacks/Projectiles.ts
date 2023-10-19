import { Player } from "../entities/Player";
import PlayScene from "../scenes/Play";
import Projectile from "./Projectile";

class Projectiles extends Phaser.Physics.Arcade.Group {
    constructor(scene: PlayScene) {
        super(scene.physics.world, scene)

        this.createMultiple({
            frameQuantity: 5,
            active: false,
            visible: false,
            key: "iceball",
            classType: Projectile
        })
    }

    fireProjectile(initiator: Player) {
const projectile = this.getFirstDead(false)

if (!projectile) { return}

if(initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
projectile.speed = Math.abs(projectile.speed)
projectile.setFlipX(false)
} else {
    projectile.speed = - Math.abs(projectile.speed)
    projectile.setFlipX(true)
}

projectile.fire(initiator.x, initiator.y)
    }
}

export default Projectiles