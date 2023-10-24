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

    this.activateWeapon(false);
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
