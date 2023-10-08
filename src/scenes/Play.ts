import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    const map: Phaser.Tilemaps.Tilemap = this.createMaps();
    const layers = this.createLayers(map);
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
}

export default PlayScene;
