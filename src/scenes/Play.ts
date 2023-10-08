import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    const map: Phaser.Tilemaps.Tilemap = this.createMaps();
    const layers = this.createLayers(map);

    const player: Phaser.Physics.Arcade.Sprite = this.createPlayer()

    this.physics.add.collider(player, layers.platforms)
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
    const environment: Phaser.Tilemaps.StaticTilemapLayer =
      map.createStaticLayer("environment", tileset);
    const platforms: Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(
      "platforms",
      tileset
    );

    // Le estamos diciendo que no colisione con los 0 del mosaico
    platforms.setCollisionByExclusion([-1], true)

    return {
      environment,
      platforms,
    };
  }

  createPlayer() {
    const player : Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(100, 250, "player")
    player.setGravityY(500)
    player.setCollideWorldBounds(true)
  
    return player
  }
}

export default PlayScene;
