import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SharedConfig } from "../types";
import { Birdman } from "../entities/BirdMan";
import { Enemies } from "../groups/Enemies";
class PlayScene extends Phaser.Scene {
  player: Player;
  birdmanEnemies: Birdman[];
  enemies: Enemies;
  config: SharedConfig;

  map: Phaser.Tilemaps.Tilemap;
  platformColliders: Phaser.Tilemaps.StaticTilemapLayer;
  environment: Phaser.Tilemaps.StaticTilemapLayer;
  platforms: Phaser.Tilemaps.StaticTilemapLayer;
  playerZones: Phaser.Tilemaps.ObjectLayer;
  enemySpawns: Phaser.Tilemaps.ObjectLayer;

  objectsPlayerZones: Phaser.Types.Tilemaps.TiledObject[];
  start: Phaser.Types.Tilemaps.TiledObject;
  end: Phaser.Types.Tilemaps.TiledObject;

  graphics: Phaser.GameObjects.Graphics;
  line: Phaser.Geom.Line;
  // pointer: Phaser.Input.Pointer;

  // plotting: boolean; // Saber si estamos pulsando el raton
  tileHits: Phaser.Tilemaps.Tile[] // Si el raycasting golpea contra las plataformas del mosaico
  // collidingTileColor: Phaser.Display.Color

  constructor(config: SharedConfig) {
    super("PlayScene");
    this.config = config;
  }

  create() {
    this.createMaps();
    this.createLayers();
    this.getPlayerZones();
    this.createPlayer();
    this.createEnemies();
    this.createPlayerColliders();
    this.createEnemyColliders();
    this.createEndOfLevel();
    this.setupFollowupCameraOn(this.player);

    // this.plotting = false;

    // this.graphics = this.add.graphics();
    // this.line = new Phaser.Geom.Line();
    // this.graphics.lineStyle(1, 0x00ff00);

   // this.input.on("pointerdown", this.startDrawing, this);
   // this.input.on("pointerup", () => this.finishDrawing(this.pointer, this.platforms), this);
  }

//   drawDebbug(layer: Phaser.Tilemaps.StaticTilemapLayer) { // Pintamos los mosaicos de la capa golpeada
// this.collidingTileColor = new Phaser.Display.Color(243, 134, 48, 200)

// layer.renderDebug(this.graphics, {
//   tileColor: null,
//   collidingTileColor: this.collidingTileColor,
// })
//   }

//   startDrawing(pointer: Phaser.Input.Pointer) {
//     if(this.tileHits?.length > 0) {
//       this.tileHits.forEach((tile) => {
//        tile.index !== -1 && tile.setCollision(false)
//       })
//     }
//     this.line.x1 = pointer.worldX;
//     this.line.y1 = pointer.worldY;
//     this.plotting = true;
//   }

  finishDrawing(pointer: Phaser.Input.Pointer, layer: Phaser.Tilemaps.StaticTilemapLayer) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;

    this.graphics.clear()
    this.graphics.strokeLineShape(this.line);
  
    this.tileHits = layer.getTilesWithinShape(this.line)
    
    if(this.tileHits.length > 0) {
      this.tileHits.forEach((tile) => {
       tile.index !== -1 && tile.setCollision(true)
      })
    }
    // this.drawDebbug(layer)
    // this.plotting = false;
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

    this.enemySpawns = this.map.getObjectLayer("enemy_spawns");

    // Le estamos diciendo que no colisione con los 0 del mosaico
    this.platformColliders.setCollisionByProperty({ collides: true });
  }

  createPlayer() {
    this.player = new Player(this, this.start.x, this.start.y);
  }

  createEnemies() {
    this.enemies = new Enemies(this);
    const enemyTypes = this.enemies.getTypes();

    this.enemySpawns.objects.forEach((item) => {
      const enemy = new enemyTypes[item.type](this, item.x, item.y);
      enemy.setPlatformColliders(this.platformColliders)
      this.enemies.add(enemy);
    });
  }

  createEnemyColliders() {
    this.enemies.addCollider(this.platformColliders, null);
    this.enemies.addCollider(this.player, null);
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
  // update(time: number, delta: number): void {
  //   if (this.plotting) {
  //     this.pointer = this.input.activePointer;
  //     this.line.x2 = this.pointer.worldX;
  //     this.line.y2 = this.pointer.worldY;

  //     this.graphics.clear() // Limpiamos los rayos para quedarnos con uno

  //     this.graphics.strokeLineShape(this.line);
  //   }
  // }
}

export default PlayScene;
