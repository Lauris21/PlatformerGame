import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.tilemapTiledJSON("crystal_map", "assets/crystal_map.json");
    this.load.image("main_lev_build_1", "assets/main_lev_build_1.png");
    this.load.image("main_lev_build_2", "assets/main_lev_build_2.png");

    this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32,
    });
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default PreloadScene;
