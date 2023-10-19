import PlayScene from "../scenes/Play"

class Projectile extends Phaser.Physics.Arcade.Sprite{
    speed : number;
    maxDistance: number;
    traveledDistance: number;

    constructor(scene : PlayScene, x: number, y : number, key : string) {
        super(scene, x, y, key);

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.speed = 300
        this.maxDistance = 200
        this.traveledDistance = 0
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)

        this.traveledDistance += this.body.deltaAbsX()
        // Eliminamos la bola cuando recorre 200 px
        if(this.traveledDistance >= this.maxDistance) {
            this.destroy()
        }
    }

    fire() {
        console.log("Firing the projectile");
        
        this.setVelocityX(this.speed)
    }

}

export default Projectile