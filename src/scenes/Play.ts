import Phaser from "phaser";
import { Player } from "../entities/Player";

class PlayScene extends Phaser.Scene {
    cursors : Phaser.Types.Input.Keyboard.CursorKeys 
    player: Player

    playerSpeed : number = 200

  constructor() {
    super("PlayScene");
  }

  create() {
    const map: Phaser.Tilemaps.Tilemap = this.createMaps();

    const layers = this.createLayers(map);

   this.player = this.createPlayer()

    this.physics.add.collider(this.player, layers.platformColliders)

    this.cursors = this.input.keyboard.createCursorKeys()
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
    this.player = this.physics.add.sprite(100, 170, "player")
    this.player.setGravityY(500)
    this.player.setCollideWorldBounds(true)
  
    return this.player
  }

  update() {
    const { left, right} = this.cursors

    if (left.isDown) {
        this.player.setVelocityX(-this.playerSpeed)

    } else if ( right.isDown) {
        this.player.setVelocityX(this.playerSpeed)
    } else {
        this.player.setVelocityX(0)
    }
  }
}

export default PlayScene;
