import PlayScene from "../scenes/Play";
import { addCollider, raycast } from "../mixins/collidable";
import { Player } from "./Player";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  addCollider: (
    otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player,
    callback: any
  ) => void;

  raycast: (
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    raylength: number,
    layer: Phaser.Tilemaps.StaticTilemapLayer,
    precision: number
  ) => { ray: Phaser.Geom.Line; hasHit: boolean };

  scene: PlayScene;

  gravity: number;
  speed: number;
  health: number;
  rayGraphics: Phaser.GameObjects.Graphics;

  ray: Phaser.Geom.Line;
  platformCollidersLayer: Phaser.Tilemaps.StaticTilemapLayer;
  hits: Phaser.Tilemaps.Tile[];
  hasHit: boolean; // Saber si raycasting esta golpeando la plataforma

  constructor(scene: PlayScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Mixins
    Object.assign(this, { addCollider, raycast });
    // this.addCollider = collidable.addCollider.bind(this);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.speed = 150;
    this.health = 100;
    this.rayGraphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xaa00aa },
    });

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

  update(time: number, delta: number) {
    this.setVelocityX(30);
    const { ray, hasHit } = this.raycast(
      this.body,
      30,
      this.platformCollidersLayer,
      2
    );

    this.ray = ray;
    this.hasHit = hasHit;
    this.rayGraphics.clear();
    this.rayGraphics.strokeLineShape(this.ray);
  }

  setPlatformColliders(layer: Phaser.Tilemaps.StaticTilemapLayer) {
    this.platformCollidersLayer = layer;
  }
}
