import PlayScene from "../scenes/Play";
import collidable from "../mixins/collidable";
import { Player } from "./Player";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  addCollider: (
    otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player,
    callback: any
  ) => void;
  
  scene: PlayScene;

  gravity: number;
  speed: number;
  health: number

  constructor(scene: PlayScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Mixins
    Object.assign(this, collidable);
    // this.addCollider = collidable.addCollider.bind(this);

    this.init();
    this.initEvents()
  }

  init() {
    this.gravity = 500;
    this.speed = 150;
    this.health = 100

    this.setGravityY(this.gravity)
      .setSize(20, 45)
      .setOffset(9, 20)
      .setCollideWorldBounds(true)
      .setOrigin(0.5, 1)
      .setImmovable(true);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta:number) {
    this.setVelocityX(30)
  }
}
