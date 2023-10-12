import PlayScene from "../scenes/Play";
import collidable from "../mixins/collidable";
import { Player } from "./Player";

export class BirdMan extends Phaser.Physics.Arcade.Sprite {
  addCollider: (
    otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player,
    callback: any
  ) => void;
  scene: PlayScene;

  gravity: number;
  speed: number;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "birdman");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Mixins
    Object.assign(this, collidable);
    // this.addCollider = collidable.addCollider.bind(this);

    this.init();
  }

  init() {
    this.gravity = 500;
    this.speed = 150;
    this.setGravityY(this.gravity)
      .setSize(20, 45)
      .setOffset(9, 20)
      .setCollideWorldBounds(true)
      .setOrigin(0.5, 1)
      .setImmovable(true);
  }
}
