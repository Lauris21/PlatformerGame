import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SharedConfig } from "../types";
import { Birdman } from "../entities/BirdMan";
import { Enemies } from "../groups/Enemies";
import initAnims from "../anims/hitSheet";
import { Snaky } from "../entities/Snaky";
import { Collectable } from "../collectables/Collectable";
import { Collectables } from "../groups/Collectables";
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
  collectablesLayer: Phaser.Tilemaps.ObjectLayer;
  collectables: Collectables;

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
    initAnims(this.anims);
    this.createLayers();
    this.getPlayerZones();
    this.createCollectables();
    this.createPlayer();
    this.createEnemies();
    this.createPlayerColliders();
    this.createEnemyColliders();
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

    this.environment = this.map
      .createStaticLayer("environment", tileset)
      .setDepth(-2);

    this.platforms = this.map.createStaticLayer("platforms", tileset);

    this.playerZones = this.map.getObjectLayer("player_zones");

    this.enemySpawns = this.map.getObjectLayer("enemy_spawns");

    this.collectablesLayer = this.map.getObjectLayer("collectables");

    // Le estamos diciendo que no colisione con los 0 del mosaico
    this.platformColliders.setCollisionByProperty({ collides: true });
  }

  createCollectables() {
    this.collectables = new Collectables(this).setDepth(-1);
    this.collectables.addFromLayer(this.collectablesLayer);

    this.collectables.playAnimation("diamond-shine");
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

  onWeaponHitPlayer() {
    this.player.takesProjectilesHit(this.enemies.getProjectiles());
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

  onCollect(collectable: Phaser.GameObjects.GameObject) {
    console.log("collecting!", collectable);
    if (collectable instanceof Phaser.Physics.Arcade.Sprite) {
      collectable.disableBody(true, true);
    }
  }

  createPlayerColliders() {
    this.player.addCollider(this.platformColliders, null);

    this.player.addCollider(this.enemies.getProjectiles(), () =>
      this.onWeaponHitPlayer()
    );

    this.physics.add.overlap(
      this.player,
      this.collectables,
      (player, collectable) => {
        this.onCollect(collectable);
      }
    );
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
