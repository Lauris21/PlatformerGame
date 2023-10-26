import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SharedConfig } from "../types";
import { Birdman } from "../entities/BirdMan";
import { Enemies } from "../groups/Enemies";
import initAnims from "../anims/hitSheet";
import { Snaky } from "../entities/Snaky";
class PlayScene extends Phaser.Scene {
  player: Player;
  birdmanEnemies: Birdman[] = [];
  snakyEnemies: Snaky[] = [];
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

  tileHits: Phaser.Tilemaps.Tile[]; // Si el raycasting golpea contra las plataformas del mosaico

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

    initAnims(this.anims);
  }

  finishDrawing(
    pointer: Phaser.Input.Pointer,
    layer: Phaser.Tilemaps.StaticTilemapLayer
  ) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;

    this.graphics.clear();
    this.graphics.strokeLineShape(this.line);

    this.tileHits = layer.getTilesWithinShape(this.line);

    if (this.tileHits.length > 0) {
      this.tileHits.forEach((tile) => {
        tile.index !== -1 && tile.setCollision(true);
      });
    }
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

    this.enemySpawns.objects.forEach((item, index) => {
      const enemy = new enemyTypes[item.type](this, item.x, item.y);

      enemy.setPlatformColliders(this.platformColliders);
      this.enemies.add(enemy);
      if (item.type == "Birdman") {
        this.birdmanEnemies.push(enemy);
      }
      if (item.type == "Snaky") {
        this.snakyEnemies.push(enemy as Snaky);
      }
    });
  }

  onPlayerCollision(player: Player, enemy: Birdman | Snaky) {
    player.takesHit(enemy);
  }

  onWeaponHit(entity: Phaser.GameObjects.GameObject) {
    let enemy;
    if (entity.constructor.name == "Birdman") {
      enemy = this.birdmanEnemies.find((e) => e.body === entity.body);
    }
    if (entity.constructor.name == "Snaky") {
      enemy = this.snakyEnemies.find((e) => e.body === entity.body);
    }

    if (enemy) {
      enemy.takesHit(this.player.projectiles);
    }
  }

  onMeleeWeaponHit(entity: Phaser.GameObjects.GameObject) {
    let enemy;
    if (entity.constructor.name == "Birdman") {
      enemy = this.birdmanEnemies.find((e) => e.body === entity.body);
    }
    if (entity.constructor.name == "Snaky") {
      enemy = this.snakyEnemies.find((e) => e.body === entity.body);
    }
    if (enemy) {
      enemy.takesHit(this.player.meleeWeapon);
    }
  }

  createEnemyColliders() {
    this.enemies.addCollider(this.platformColliders, null);

    this.birdmanEnemies.forEach((enemy) => {
      enemy.addCollider(this.player, () =>
        this.onPlayerCollision(this.player, enemy)
      );
      enemy.addCollider(this.player.projectiles, () => this.onWeaponHit(enemy));
      enemy.addOverlap(this.player.meleeWeapon, () =>
        this.onMeleeWeaponHit(enemy)
      );
    });

    this.snakyEnemies.forEach((enemy) => {
      enemy.addCollider(this.player, () =>
        this.onPlayerCollision(this.player, enemy)
      );
      enemy.addCollider(this.player.projectiles, () => this.onWeaponHit(enemy));
      enemy.addOverlap(this.player.meleeWeapon, () =>
        this.onMeleeWeaponHit(enemy)
      );
    });
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
  update(time: number, delta: number): void {}
}

export default PlayScene;
