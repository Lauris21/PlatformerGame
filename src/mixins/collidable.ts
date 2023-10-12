export default {
    addCollider : function (otherGameobject : Phaser.Tilemaps.StaticTilemapLayer, callback: any){
      this.scene.physics.add.collider(this, otherGameobject, callback, null, this);
    }
  }