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

projectile.fire(initiator.x, initiator.y)
    }
}

export default Projectiles