import PlayScene from "../scenes/Play";
import collidable from "../mixins/collidable"

export class BirdMan extends Phaser.Physics.Arcade.Sprite {
    addCollider: (otherGameobject: Phaser.Tilemaps.StaticTilemapLayer, callback: any) => void;
  scene: PlayScene;

  gravity: number;
  speed: number;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "birdman");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Mixins
    Object.assign(this, collidable)
    // this.addCollider = collidable.addCollider.bind(this);

    this.init();

  }

  init() {
    this.gravity = 500;
    this.speed = 150;
    this.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1)
    console.log(this.addCollider);
    
  }
}
