import Projectiles from "../attacks/Projectiles";
import { Player } from "../entities/Player";

export function addCollider(
  otherGameobject:
    | Phaser.Tilemaps.StaticTilemapLayer
    | Projectiles
    | Phaser.Physics.Arcade.Sprite,
  callback: any
) {
  this.scene.physics.add.collider(this, otherGameobject, callback, null, this);
  return this;
}

export function addOverlap(
  otherGameobject:
    | Phaser.Tilemaps.StaticTilemapLayer
    | Projectiles
    | Phaser.Physics.Arcade.Sprite,
  callback: any
) {
  this.scene.physics.add.overlap(this, otherGameobject, callback, null, this);
  return this;
}

let prevRay: Phaser.Geom.Line;
let prevHasHit: boolean;

export function raycast(
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
  raylength: number = 30, // longitud del rayo
  layer: Phaser.Tilemaps.StaticTilemapLayer,
  precision: number = 0,
  prevX: number,
  facingBody: number,
  steepnes: number = 1, // inlinacion rayo
  bodyPossitionDifferenceX: number // Cuantos pixeles se ha movido el enemigo
) {
  const { x, y, width, halfHeight } = body;

  bodyPossitionDifferenceX += x - prevX;

  // si se ha movido menos que la precisiom y prevHashit ya ha sido declarado no lanzamos el rayo
  if (
    Math.abs(bodyPossitionDifferenceX) <= precision &&
    prevHasHit !== undefined
  ) {
    return {
      ray: prevRay,
      hasHit: prevHasHit,
    };
  }

  const ray = new Phaser.Geom.Line(); // Es el rayo al que añadimos los parámetros
  let hasHit = false;

  switch (facingBody) {
    case Phaser.Physics.Arcade.FACING_RIGHT:
      ray.x1 = x + width;
      ray.y1 = y + halfHeight;
      ray.x2 = ray.x1 + raylength * steepnes;
      ray.y2 = ray.y1 + raylength;
      break;

    case Phaser.Physics.Arcade.FACING_LEFT:
      ray.x1 = x;
      ray.y1 = y + halfHeight;
      ray.x2 = ray.x1 - raylength * steepnes;
      ray.y2 = ray.y1 + raylength;
      break;
  }

  const hits = layer.getTilesWithinShape(ray);

  if (hits?.length > 0) {
    hasHit = prevHasHit = hits.some(
      // Devuelve true si encuentra alguno diferemte a -1
      (hit: Phaser.Tilemaps.Tile) => hit.index !== -1
    );
  }

  prevRay = ray;
  bodyPossitionDifferenceX = 0;

  return {
    ray,
    hasHit,
  };
}
