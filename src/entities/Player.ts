import PlayScene from "../scenes/Play";
import initAnimation from "../anims/playerAnims";
import { addCollider } from "../mixins/collidable";
import { Birdman } from "./BirdMan";
import HealthBar from "../components/HealthBar";
export class Player extends Phaser.Physics.Arcade.Sprite {
  addCollider: (
    otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player,
    callback: any
  ) => void;

  scene: PlayScene;

  gravity: number;
  playerSpeed: number;
  jumpCount: number;
  consecutiveJump: number;

  hasBeenHit: boolean;
  bounceVelovity: number; // velocidad de rebote
  hitAnims: Phaser.Tweens.Tween; // Animación en golpeo

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  hp: HealthBar;
  healt: number;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Object.assign(this, { addCollider }); //Mixins

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

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.healt = 100;
    this.hp = new HealthBar(this.scene, 0, 0, this.healt);

    this.setGravityY(this.gravity)
      .setSize(23, 36)
      .setCollideWorldBounds(true)
      .setOrigin(0.5, 1);

    initAnimation(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta: number): void {
    if (this.hasBeenHit) {
      return;
    }
    const { left, right, space, up } = this.cursors;

    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (
      (isSpaceJustDown || isUpJustDown) &&
      (onFloor || this.jumpCount < this.consecutiveJump)
    ) {
      this.setVelocityY(-this.playerSpeed * 2);
      this.jumpCount++;
    }

    if (onFloor) {
      this.jumpCount = 0;
    }

    onFloor
      ? this.body.velocity.x !== 0
        ? this.play("run", true)
        : this.play("idle", true)
      : this.play("jump", true);
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

  takesHit(enemy: Birdman) {
    if (this.hasBeenHit) {
      return;
    }
    this.hasBeenHit = true;
    this.bounceOff();
    this.hitAnims = this.playDamageTween();

    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      this.hitAnims.stop();
      this.clearTint();
    });

    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: () => {
    //     this.hasBeenHit = false
    //   },
    //   loop: false
    // })
  }
}
