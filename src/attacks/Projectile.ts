import PlayScene from "../scenes/Play"

class Projectile extends Phaser.Physics.Arcade.Sprite{
    speed : number;
    constructor(scene : PlayScene, x: number, y : number, key : string) {
        super(scene, x, y, key);

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.speed = 300
    }

    fire() {
        console.log("Firing the projectile");
        
        this.setVelocityX(this.speed)
    }

}

export default Projectile