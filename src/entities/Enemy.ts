import PlayScene from "../scenes/Play";
import { addCollider, raycast } from "../mixins/collidable";
import isPlayingAnims from "../mixins/anims";
import { Player } from "./Player";
import { SharedConfig } from "../types";
import Projectiles from "../attacks/Projectiles";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  addCollider: (
    otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player | Projectiles,
    callback: () => void
  ) => void;

  raycast: (
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    raylength: number,
    layer: Phaser.Tilemaps.StaticTilemapLayer,
    precision: number,
    prevX: number,
    facingBody: number,
    steepnes: number,
    bodyPossitionDifferenceX: number
  ) => { ray: Phaser.Geom.Line; hasHit: boolean };

  isPlayingAnims: (animsKey: string) => boolean;

  scene: PlayScene;
  config: SharedConfig;
  gravity: number;
  speed: number;
  rayGraphics: Phaser.GameObjects.Graphics;
  ray: Phaser.Geom.Line;
  platformCollidersLayer: Phaser.Tilemaps.StaticTilemapLayer;
  hits: Phaser.Tilemaps.Tile[];
  hasHit: boolean; // Saber si raycasting esta golpeando la plataforma
  prevX: number;
  facingBody: number;
  timeFromLastTurn: number;
  maxPatrolDistance: number;
  currentPatrolDistance: number;
  bodyPossitionDifferenceX: number;
  damage: number;
  health: number;

  constructor(scene: PlayScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    this.config = this.scene.config;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Mixins
    Object.assign(this, { addCollider, raycast });
    Object.assign(this, isPlayingAnims);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.speed = 75;
    this.timeFromLastTurn = 0;
    this.maxPatrolDistance = 300;
    this.currentPatrolDistance = 0;
    this.platformCollidersLayer = null;
    this.damage = 20;
    this.health = 20;

    this.bodyPossitionDifferenceX = 0;

    this.rayGraphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xaa00aa },
    });

    this.setGravityY(this.gravity)
      .setSize(20, 45)
      .setOffset(9, 20)
      .setCollideWorldBounds(true)
      .setImmovable(true)
      .setOrigin(0.5, 1)
      .setVelocityX(this.speed);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta: number) {
    this.patroll(time);
  }

  patroll(time: number) {
    if (!this.body || !(this.body as Phaser.Physics.Arcade.Body).onFloor()) {
      return; // verificamos que esta en el suelo
    }
    this.currentPatrolDistance += Math.abs(this.prevX - this.prevX); // Aumentamos distancia de patrulla

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.prevX = this.body.prev.x; // Saber la posición de antes
      this.facingBody = this.body.facing; // Saber la dirección del movimiento
    }

    const { ray, hasHit } = this.raycast(
      this.body,
      30,
      this.platformCollidersLayer,
      1,
      this.prevX,
      this.facingBody,
      0.2,
      this.bodyPossitionDifferenceX
    );

    this.ray = ray;
    this.hasHit = hasHit;

    if (
      (!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
      this.timeFromLastTurn + 100 < time
    ) {
      // Hacemos que se voltee si hay plataforma o ha alcanzado la distancia máxima de patrulla y minimo cada 100 milisegundos
      this.setFlipX(!this.flipX);
      this.setVelocityX((this.speed = -this.speed));
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0;
    }

    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(this.ray);
    }
  }

  setPlatformColliders(layer: Phaser.Tilemaps.StaticTilemapLayer) {
    this.platformCollidersLayer = layer;
  }

  takesHit(source: Projectiles) {
    source.projectile.deliversHit(this);
    this.health -= source.damage;
    source.setActive(false);
    source.setVisible(false);

    if (this.health <= 0) {
      this.setTint(0xff0000);
      this.setVelocity(0, -200);
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);
    }
  }
}
