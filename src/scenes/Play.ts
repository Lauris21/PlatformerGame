import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    const map: Phaser.Tilemaps.Tilemap = this.createMaps();
    const layers = this.createLayers(map);

    this.createPlayer()
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
    const platforms: Phaser.Tilemaps.DynamicTilemapLayer = map.createDynamicLayer(
      "platforms",
      tileset
    );

    return {
      environment,
      platforms,
    };
  }

  createPlayer() {
    const player : Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(100, 250, "player")
    player.setGravityY(500)
    player.setCollideWorldBounds(true)
   // player.body.setGravityY(500)
  }
}

export default PlayScene;
