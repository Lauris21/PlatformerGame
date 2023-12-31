import PlayScene from "../scenes/Play";
import initAnimation from "../anims/playerAnims";
import { addCollider, addOverlap } from "../mixins/collidable";
import { Birdman } from "./BirdMan";
import HealthBar from "../components/HealthBar";
import Projectiles from "../attacks/Projectiles";
import anims from "../mixins/anims";
import MeleeWeapon from "../attacks/MeleeWeapon";
import { getTimestamp } from "../utils.js/functions";
import { Snaky } from "./Snaky";
import Projectile from "../attacks/Projectile";
import EventEmitter from "../events/Emitter";
export class Player extends Phaser.Physics.Arcade.Sprite {
  addCollider: (
    otherGameobject:
      | Phaser.Tilemaps.StaticTilemapLayer
      | Projectiles
      | Phaser.Physics.Arcade.Sprite
      | Phaser.GameObjects.Group,
    callback: any
  ) => void;

  addOverlap: (
    otherGameobject:
      | Phaser.Tilemaps.StaticTilemapLayer
      | Projectiles
      | Phaser.Physics.Arcade.Sprite
      | Phaser.Physics.Arcade.StaticGroup,
    callback: () => void,
    context: typeof otherGameobject
  ) => void;

  isPlayingAnims: (animsKey: string) => boolean;

  scene: PlayScene;

  gravity: number;
  onFloor: boolean;
  playerSpeed: number;
  jumpCount: number;
  consecutiveJump: number;

  hasBeenHit: boolean;
  bounceVelovity: number; // velocidad de rebote
  hitAnims: Phaser.Tweens.Tween; // Animación en golpeo

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  hp: HealthBar;
  healt: number;

  projectiles: Projectiles;
  lastDirection: number;

  meleeWeapon: MeleeWeapon;
  timeFromLastSwing: number;
  isSliding: boolean;

  jumpSound: Phaser.Sound.BaseSound;
  proyectileSound: Phaser.Sound.BaseSound;
  stepSound: Phaser.Sound.BaseSound;
  swipeSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Mixins
    Object.assign(this, { addCollider, addOverlap });
    Object.assign(this, anims);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.playerSpeed = 150;
    this.jumpCount = 0;
    this.consecutiveJump = 1;
    this.hasBeenHit = false;
    this.bounceVelovity = 250; // velocidad de rebote
    this.isSliding = false; // Deslizamiento al agacharse

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.jumpSound = this.scene.sound.add("jump-music", { volume: 0.2 });
    this.proyectileSound = this.scene.sound.add("projectile-launch-music", {
      volume: 0.2,
    });
    this.stepSound = this.scene.sound.add("step-music", { volume: 0.2 });
    this.swipeSound = this.scene.sound.add("swipe-music", { volume: 0.2 });

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT; // Direccion determinada del player
    this.projectiles = new Projectiles(this.scene, "iceball-1");
    this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-default");

    this.healt = 100;
    this.hp = new HealthBar(
      this.scene,
      this.scene.config.leftTopCorner.x + 7,
      this.scene.config.leftTopCorner.y + 7,
      this.healt,
      2
    );

    this.setGravityY(this.gravity)
      .setSize(23, 36)
      .setCollideWorldBounds(true)
      .setOrigin(0.5, 1);

    initAnimation(this.scene.anims);

    this.handleAttacks();
    this.handleMovements();

