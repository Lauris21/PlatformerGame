import Projectiles from "../attacks/Projectiles";
import { Birdman } from "../entities/BirdMan";
import { Enemy } from "../entities/Enemy";
import { addCollider, raycast } from "../mixins/collidable";
import PlayScene from "../scenes/Play";
import { EnemyTypes } from "../types";
import { enemyTypeslist } from "../utils.js/enemyTypes";

export class Enemies extends Phaser.GameObjects.Group {
  types: EnemyTypes;

  addCollider: (
    otherGameobject:
      | Phaser.Tilemaps.StaticTilemapLayer
      | Projectiles
      | Phaser.Physics.Arcade.Sprite
      | Phaser.GameObjects.Group,
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

  getProjectiles() {
    // Encontramos los enemigos que contienen proyectiles para hacerles colisionar
    const projectiles = new Phaser.GameObjects.Group(this.scene);

    this.getChildren().forEach((enemy: Enemy) => {
      if ("projectiles" in enemy) {
        const enemyWithProjectiles = enemy as any; // Uso 'as any' para omitir las comprobaciones de TypeScript
        if (enemyWithProjectiles.projectiles instanceof Projectiles) {
          // Le añadimos a los proyectiles el grupo de proyectiles del enemigo en caso de que los tenga
          projectiles.addMultiple(
            enemyWithProjectiles.projectiles.getChildren()
          );
        }
      }
    });

    return projectiles;
  }

  getTypes() {
    this.types = enemyTypeslist;
    return this.types;
  }
}
