import Phaser from "phaser";
import { Player } from "../entities/Player";
import { CollidersType } from "../types";
class PlayScene extends Phaser.Scene {
   
    player: Player

    

  constructor() {
    super("PlayScene");
  }

  create() {
    const map: Phaser.Tilemaps.Tilemap = this.createMaps();

    const layers = this.createLayers(map);

   this.createPlayer()

  //  this.player.addCollider(layers.platformColliders, null)

   this.createPlayerColliders(this.player, {platformColliders : layers.platformColliders})
  }

  createMaps() {
    const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({
      key: "crystal_map",
    });
    map.addTilesetImage("main_lev_build_1", "main_lev_build_1");
    return map;
  }

  createLayers(map: Phaser.Tilemaps.Tilemap) {
    const tileset: Phaser.Tilemaps.Tileset = map.getTileset("main_lev_build_1");

    const platformColliders: Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(
        "platforms_colliders",
        tileset
      ); 

    const environment: Phaser.Tilemaps.StaticTilemapLayer =
      map.createStaticLayer("environment", tileset);

    const platforms: Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(
      "platforms",
      tileset
    ); 

    // Le estamos diciendo que no colisione con los 0 del mosaico
    platformColliders.setCollisionByProperty({collides: true})

    return {
      environment,
      platforms,
      platformColliders,
    };
  }

  createPlayer() {
    this.player = new Player(this, 100, 250)
  }

  createPlayerColliders(player : Player,  colliders : CollidersType) {

   player.addCollider(colliders.platformColliders, null)
  }
}

export default PlayScene;