    this.scene.time.addEvent({
      delay: 350,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.isPlayingAnims("run")) {
          this.stepSound.play();
        }
      },
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta: number): void {
    if (this.hasBeenHit || this.isSliding || !this.body) {
      return;
    }

    if (this.getBounds().top > this.scene.config.height) {
      EventEmitter.emit("player_loose");
      return;
    }
    const { left, right, space } = this.cursors;

    this.onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (
      isSpaceJustDown &&
      (this.onFloor || this.jumpCount < this.consecutiveJump)
    ) {
      this.jumpSound.play();
      this.setVelocityY(-this.playerSpeed * 2);
      this.jumpCount++;
    }

    if (this.onFloor) {
      this.jumpCount = 0;
    }

    if (this.isPlayingAnims("throw") || this.isPlayingAnims("slide")) {
      // salimos para que se muestre dicha animacion cuando ataco
      return;
    }

    this.onFloor
      ? this.body.velocity.x !== 0
        ? this.play("run", true)
        : this.play("idle", true)
      : this.play("jump", true);
  }

  handleAttacks() {
    this.scene.input.keyboard.on("keydown-A", () => {
      this.proyectileSound.play();
      this.play("throw", true);
      this.projectiles.fireProjectile(this, "iceball");
    });

    this.scene.input.keyboard.on("keydown-D", () => {
      if (
        this.timeFromLastSwing &&
        this.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()
      ) {
        return;
      }
      this.swipeSound.play();
      this.play("throw", true);
      this.meleeWeapon.swing(this);
      this.timeFromLastSwing = getTimestamp();
    });
  }

  handleMovements() {
    this.scene.input.keyboard.on("keydown-DOWN", () => {
      if (!this.onFloor) {
        return;
      }
      this.body.setSize(this.width, this.height / 2);
      this.setOffset(0, this.height / 2); // desplazamiento
      this.setVelocityX(0);
      this.play("slide", true);
      this.isSliding = true;
    });

    this.scene.input.keyboard.on("keyup-DOWN", () => {
      this.body.setSize(this.width, 38);
      this.setOffset(0, 0);
      this.isSliding = false;
    });
  }

  playDamageTween() {
    // Animación cuando somos golpeados
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  bounceOff() {
    this.body.touching.right // verificamos si colision es en el lado derecho o izquierdo
      ? this.setVelocity(-this.bounceVelovity)
      : this.setVelocity(this.bounceVelovity);

    setTimeout(() => {
      this.setVelocityY(-this.bounceVelovity);
    }, 0);
  }

  bounceOffByTrap() {
    this.body.blocked.right // verificamos si colision es en el lado derecho o izquierdo
      ? this.setVelocity(-this.bounceVelovity)
      : this.setVelocity(this.bounceVelovity);

    setTimeout(() => {
      this.setVelocityY(-this.bounceVelovity);
    }, 0);
  }

  takesHit(enemy: Birdman | Snaky) {
    // nos golpean
    if (this.hasBeenHit) {
      return;
    }
    this.healt -= enemy.damage; // reducimos la salud
    if (this.healt <= 0) {
      EventEmitter.emit("player_loose");
      return;
    }

    this.hasBeenHit = true;
    this.bounceOff();
    this.hitAnims = this.playDamageTween(); // animación

    this.hp.decrease(this.healt);

    this.scene.time.delayedCall(1000, () => {
      // limpiamos animación
      this.hasBeenHit = false;
      this.hitAnims.stop();
      this.clearTint();
    });
  }

  takesProjectilesHit(projectiles: Phaser.GameObjects.Group) {
    if (this.hasBeenHit) {
      return;
    }
    let damage: number;
    this.hasBeenHit = true;
    this.bounceOff();
    this.hitAnims = this.playDamageTween(); // animación

    projectiles.getChildren().forEach((projectile, index) => {
      if (projectile instanceof Projectile) {
        damage = projectile.damage;
        projectile.deliversHit(this);
        projectile.setActive(false);
        projectile.setVisible(false);
      }
    });

    this.healt -= damage;
    if (this.healt <= 0) {
      EventEmitter.emit("player_loose");
      return;
    }
    this.hp.decrease(this.healt);

    // limpiamos animación
    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      this.hitAnims.stop();
      this.clearTint();
    });
  }

  takesTrapsHit(traps: Phaser.Tilemaps.StaticTilemapLayer) {
    if (this.hasBeenHit) {
      return;
    }

    const trapProperties = traps.layer.properties[0] as { value: number };
    this.healt -= trapProperties.value; // reducimos la salud
    if (this.healt <= 0) {
      EventEmitter.emit("player_loose");
      return;
    }

    this.hasBeenHit = true;
    this.bounceOffByTrap();
    this.hitAnims = this.playDamageTween(); // animación

    this.hp.decrease(this.healt);

    this.scene.time.delayedCall(1000, () => {
      // limpiamos animación
      this.hasBeenHit = false;
      this.hitAnims.stop();
      this.clearTint();
    });
  }
}
