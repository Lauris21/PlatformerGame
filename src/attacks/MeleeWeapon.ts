class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
  damage: number;
  attackSpeed: number;
  weaponAnim: string;
  wielder: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, weaponName: string) {
    super(scene, x, y, weaponName);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.damage = 15;
    this.attackSpeed = 1000;
    this.weaponAnim = weaponName + "-swing";
    this.wielder = null;

    this.setOrigin(0.5, 1);

    this.activateWeapon(false);

    this.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === this.weaponAnim) {
          this.activateWeapon(false);
          this.body.reset(0, 0);
        }
      },
      this
    );
  }

  swing(wielder: Phaser.Physics.Arcade.Sprite) {
    this.wielder = wielder; // Establecemos al constructor
    this.activateWeapon(true);
    this.body.reset(wielder.x, wielder.y);
    this.anims.play(this.weaponAnim, true);
  }

  activateWeapon(isActive: boolean) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }
}

export default MeleeWeapon;
