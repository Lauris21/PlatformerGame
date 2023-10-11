import PlayScene from "../scenes/Play";
import initAnimation from "./playerAnims";
export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: PlayScene;
  gravity: number;
  playerSpeed: number = 200;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.playerSpeed = 200;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);

    initAnimation(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta: number): void {
    const { left, right, space, up } = this.cursors;

    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor()

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if ((space.isDown || up.isDown) && onFloor) {
      this.setVelocityY(-this.playerSpeed * 1.5);
    }

    this.body.velocity.x !== 0
      ? this.play("run", true)
      : this.play("idle", true);
  }
}
