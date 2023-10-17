import { Player } from "../entities/Player";

export function addCollider(
  otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player,
  callback: any
) {
  this.scene.physics.add.collider(this, otherGameobject, callback, null, this);
  return this;
}

let bodyPossitionDifferenceX: number = 0; // Saber cuantos píxeles se ha movido para lanzar el rayo
let prevRay: Phaser.Geom.Line;
let prevHasHit: boolean;

export function raycast(
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
  raylength: number = 30,
  layer: Phaser.Tilemaps.StaticTilemapLayer,
  precision: number = 0,
  prevX: number,
  facingBody: number
) {
  const { x, y, width, halfHeight} = body;
  

  bodyPossitionDifferenceX += x - prevX;

  // Lanzamos el rayo si el enemigo se ha movido 2px
  if ((Math.abs(bodyPossitionDifferenceX) <= precision) && prevHasHit !== undefined) {
    return {
      ray: prevRay,
      hasHit: prevHasHit,
    };
  }
  
  const ray = new Phaser.Geom.Line();
  let hasHit = false;

switch (facingBody) {
  case Phaser.Physics.Arcade.FACING_RIGHT:
    ray.x1 = x + width;
  ray.y1 = y + halfHeight;
  ray.x2 = ray.x1 + raylength;
  ray.y2 = ray.y1 + raylength;
    break;

  case Phaser.Physics.Arcade.FACING_LEFT:
    ray.x1 = x;
    ray.y1 = y + halfHeight;
    ray.x2 = ray.x1 - raylength;
    ray.y2 = ray.y1 + raylength;
    break;
}

  const hits = layer.getTilesWithinShape(ray);

  if (hits?.length > 0) {
    hasHit = prevHasHit =  hits.some(
      (hit: Phaser.Tilemaps.Tile) => hit.index !== -1
    );
  }
  
  prevRay = ray;
  bodyPossitionDifferenceX = 0
  
  return {
    ray,
    hasHit,
  };
}
