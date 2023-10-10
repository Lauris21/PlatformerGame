import PlayScene from "../scenes/Play"

export class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: PlayScene, x: number, y: number) {
        super(scene, x, y, "player")
    }
}