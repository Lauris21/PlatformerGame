import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
      }

    preload() {
this.load.tilemapTiledJSON("crystal_map", "assets/crystal_map.json")
this.load.image("main_lev_build_1", "assets/main_lev_build_1.png")
this.load.image("main_lev_build_2", "assets/main_lev_build_2.png")

this.load.image("player", "assets/player/movements/idle01.png")
    }

    create() {
this.scene.start("PlayScene")
    }
}

export default PreloadScene