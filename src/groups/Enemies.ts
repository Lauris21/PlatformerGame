import Projectiles from "../attacks/Projectiles";
import { Player } from "../entities/Player";
import { addCollider, raycast } from "../mixins/collidable";
import PlayScene from "../scenes/Play";
import { EnemyTypes } from "../types";
import { enemyTypeslist } from "../utils.js/enemyTypes";

export class Enemies extends Phaser.GameObjects.Group {
  types: EnemyTypes;
  addCollider: (
    otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player | Projectiles,
    callback: () => void
  ) => void;
  raycast: (
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    raylength: number,
    layer: Phaser.Tilemaps.StaticTilemapLayer,
    precision: number
  ) => { ray: Phaser.Geom.Line; hasHit: boolean };
  scene: PlayScene;

  constructor(scene: any) {
    super(scene);

    Object.assign(this, { addCollider, raycast });
  }

  getTypes() {
    this.types = enemyTypeslist;
    return this.types;
  }
}
