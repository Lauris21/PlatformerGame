import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
      }

    preload() {
this.load.tilemapTiledJSON("crystal_Map", "assets/crystal_Map.json")
this.load.image("main_lev_build_1", "assets/main_lev_build_1.png")
this.load.image("main_lev_build_2", "assets/main_lev_build_2.png")
    }

    create() {
this.scene.start("PlayScene")
    }
}

export default PreloadScene