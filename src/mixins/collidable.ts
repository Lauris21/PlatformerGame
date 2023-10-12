import { Player } from "../entities/Player";

export default {
    addCollider : function (otherGameobject : Phaser.Tilemaps.StaticTilemapLayer | Player, callback: any){
      this.scene.physics.add.collider(this, otherGameobject, callback, null, this);
      return this
    }
  }