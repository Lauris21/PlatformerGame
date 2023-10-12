import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SharedConfig } from "../types";
import { BirdMan } from "../entities/BirdMan";
class PlayScene extends Phaser.Scene {
  player: Player;
  birdman: BirdMan 
  config: SharedConfig;

  map: Phaser.Tilemaps.Tilemap;

  platformColliders: Phaser.Tilemaps.StaticTilemapLayer;
  environment: Phaser.Tilemaps.StaticTilemapLayer;
  platforms: Phaser.Tilemaps.StaticTilemapLayer;
  playerZones: Phaser.Tilemaps.ObjectLayer;

  objectsPlayerZones: Phaser.Types.Tilemaps.TiledObject[];
  start: Phaser.Types.Tilemaps.TiledObject;
  end: Phaser.Types.Tilemaps.TiledObject;

  constructor(config: SharedConfig) {
    super("PlayScene");
    this.config = config;
  }

  create() {
    this.createMaps();
    this.createLayers();
    this.getPlayerZones();
    this.createPlayer();
    this.createEnemy()
    this.createPlayerColliders();
    this.createEnemyColliders()
    this.createEndOfLevel();
    this.setupFollowupCameraOn(this.player);
  }

  createMaps() {
    this.map = this.make.tilemap({
      key: "crystal_map",
    });
    this.map.addTilesetImage("main_lev_build_1", "main_lev_build_1");
  }

  createLayers() {
    const tileset: Phaser.Tilemaps.Tileset =
      this.map.getTileset("main_lev_build_1");

    this.platformColliders = this.map.createStaticLayer(
      "platforms_colliders",
      tileset
    );

    this.environment = this.map.createStaticLayer("environment", tileset);

    this.platforms = this.map.createStaticLayer("platforms", tileset);

    this.playerZones = this.map.getObjectLayer("player_zones");

    // Le estamos diciendo que no colisione con los 0 del mosaico
    this.platformColliders.setCollisionByProperty({ collides: true });
  }

  createPlayer() {
    this.player = new Player(this, this.start.x, this.start.y);
  }

  createEnemy() {
    this.birdman = new BirdMan(this, 200, 200);
  }

  createEnemyColliders() {
    this.birdman.addCollider(this.platformColliders, null);
    this.birdman.addCollider(this.player, null)
  }

  createPlayerColliders() {
    this.player.addCollider(this.platformColliders, null);
  }

  createEndOfLevel() {
    const endOfLevel = this.physics.add
      .sprite(this.end.x, this.end.y, "end")
      .setAlpha(0)
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const endOfLevelOverlap = this.physics.add.overlap(
      this.player,
      endOfLevel,
      () => {
        endOfLevelOverlap.active = false;
        console.log("entro");
      }
    );
  }

  setupFollowupCameraOn(player: Player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones() {
    this.objectsPlayerZones = this.playerZones.objects;
    this.start = this.objectsPlayerZones.find(
      (elem) => elem.name === "startZone"
    );
    this.end = this.objectsPlayerZones.find((elem) => elem.name === "endZone");
  }
}

export default PlayScene;
