import Phaser from "phaser";

class PlayScene extends Phaser.Scene {

    constructor() {
        super("PlayScene");
      }

    create() {
const map = this.make.tilemap({key: "crystal_Map"})
const tileSet1 = map.addTilesetImage("main_lev_build_1", "main_lev_build_1")
const tileSet2 = map.addTilesetImage("crystal_word_map", "main_lev_build_2")

map.createStaticLayer("environment", tileSet1)
map.createStaticLayer("platforms", tileSet1)
    }
}

export default PlayScene