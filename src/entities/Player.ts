import PlayScene from "../scenes/Play"

export class Player extends Phaser.Physics.Arcade.Sprite {

    gravity: number
    playerSpeed : number = 200
    cursors : Phaser.Types.Input.Keyboard.CursorKeys 

    constructor(scene: PlayScene, x: number, y: number) {
        super(scene, x, y, "player")

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.init()
    }

    init() {
        this.gravity = 500
        this.playerSpeed = 200
        this.cursors = this.scene.input.keyboard.createCursorKeys()

        this.setGravityY(this.gravity)
        this.setCollideWorldBounds(true)
    }

    preUpdate(time: number, delta: number):void {
        super.preUpdate(time, delta)
        const { left, right} = this.cursors

    if (left.isDown) {
        this.setVelocityX(-this.playerSpeed)

    } else if ( right.isDown) {
        this.setVelocityX(this.playerSpeed)
    } else {
        this.setVelocityX(0)
    }
    }
}